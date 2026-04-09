import Fastify = require('fastify')
require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
import cors = require('@fastify/cors')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')

const fastify = Fastify({ logger: true })
const prisma = new PrismaClient()

function getValidatedAdminKey(headerValue: string | string[] | undefined) {
  const expectedAdminKey = process.env.ADMIN_API_KEY

  if (!expectedAdminKey) {
    return { ok: false as const, code: 503, message: 'ADMIN_API_KEY nao configurada no servidor.' }
  }

  const receivedKey = Array.isArray(headerValue) ? headerValue[0] : headerValue
  if (!receivedKey || receivedKey !== expectedAdminKey) {
    return { ok: false as const, code: 401, message: 'Nao autorizado.' }
  }

  return { ok: true as const }
}

function addBusinessDays(startDate: Date, businessDays: number) {
  const result = new Date(startDate)
  let remaining = businessDays

  while (remaining > 0) {
    result.setDate(result.getDate() + 1)
    const day = result.getDay()
    if (day !== 0 && day !== 6) {
      remaining -= 1
    }
  }

  return result
}

async function sendPartnerUnderReviewEmail(partnerName: string, partnerEmail: string) {
  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT || 587)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  const from = process.env.SMTP_FROM || 'no-reply@embeleze.se'

  if (!host || !user || !pass) {
    fastify.log.warn('SMTP nao configurado. E-mail de analise de parceira nao foi enviado.')
    return false
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  })

  const deadline = addBusinessDays(new Date(), 5)
  const deadlineFormatted = deadline.toLocaleDateString('pt-BR')

  await transporter.sendMail({
    from,
    to: partnerEmail,
    subject: 'Recebemos seu cadastro de parceira - Em analise',
    text: `Ola, ${partnerName}.\n\nRecebemos seu cadastro na Embeleze-se e ele esta em analise.\nNosso time retorna em ate 5 dias uteis (previsao: ${deadlineFormatted}).\n\nVoce recebera um novo e-mail assim que o perfil for aprovado.\n\nEquipe Embeleze-se`,
  })

  return true
}

function normalizePartnerStatus(value: unknown): 'ANALISANDO' | 'APTO' | 'REPROVADO' {
  const normalized = String(value || '').toUpperCase()
  if (normalized === 'APTO' || normalized === 'REPROVADO') {
    return normalized
  }
  return 'ANALISANDO'
}

// Configurando CORS para permitir requisições do frontend
fastify.register(cors, {
  origin: '*' // Permite todas as origens (ajuste conforme necessário para produção)
})

