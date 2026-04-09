import { Hand, Scissors, Sparkles, Eye, Heart, Flower2 } from 'lucide-react'

const categories = [
  { id: 1, name: 'Manicure', desc: 'Unhas perfeitas', icon: Hand, targetCategory: 'Manicure' },
  { id: 2, name: 'Cabeleireiro', desc: 'Corte e estilo', icon: Scissors, targetCategory: 'Cabeleireiro' },
  { id: 3, name: 'Maquiadora', desc: 'Maquiagem profissional', icon: Sparkles, targetCategory: 'Maquiadora' },
  { id: 4, name: 'Designer', desc: 'Design de sobrancelhas', icon: Eye, targetCategory: 'Designer de Sobrancelhas' },
  { id: 5, name: 'Massagista', desc: 'Massagem', icon: Heart, targetCategory: 'Massagista' },
  { id: 6, name: 'Esteticista', desc: 'Cuidados com a pele', icon: Flower2, targetCategory: 'Esteticista' },
]

type CategorySectionProps = {
  onSelectCategory?: (category: string) => void
}

export function CategorySection({ onSelectCategory }: CategorySectionProps) {
  return (
    <section className="bg-[#F3E9E9] py-24 px-16">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex justify-between items-end mb-16">
          <div className="space-y-4">
            <span className="uppercase tracking-[0.4em] text-[10px] text-[#C38B94] font-extrabold">Serviços</span>
            <h2 className="font-serif text-5xl text-[#1A1A1A]">O que você procura?</h2>
          </div>
          <p className="max-w-[280px] text-gray-600 text-[13px] font-light leading-relaxed">
            Encontre profissionais especializados em cada categoria, todos com avaliações verificadas.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory?.(cat.targetCategory)}
              className="bg-white rounded-[2.5rem] p-10 flex flex-col items-center text-center shadow-xl shadow-black/5 hover:-translate-y-2 transition-all cursor-pointer"
            >
              <div className="w-16 h-16 bg-[#FDF8F8] rounded-full flex items-center justify-center mb-6">
                <cat.icon size={26} strokeWidth={1.2} className="text-[#C38B94]" />
              </div>
              <h3 className="font-serif text-lg text-gray-800 mb-1">{cat.name}</h3>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest">{cat.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}