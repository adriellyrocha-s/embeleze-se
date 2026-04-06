import Fastify = require('fastify')
const { PrismaClient } = require('@prisma/client')
import cors = require('@fastify/cors')

const fastify = Fastify({ logger: true })
const prisma = new PrismaClient()

// Configurando CORS para permitir requisições do frontend
fastify.register(cors, {
  origin: '*' // Permite todas as origens (ajuste conforme necessário para produção)
})

// Rota para listar profissionais (A vitrine do seu app)
fastify.get('/professionals', async (request, reply) => {
  const professionals = await prisma.professional.findMany({
    include: {
      user: {
        select: {
          name: true,
          avatar: true
        }
      }
    }
  })
  
  return professionals
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

  // 1. Cria o Usuário
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password, // Lembre-se: em produção usaremos bcrypt aqui!
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
      rating: 5.0 // Começa com nota máxima!
    }
  })

  return reply.status(201).send(professional)
})

start()