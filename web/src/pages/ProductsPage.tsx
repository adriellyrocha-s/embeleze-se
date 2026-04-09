import { Search, Truck } from 'lucide-react'
import { useState } from 'react'
import { ProductGrid } from '../components/ProductGrid'
import type { ProductItem } from '../components/ProductGrid'

const categories = ["Todos", "Cabelo", "Unhas", "Maquiagem", "Pele", "Corpo", "Acessórios"]

type ProductsPageProps = {
  onAddToCart?: (product: ProductItem) => void
}

export function ProductsPage({ onAddToCart }: ProductsPageProps) {
  const [selectedCategory, setSelectedCategory] = useState('Todos')
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div className="min-h-screen bg-[#FDF8F8] pt-32 pb-20">
      <div className="max-w-[1440px] mx-auto px-16">
        
        <header className="mb-12">
          <span className="text-[#C38B94] uppercase tracking-[0.4em] text-[11px] font-bold block mb-4">Loja</span>
          <h1 className="font-serif text-8xl text-[#1A1A1A] tracking-tighter mb-4">Produtos de Beleza</h1>
          
          <div className="flex items-center gap-2 text-[#FF6B00] mb-12">
            <Truck size={18} />
            <span className="text-xs font-medium tracking-wide">Entrega rápida</span>
          </div>

          {/* Barra de Busca */}
          <div className="mb-10">
            <div className="relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#C38B94] transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="w-full bg-white border border-gray-100 py-6 pl-16 pr-6 rounded-full text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#C38B94]/10 focus:border-[#C38B94] transition-all"
              />
            </div>
          </div>

          {/* Filtros */}
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button 
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-8 py-3 rounded-full text-[13px] transition-all border ${
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

        {/* Reaproveita o Grid de Produtos que já criamos */}
        <ProductGrid
          onAddToCart={onAddToCart}
          selectedCategory={selectedCategory}
          searchTerm={searchTerm}
        />
      </div>
    </div>
  )
}