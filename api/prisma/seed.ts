import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Limpa o banco antes de começar (opcional, evita duplicados)
  await prisma.appointment.deleteMany()
  await prisma.professional.deleteMany()
  await prisma.user.deleteMany()

  // Criando a Camila (Maquiadora)
  await prisma.user.create({
    data: {
      name: 'Camila Oliveira',
      email: 'camila@embeleze.se',
      password: 'password123', 
      role: 'PROFESSIONAL',
      professional: {
        create: {
          category: 'Maquiadora',
          bio: 'Especialista em maquiagem social e noivas.',
          location: 'Moema',
          basePrice: 80.00,
          rating: 5.0
        }
      }
    }
  })

  // Criando a Ana Carolina (Manicure)
  await prisma.user.create({
    data: {
      name: 'Ana Carolina Silva',
      email: 'ana@embeleze.se',
      password: 'password123',
      role: 'PROFESSIONAL',
      professional: {
        create: {
          category: 'Manicure',
          bio: 'Unhas perfeitas com atendimento VIP.',
          location: 'Vila Mariana',
          basePrice: 45.00,
          rating: 4.9
        }
      }
    }
  })

  console.log('✅ Banco de dados semeado com sucesso!')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
  