import { Search, ShoppingBag, User } from 'lucide-react'

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-16 py-8 bg-white/40 backdrop-blur-md transition-all">
      
      {/* LOGO */}
      <div className="font-serif text-2xl font-bold tracking-tight text-[#1A1A1A]">
        Embeleze-se
      </div>

      {/* LINKS CENTRALIZADOS (OPCIONAL - CONFORME SEU DESIGN) */}
      <div className="hidden lg:flex gap-10 text-[10px] uppercase tracking-[0.2em] text-gray-500 font-semibold">
        <span className="text-rose-300 normal-case italic font-serif text-sm lowercase text-[#C38B94] tracking-normal pr-4">
          Não se trata de uma questão de...
        </span>
        <a href="#" className="hover:text-rose-400 transition-colors">Produtos</a>
        <a href="#" className="hover:text-rose-400 transition-colors">Profissionais</a>
        <a href="#" className="hover:text-rose-400 transition-colors">Solicitar Serviço</a>
                <a href="#" className="hover:text-rose-400 transition-colors font-bold text-gray-700">Painel Parceira</a>
      </div>

      {/* ÍCONES REAIS (LUCIDE) */}
      <div className="flex gap-8 items-center text-gray-800">
        <Search 
          size={20} 
          strokeWidth={1.5} 
          className="cursor-pointer hover:text-rose-400 transition-all" 
        />
        <ShoppingBag 
          size={20} 
          strokeWidth={1.5} 
          className="cursor-pointer hover:text-rose-400 transition-all" 
        />
        <User 
          size={20} 
          strokeWidth={1.5} 
          className="cursor-pointer hover:text-rose-400 transition-all" 
        />
      </div>
    </nav>
  )
}