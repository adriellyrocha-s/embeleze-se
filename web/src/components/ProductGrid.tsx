import { ShoppingBag, Truck, ArrowRight } from 'lucide-react'

const products = [
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
  }
]

export function ProductGrid() {
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
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
                  <button className="w-full bg-[#C38B94]/90 backdrop-blur-md text-white py-3 rounded-2xl flex items-center justify-center gap-2 text-sm font-medium shadow-xl hover:bg-[#C38B94] transition-colors">
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
      </div>
    </section>
  )
}