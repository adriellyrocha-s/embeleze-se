import { Search, ChevronDown } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ProfessionalList } from '../components/ProfessionalList'
import type { ProfessionalCard } from '../components/ProfessionalList'

const categories = [
  "Todas", "Manicure", "Pedicure", "Cabeleireiro", "Maquiadora", 
  "Designer de Sobrancelhas", "Depiladora", "Massagista", "Esteticista"
]

type ProfessionalsPageProps = {
  onSelectProfessional?: (professional: ProfessionalCard) => void
  initialCategory?: string
}

export function ProfessionalsPage({ onSelectProfessional, initialCategory = 'Todas' }: ProfessionalsPageProps) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)

  useEffect(() => {
    setSelectedCategory(initialCategory)
  }, [initialCategory])

  return (
    <div className="min-h-screen bg-[#FDF8F8] pt-32 pb-20">
      <div className="max-w-[1440px] mx-auto px-16">
        
        {/* Cabeçalho da Página */}
        <header className="mb-12">
          <span className="text-[#C38B94] uppercase tracking-[0.4em] text-[11px] font-bold block mb-4">
            Encontre sua profissional
          </span>
          <h1 className="font-serif text-8xl text-[#1A1A1A] tracking-tighter mb-12">Profissionais</h1>

          {/* Barra de Busca e Filtro Dropdown */}
          <div className="flex gap-4 mb-8">
            <div className="relative flex-1 group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#C38B94] transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Buscar por nome, bairro ou cidade..."
                className="w-full bg-white border border-gray-100 py-5 pl-16 pr-6 rounded-full text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#C38B94]/10 focus:border-[#C38B94] transition-all"
              />
            </div>
            
            <button className="bg-white border border-gray-100 px-8 py-5 rounded-full text-sm flex items-center gap-4 text-gray-700 hover:border-[#C38B94] transition-all shadow-sm">
              Melhor Avaliação
              <ChevronDown size={18} className="text-[#C38B94]" />
            </button>
          </div>

          {/* Badges de Categorias (Scroll Horizontal se necessário) */}
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button 
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2.5 rounded-full text-[13px] transition-all border ${
                  selectedCategory === cat
                  ? "bg-[#C38B94] text-white border-[#C38B94] shadow-lg shadow-[#C38B94]/20" 
                  : "bg-white text-gray-500 border-gray-100 hover:border-[#C38B94] hover:text-[#C38B94]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </header>

        {/* Listagem de Cards (Reaproveitando o componente que já criamos) */}
        <ProfessionalList
          onSelectProfessional={onSelectProfessional}
          selectedCategory={selectedCategory}
        />
      </div>
    </div>
  )
}

export default ProfessionalsPage