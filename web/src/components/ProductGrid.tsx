import { ShoppingBag, Truck, ArrowRight } from 'lucide-react'

export type ProductItem = {
  id: number
  category: string
  name: string
  price: string
  image: string
}

const products: ProductItem[] = [
  {
    id: 1,
    category: 'Corpo',
    name: 'Creme Hidratante Corporal Manteiga d...',
    price: '49,90',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=500'
  },
  {
    id: 2,
    category: 'Acessórios',
    name: 'Kit Pincéis Profissionais - 12 peças',
    price: '159,90',
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=500'
  },
  {
    id: 3,
    category: 'Cabelo',
    name: 'Óleo de Argan Capilar 100ml',
    price: '55,00',
    image: 'https://images.unsplash.com/photo-1626784215021-2e39ccf971cd?q=80&w=500'
  },
  {
    id: 4,
    category: 'Cabelo',
    name: 'Sérum Capilar Reparador',
    price: '67,50',
    image: 'https://images.unsplash.com/photo-1594465919760-441fe5908ab0?q=80&w=500'
  },
  {
    id: 5,
    category: 'Unhas',
    name: 'Base Fortalecedora com Queratina',
    price: '29,90',
    image: 'https://images.unsplash.com/photo-1610992015732-2449b76344bc?q=80&w=500'
  },
  {
    id: 6,
    category: 'Unhas',
    name: 'Kit Esmaltes Nude Elegance',
    price: '42,00',
    image: 'https://images.unsplash.com/photo-1631214540242-6f7a8b0d7f22?q=80&w=500'
  },
  {
    id: 7,
    category: 'Maquiagem',
    name: 'Base Líquida HD Efeito Natural',
    price: '89,90',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=500'
  },
  {
    id: 8,
    category: 'Maquiagem',
    name: 'Paleta de Sombras Rosé Glam',
    price: '74,90',
    image: 'https://images.unsplash.com/photo-1487412912498-0447578fcca8?q=80&w=500'
  },
  {
    id: 9,
    category: 'Pele',
    name: 'Sérum Vitamina C Antioxidante',
    price: '99,90',
    image: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?q=80&w=500'
  },
  {
    id: 10,
    category: 'Pele',
    name: 'Protetor Solar Facial FPS 60',
    price: '78,00',
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?q=80&w=500'
  },
  {
    id: 11,
    category: 'Corpo',
    name: 'Óleo Corporal Amêndoas e Baunilha',
    price: '62,50',
    image: 'https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=500'
  },
  {
    id: 12,
    category: 'Acessórios',
    name: 'Necessaire Premium Organizadora',
    price: '49,00',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=500'
  },
  {
    id: 13,
    category: 'Acessórios',
    name: 'Escova Oval Modeladora Profissional',
    price: '119,90',
    image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?q=80&w=500'
  }
]

type ProductGridProps = {
  onAddToCart?: (product: ProductItem) => void
  selectedCategory?: string
  searchTerm?: string
}

function normalizeText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

export function ProductGrid({ onAddToCart, selectedCategory = 'Todos', searchTerm = '' }: ProductGridProps) {
  const normalizedCategory = normalizeText(selectedCategory)
  const normalizedSearch = normalizeText(searchTerm.trim())

  const visibleProducts = products.filter((product) => {
    const categoryMatch = normalizedCategory === 'todos' || normalizeText(product.category) === normalizedCategory
    const searchMatch =
      normalizedSearch.length === 0 ||
      normalizeText(product.name).includes(normalizedSearch) ||
      normalizeText(product.category).includes(normalizedSearch)

    return categoryMatch && searchMatch
  })

  return (
    <section className="bg-[#FDF8F8] px-16 pb-32">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Cabeçalho da Seção */}
        <div className="flex justify-between items-end mb-12">
          <div className="space-y-2">
            <span className="text-[#C38B94] uppercase tracking-[0.5em] text-[10px] font-bold block">Loja</span>
            <h2 className="font-serif text-7xl text-[#1A1A1A] tracking-tighter">Produtos</h2>
          </div>
          <button className="group flex items-center gap-2 text-[#C38B94] text-xs font-bold uppercase tracking-widest hover:opacity-60 transition-all">
            Ver todos <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Badge iFood */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 bg-[#F3E9E9] px-4 py-2 rounded-xl text-[11px] text-gray-600 font-medium">
            <Truck size={14} className="text-gray-400" />
            Entrega rápida
          </div>
        </div>

        {/* Grid de Produtos */}
        {visibleProducts.length === 0 ? (
          <p className="text-gray-500 text-sm">Nenhum produto encontrado para os filtros selecionados.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {visibleProducts.map((product) => (
            <div key={product.id} className="group cursor-pointer">
              {/* Imagem do Produto */}
              <div className="relative aspect-[4/3] mb-6 overflow-hidden rounded-[2.5rem] shadow-sm bg-white">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Badge Laranja de Entrega (Igual à Imagem) */}
                <div className="absolute top-4 right-4 bg-[#FF6B00] p-2 rounded-xl shadow-lg">
                  <Truck size={14} className="text-white" fill="white" />
                </div>

                {/* Botão ADICIONAR que aparece no Hover */}
                <div className="absolute inset-x-4 bottom-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <button
                    type="button"
                    onClick={() => onAddToCart?.(product)}
                    className="w-full bg-[#C38B94]/90 backdrop-blur-md text-white py-3 rounded-2xl flex items-center justify-center gap-2 text-sm font-medium shadow-xl hover:bg-[#C38B94] transition-colors"
                  >
                    <ShoppingBag size={16} />
                    adicionar
                  </button>
                </div>
              </div>

              {/* Infos do Produto */}
              <div className="space-y-1 px-2">
                <span className="text-[11px] text-gray-400 font-light tracking-wide italic">
                  {product.category}
                </span>
                <h3 className="font-serif text-lg text-[#1A1A1A] leading-tight group-hover:text-[#C38B94] transition-colors">
                  {product.name}
                </h3>
                <p className="text-[#C38B94] font-serif text-xl pt-1">
                  R$ {product.price}
                </p>
              </div>
            </div>
          ))}
          </div>
        )}
      </div>
    </section>
  )
}