// Cadastro automatico de cliente com login imediato
fastify.post('/auth/customer/register', async (request, reply) => {
  const { name, email } = request.body as any

  if (!name || !email) {
    return reply.status(400).send({ message: 'Campos obrigatorios: name e email.' })
  }

  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser && existingUser.role !== 'CUSTOMER') {
    return reply.status(409).send({ message: 'Este email ja esta em uso por outro tipo de conta.' })
  }

  let user = existingUser
  if (!user) {
    const generatedPassword = `cust_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
    const hashedPassword = await bcrypt.hash(generatedPassword, 10)

    user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'CUSTOMER',
      },
    })
  }

  return reply.status(201).send({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  })
})

// Cadastro de parceira usando o banco de dados
fastify.post('/auth/partner/register', async (request, reply) => {
  const { name, email, password, category, location, basePrice, avatar } = request.body as any

  if (!name || !email || !password || !category) {
    return reply.status(400).send({ message: 'Campos obrigatorios: name, email, password e category.' })
  }

  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) {
    return reply.status(409).send({ message: 'Email ja cadastrado.' })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      avatar,
      role: 'PROFESSIONAL',
      professional: {
        create: {
          category,
          location: location || 'Nao informado',
          basePrice: Number(basePrice) || 0,
          rating: 5.0,
          status: 'ANALISANDO',
        },
      },
    },
    include: {
      professional: true,
    },
  })

  await sendPartnerUnderReviewEmail(user.name, user.email)

  return reply.status(201).send({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    professional: user.professional,
    message: 'Cadastro recebido! Seu perfil esta em analise e voce recebera retorno em ate 5 dias uteis.',
  })
})

// Login de parceira por usuarios cadastrados no banco
fastify.post('/auth/partner/login', async (request, reply) => {
  const { email, password } = request.body as any

  if (!email || !password) {
    return reply.status(400).send({ message: 'Informe email e senha.' })
  }

  const user = await prisma.user.findUnique({
    where: { email },
    include: { professional: true },
  })

  if (!user || user.role !== 'PROFESSIONAL' || !user.professional) {
    return reply.status(401).send({ message: 'Credenciais invalidas.' })
  }

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    return reply.status(401).send({ message: 'Credenciais invalidas.' })
  }

  return reply.send({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    professional: user.professional,
  })
})

// Login administrativo
fastify.post('/auth/admin/login', async (request, reply) => {
  const { email, password } = request.body as any

  if (!email || !password) {
    return reply.status(400).send({ message: 'Informe email e senha.' })
  }

  const adminApiKey = process.env.ADMIN_API_KEY
  if (!adminApiKey) {
    return reply.status(503).send({ message: 'ADMIN_API_KEY nao configurada no servidor.' })
  }

  const user = await prisma.user.findUnique({
    where: { email: String(email).trim().toLowerCase() },
  })

  if (!user || user.role !== 'ADMIN') {
    return reply.status(401).send({ message: 'Credenciais invalidas.' })
  }

  const isMatch = await bcrypt.compare(String(password), user.password)
  if (!isMatch) {
    return reply.status(401).send({ message: 'Credenciais invalidas.' })
  }

  return reply.send({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    adminApiKey,
  })
})

// Rota para listar profissionais (A vitrine do seu app)
fastify.get('/professionals', async (request, reply) => {
  let professionals: any[] = []

  try {
    professionals = await prisma.professional.findMany({
      where: {
        status: 'APTO',
      } as any,
      include: {
        user: {
          select: {
            name: true,
            avatar: true,
          },
        },
      },
    })
  } catch {
    // Fallback para ambientes em que o client Prisma ainda nao reconhece o campo status.
    const rawList = await prisma.professional.findMany({
      include: {
        user: {
          select: {
            name: true,
            avatar: true,
          },
        },
      },
    })

    professionals = rawList.filter((item: any) => normalizePartnerStatus(item?.status) === 'APTO')
  }
  
  return professionals
})

// Criar agendamento para uma profissional
fastify.post('/appointments', async (request, reply) => {
  const {
    customerId,
    customerName,
    customerEmail,
    professionalId,
    professionalName,
    professionalCategory,
    professionalLocation,
    professionalBasePrice,
    professionalAvatar,
    scheduledAt,
    totalPrice,
  } = request.body as any

  if (!professionalId || !scheduledAt) {
    return reply.status(400).send({ message: 'Campos obrigatorios: professionalId e scheduledAt.' })
  }

  let professional = await prisma.professional.findUnique({ where: { id: professionalId } })
  if (!professional) {
    if (typeof professionalId !== 'string' || !professionalId.startsWith('fallback-')) {
      return reply.status(404).send({ message: 'Profissional nao encontrada.' })
    }

    const fallbackEmail = `${professionalId}@partner.embeleze.se`
    const existingFallbackUser = await prisma.user.findUnique({
      where: { email: fallbackEmail },
      include: { professional: true },
    })

    if (existingFallbackUser?.professional) {
      professional = existingFallbackUser.professional
    } else {
      const generatedPassword = `partner_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
      const hashedPassword = await bcrypt.hash(generatedPassword, 10)

      const fallbackUser = await prisma.user.create({
        data: {
          name: (typeof professionalName === 'string' && professionalName.trim()) || 'Profissional Embeleze-se',
          email: fallbackEmail,
          password: hashedPassword,
          avatar: typeof professionalAvatar === 'string' ? professionalAvatar : null,
          role: 'PROFESSIONAL',
          professional: {
            create: {
              category: (typeof professionalCategory === 'string' && professionalCategory.trim()) || 'Beleza',
              location: (typeof professionalLocation === 'string' && professionalLocation.trim()) || 'Sao Paulo',
              basePrice: Number(professionalBasePrice) || 0,
              rating: 5,
              status: 'APTO',
            },
          },
        },
        include: { professional: true },
      })

      professional = fallbackUser.professional
    }
  }

  let customerRecord = null

  if (customerId) {
    customerRecord = await prisma.user.findUnique({ where: { id: customerId } })
  }

  const normalizedEmail = typeof customerEmail === 'string' ? customerEmail.trim().toLowerCase() : ''

  if (!customerRecord && normalizedEmail) {
    customerRecord = await prisma.user.findUnique({ where: { email: normalizedEmail } })
  }

  if (customerRecord && customerRecord.role !== 'CUSTOMER') {
    return reply.status(409).send({ message: 'Email pertence a outro tipo de conta.' })
  }

  if (!customerRecord) {
    const generatedPassword = `guest_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
    const hashedPassword = await bcrypt.hash(generatedPassword, 10)
    const fallbackEmail = normalizedEmail || `guest_${Date.now()}_${Math.random().toString(36).slice(2, 8)}@guest.embeleze.se`

    customerRecord = await prisma.user.create({
      data: {
        name: (typeof customerName === 'string' && customerName.trim()) || 'Cliente Embeleze-se',
        email: fallbackEmail,
        password: hashedPassword,
        role: 'CUSTOMER',
      },
    })
  }

  const appointment = await prisma.appointment.create({
    data: {
      scheduledAt: new Date(scheduledAt),
      totalPrice: Number(totalPrice) || Number(professional.basePrice),
      customerId: customerRecord.id,
      professionalId: professional.id,
      status: 'PENDING',
    },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  })

  return reply.status(201).send(appointment)
})

// Listar agendamentos da profissional (para painel)
fastify.get('/professionals/:professionalId/appointments', async (request, reply) => {
  const { professionalId } = request.params as any

  const appointments = await prisma.appointment.findMany({
    where: { professionalId },
    include: {
      customer: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      scheduledAt: 'asc',
    },
  })

  return appointments
})

// Atualizar status de aprovacao do perfil da profissional (uso administrativo)
fastify.get('/admin/professionals', async (request, reply) => {
  const auth = getValidatedAdminKey(request.headers['x-admin-key'])
  if (!auth.ok) {
    return reply.status(auth.code).send({ message: auth.message })
  }

  const { status } = request.query as any
  const normalizedStatus = typeof status === 'string' ? status.toUpperCase() : undefined

  if (normalizedStatus && !['ANALISANDO', 'APTO', 'REPROVADO'].includes(normalizedStatus)) {
    return reply.status(400).send({ message: 'Filtro de status invalido. Use ANALISANDO, APTO, REPROVADO ou vazio.' })
  }

  let professionals: any[] = []

  try {
    professionals = await prisma.professional.findMany({
      where: normalizedStatus ? ({ status: normalizedStatus } as any) : undefined,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        user: {
          createdAt: 'desc',
        },
      },
    })
  } catch {
    // Fallback para ambientes em que o client Prisma ainda nao reconhece o campo status.
    const rawList = await prisma.professional.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        user: {
          createdAt: 'desc',
        },
      },
    })

    const listWithStatus = rawList.map((item: any) => ({
      ...item,
      status: normalizePartnerStatus(item?.status),
    }))

    professionals = normalizedStatus
      ? listWithStatus.filter((item: any) => item.status === normalizedStatus)
      : listWithStatus
  }

  return reply.send(professionals)
})

// Atualizar status de aprovacao do perfil da profissional (uso administrativo)
fastify.patch('/admin/professionals/:professionalId/status', async (request, reply) => {
  const auth = getValidatedAdminKey(request.headers['x-admin-key'])
  if (!auth.ok) {
    return reply.status(auth.code).send({ message: auth.message })
  }

  const { professionalId } = request.params as any
  const { status } = request.body as any

  if (!['ANALISANDO', 'APTO', 'REPROVADO'].includes(status)) {
    return reply.status(400).send({ message: 'Status invalido. Use ANALISANDO, APTO ou REPROVADO.' })
  }

  const updated = await prisma.professional.update({
    where: { id: professionalId },
    data: { status },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  })

  return reply.send(updated)
})

// Rodando o servidor
const start = async () => {
  try {
    await fastify.listen({ port: 3333, host: '0.0.0.0' })
    console.log('🚀 API Embeleze-se rodando em http://localhost:3333')
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

// Rota de teste inicial
fastify.get('/', async () => {
  return { message: 'Bem-vinda à API da Embeleze-se! ✨' }
}),

// Rota para cadastrar uma nova profissional
fastify.post('/professionals', async (request, reply) => {
  const { name, email, password, category, location, basePrice, avatar } = request.body as any

  const hashedPassword = await bcrypt.hash(password, 10)

  // 1. Cria o Usuário
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      avatar,
      role: 'PROFESSIONAL'
    }
  })

  // 2. Cria o Perfil Profissional vinculado
  const professional = await prisma.professional.create({
    data: {
      userId: user.id,
      category,
      location,
      basePrice: Number(basePrice),
      rating: 5.0, // Começa com nota máxima!
      status: 'ANALISANDO',
    }
  })

  return reply.status(201).send(professional)
})

start()