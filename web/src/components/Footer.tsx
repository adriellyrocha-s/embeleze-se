export function Footer() {
  return (
    <footer className="bg-[#fff] pt-24 pb-12 px-16 border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-24">
          
          {/* Coluna Logo e Descrição - Ocupa 5 colunas */}
          <div className="md:col-span-5 space-y-6">
            <h2 className="font-serif text-3xl text-[#1A1A1A] font-bold">Embeleze-se</h2>
            <p className="text-gray-400 text-sm font-light leading-relaxed max-w-sm">
              Uma plataforma que conecta mulheres a profissionais de beleza autônomas. 
              Agende serviços, compre produtos e transforme-se no conforto da sua casa.
            </p>
          </div>

          {/* Coluna Navegação - Ocupa 3 colunas */}
          <div className="md:col-span-3 space-y-6">
            <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-900">NAVEGAÇÃO</h3>
            <ul className="space-y-4 text-[13px] text-gray-500 font-light">
              <li className="italic text-rose-300 text-[#C38B94]">Não se trata de uma questão de...</li>
              <li className="hover:text-rose-400 cursor-pointer">Produtos</li>
              <li className="hover:text-rose-400 cursor-pointer">Profissionais</li>
              <li className="hover:text-rose-400 cursor-pointer">Solicitar Serviços</li>
              <li className="hover:text-rose-400 cursor-pointer">Painel Parceira</li>
            </ul>
          </div>

          {/* Coluna Categorias - Ocupa 3 colunas */}
          <div className="md:col-span-3 space-y-6">
            <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-900">CATEGORIAS</h3>
            <ul className="space-y-4 text-[13px] text-gray-500 font-light">
              <li className="hover:text-rose-400 cursor-pointer">Manicure</li>
              <li className="hover:text-rose-400 cursor-pointer">Cabeleireiro</li>
              <li className="hover:text-rose-400 cursor-pointer">Maquiagem</li>
              <li className="hover:text-rose-400 cursor-pointer">Massagem</li>
            </ul>
          </div>
        </div>

        {/* Linha Final de Copyright e iFood */}
        <div className="pt-10 border-t border-gray-100 flex justify-between items-center text-[11px] text-gray-400 font-light">
        <p>© 2026 Embeleze-se. Todos os direitos reservados.</p>
        <p className="italic text-rose-300 text-[#C38B94]">Sofisticação em cada detalhe.</p>
        </div>
      </div>
    </footer>
  )
}