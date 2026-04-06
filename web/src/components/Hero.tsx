export function Hero() {
  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-[#E5E5E5]">
      {/* Imagem de Fundo com Blur e Opacidade */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=2000" 
          alt="Beauty background"
          className="w-full h-full object-cover opacity-60 scale-105"
          style={{ filter: 'blur(4px)' }} // O toque artístico do seu design
        />
        {/* Overlay para suavizar ainda mais a transição */}
        <div className="absolute inset-0 bg-white/30" />
      </div>

      {/* Conteúdo Central */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-4xl">
        <div className="flex items-center gap-2 mb-6">
          <span className="w-2 h-2 bg-green-500 rounded-full" />
          <span className="text-[10px] tracking-[0.3em] uppercase text-gray-600 font-medium">
            Profissionais disponíveis agora
          </span>
        </div>

        <h1 className="font-serif text-7xl md:text-9xl text-[#1A1A1A] leading-[0.9]">
          A tia <br />
          <span className="text-[#C28C91] italic font-normal lowercase tracking-tighter">
            vem até você
          </span>
        </h1>

        <p className="mt-10 text-gray-700 text-lg md:text-xl font-light leading-relaxed max-w-2xl">
          Conecte-se com profissionais de beleza autônomos de sua região. 
          Agende serviços, compre produtos — tudo com entrega rápida.
        </p>

        <div className="mt-12 flex flex-wrap gap-4 justify-center">
          <button className="bg-[#C28C91] text-white px-10 py-5 rounded-full text-sm font-medium flex items-center gap-3 hover:bg-[#b17a80] transition-all shadow-xl shadow-rose-200">
            Solicitar Serviço
            <span className="text-xl">→</span>
          </button>
          
          <button className="bg-white/10 backdrop-blur-md border border-white/50 text-gray-800 px-10 py-5 rounded-full text-sm font-medium hover:bg-white/40 transition-all">
            Ver Produtos
          </button>
        </div>

        {/* Localização Badge */}
        <div className="mt-16 flex items-center gap-2 text-gray-500 text-xs">
          <span className="text-lg">📍</span>
          12 profissionais ativos num raio de 5km
        </div>
      </div>
    </div>
  )
}