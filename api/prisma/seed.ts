const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()

async function main() {
  // Limpa o banco antes de começar (opcional, evita duplicados)
  await prisma.appointment.deleteMany()
  await prisma.professional.deleteMany()
  await prisma.user.deleteMany()

  const defaultPasswordHash = await bcrypt.hash('password123', 10)
  const adminEmail = (process.env.ADMIN_DEFAULT_EMAIL || 'admin@embeleze.se').toLowerCase()
  const adminPasswordHash = await bcrypt.hash(process.env.ADMIN_DEFAULT_PASSWORD || 'Admin@123', 10)

  await prisma.user.create({
    data: {
      name: 'Administrador Embeleze-se',
      email: adminEmail,
      password: adminPasswordHash,
      role: 'ADMIN',
    },
  })

  // Criando a Camila (Maquiadora)
  await prisma.user.create({
    data: {
      name: 'Camila Oliveira',
      email: 'camila@embeleze.se',
      password: defaultPasswordHash,
      role: 'PROFESSIONAL',
      professional: {
        create: {
          category: 'Maquiadora',
          bio: 'Especialista em maquiagem social e noivas.',
          location: 'Moema',
          basePrice: 80.00,
          rating: 5.0,
          status: 'APTO',
        }
      }
    }
  })

  // Criando a Ana Carolina (Manicure)
  await prisma.user.create({
    data: {
      name: 'Ana Carolina Silva',
      email: 'ana@embeleze.se',
      password: defaultPasswordHash,
      role: 'PROFESSIONAL',
      professional: {
        create: {
          category: 'Manicure',
          bio: 'Unhas perfeitas com atendimento VIP.',
          location: 'Vila Mariana',
          basePrice: 45.00,
          rating: 4.9,
          status: 'APTO',
        }
      }
    }
  })

  console.log('✅ Banco de dados semeado com sucesso!')
  console.log(`🔐 Admin criado: ${adminEmail}`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
  