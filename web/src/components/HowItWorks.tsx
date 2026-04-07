import { Search, Calendar, CreditCard, Heart } from 'lucide-react'

const steps = [
  {
    id: '01',
    title: 'Encontre',
    desc: 'Busque profissionais de beleza em sua região por categoria e avaliação.',
    icon: Search
  },
  {
    id: '02',
    title: 'Agenda',
    desc: 'Escolha o horário ideal e confirme o seu agendamento online.',
    icon: Calendar
  },
  {
    id: '03',
    title: 'Página Online',
    desc: 'Pagamento seguro pela plataforma. Pix, crédito ou débito.',
    icon: CreditCard
  },
  {
    id: '04',
    title: 'Avalie',
    desc: 'Após o serviço, aproveite um profissional e ajude a comunidade.',
    icon: Heart
  }
]

export function HowItWorks() {
  return (
    <section className="bg-[#FDF8F8] py-32 px-16">
      <div className="max-w-7xl mx-auto text-center">
        
        {/* Título da Seção */}
        <div className="mb-24">
          <span className="text-[#C38B94] uppercase tracking-[0.6em] text-[11px] font-bold block mb-4">
            Como Funciona
          </span>
          <h2 className="font-serif text-7xl text-[#1A1A1A] tracking-tighter">Simples e elegante</h2>
        </div>

        {/* Grid de Passos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center group">
              <div className="w-20 h-20 bg-[#F3E9E9]/50 rounded-[2rem] flex items-center justify-center mb-10 transition-all duration-700 group-hover:bg-[#C38B94]">
                <step.icon size={28} strokeWidth={1.2} className="text-[#C38B94] group-hover:text-white transition-colors" />
              </div>

              <span className="text-[#C38B94] font-serif italic text-lg mb-2">{step.id}</span>
              <h3 className="font-serif text-2xl text-gray-900 mb-4">{step.title}</h3>
              <p className="text-gray-400 text-[13px] font-light leading-relaxed px-6">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}