export function Navbar() {
  return (
    <nav className="absolute top-0 left-0 w-full z-50 flex justify-between items-center px-12 py-8">
      <div className="font-serif text-2xl font-bold tracking-tight text-[#1A1A1A]">
        Embeleze-se
      </div>

      <div className="hidden lg:flex gap-10 text-[10px] uppercase tracking-[0.2em] text-gray-500 font-semibold">
        <a href="#" className="hover:text-rose-400 transition-colors">Profissionais</a>
        <a href="#" className="hover:text-rose-400 transition-colors">Solicitar</a>
        <a href="#" className="hover:text-rose-400 transition-colors">Produtos</a>
        <a href="#" className="hover:text-rose-400 transition-colors">Painel Parceira</a>
      </div>

      <div className="flex gap-6 items-center text-xl text-gray-700">
        <button className="hover:scale-110 transition-transform">🔍</button>
        <button className="hover:scale-110 transition-transform">👜</button>
        <button className="hover:scale-110 transition-transform">👤</button>
      </div>
    </nav>
  )
}