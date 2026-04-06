import { UserPlus, Camera } from 'lucide-react'

export function PartnerRegister() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4 space-y-8 bg-[#F9F6F3] min-h-screen">
      
      {/* CABEÇALHO DA PÁGINA */}
      <div className="text-center mb-12">
        <h1 className="font-serif text-4xl text-gray-800 mb-2">Seja uma Parceira</h1>
        <p className="text-gray-500 font-light italic">Cadastre seu perfil e comece a atender na sua região</p>
      </div>

      {/* SEÇÃO 1: PERFIL PROFISSIONAL */}
      <div className="bg-white rounded-[2rem] p-10 shadow-sm border border-gray-100">
        <div className="flex items-center gap-4 mb-8">
          <span className="bg-rose-50 text-rose-400 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold font-serif">1</span>
          <h2 className="font-serif text-lg tracking-widest text-gray-400 uppercase">IDENTIDADE</h2>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col items-center mb-8">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center border-2 border-dashed border-gray-300 text-gray-400 hover:border-rose-300 hover:text-rose-300 cursor-pointer transition-all">
              <Camera size={32} />
            </div>
            <span className="text-[10px] uppercase tracking-wider text-gray-400 mt-2">Foto de Perfil</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo *</label>
              <input type="text" placeholder="Como você quer ser chamada" className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:ring-2 focus:ring-rose-100 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Categoria *</label>
              <select className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50/50 text-gray-500 outline-none appearance-none">
                <option>Selecione sua especialidade</option>
                <option>Manicure</option>
                <option>Maquiadora</option>
                <option>Cabelereira</option>
                <option>Esteticista</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* SEÇÃO 2: ATENDIMENTO E VALORES */}
      <div className="bg-white rounded-[2rem] p-10 shadow-sm border border-gray-100">
        <div className="flex items-center gap-4 mb-8">
          <span className="bg-rose-50 text-rose-400 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold font-serif">2</span>
          <h2 className="font-serif text-lg tracking-widest text-gray-400 uppercase">SERVIÇOS</h2>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Localização principal *</label>
            <input type="text" placeholder="Ex: Vila Mariana, São Paulo" className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50/50 outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Valor base de saída (R$)</label>
            <input type="number" placeholder="80" className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50/50 outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sobre você / Bio</label>
            <textarea placeholder="Conte um pouco sobre sua experiência e especialidades..." className="w-full p-4 h-32 rounded-2xl border border-gray-100 bg-gray-50/50 outline-none resize-none" />
          </div>
        </div>
      </div>

      {/* BOTÃO DE CADASTRO */}
      <div className="text-center pt-4">
        <button className="w-full bg-[#D9BDBF] hover:bg-[#C2A8AA] text-white py-6 rounded-full font-medium shadow-lg flex items-center justify-center gap-3 transition-all active:scale-95">
          <UserPlus size={20} />
          Finalizar Cadastro de Parceira
        </button>
        <p className="text-[10px] text-gray-400 mt-4 px-12">
          Ao clicar em finalizar, você concorda com os termos de uso da plataforma Embeleze-se.
        </p>
      </div>
    </div>
  )
}