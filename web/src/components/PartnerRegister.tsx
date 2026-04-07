import { UserPlus, Camera, Smartphone, CalendarDays, Clock, MapPin, DollarSign, BookOpen } from 'lucide-react'

export function PartnerRegister() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4 space-y-8 bg-[#F9F6F3] min-h-screen pt-28">
      
      {/* CABEÇALHO (OPCIONAL) */}
      <div className="text-center mb-12">
        <h1 className="font-serif text-4xl text-gray-800 mb-2">Seja uma Parceira</h1>
        <p className="text-gray-500 font-light italic text-sm">Preencha seus dados para começar</p>
      </div>

      {/* SEÇÃO 1: IDENTIDADE */}
      <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100">
        <div className="flex items-center gap-4 mb-8">
          <span className="bg-rose-50 text-rose-400 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold font-serif">1</span>
          <h2 className="font-serif text-lg tracking-widest text-gray-400 uppercase">IDENTIDADE</h2>
        </div>

        {/* INPUT: NOME COMPLETO */}
        <div className="space-y-6">
          <div className="flex flex-col items-center mb-8">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center border-2 border-dashed border-gray-300 text-gray-400 hover:border-rose-300 hover:text-rose-300 cursor-pointer transition-all">
              <Camera size={32} />
            </div>
            <span className="text-[10px] uppercase tracking-wider text-gray-400 mt-2">Sua Foto de Perfil</span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo *</label>
            <input type="text" placeholder="Nome Completo" className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50/50 outline-none" />
          </div>
        </div>
      </div>

      {/* SEÇÃO 2: ATENDIMENTO E VALORES */}
      <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100">
        <div className="flex items-center gap-4 mb-8">
          <span className="bg-rose-50 text-rose-400 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold font-serif">2</span>
          <h2 className="font-serif text-lg tracking-widest text-gray-400 uppercase">ATENDIMENTO e VALORES</h2>
        </div>

        {/* INPUT: WHATSAPP/CONTATO (COM ÍCONE) */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Categoria *</label>
              <select className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50/50 text-gray-500 outline-none appearance-none">
                <option>Selecione sua especialidade</option>
                <option>Manicure</option>
                <option>Maquiadora</option>
              </select>
            </div>
            
            {/* ÍCONE DE SMARTPHONE AQUI */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Smartphone size={16} strokeWidth={1.5} className="text-gray-400" />
                Contato / WhatsApp *
              </label>
              <input type="tel" placeholder="WhatsApp" className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50/50 outline-none" />
            </div>
          </div>
        </div>
      </div>

      {/* SEÇÃO 3: HORÁRIOS E PREFERÊNCIA (ÍCONES AQUI) */}
      <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100">
        <div className="flex items-center gap-4 mb-8">
          <span className="bg-rose-50 text-rose-400 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold font-serif">3</span>
          <h2 className="font-serif text-lg tracking-widest text-gray-400 uppercase">HORÁRIOS E PREFERÊNCIA</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ÍCONE DE CALENDÁRIO AQUI */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <CalendarDays size={16} strokeWidth={1.5} className="text-gray-400" />
              Dia de Preferência *
            </label>
            <input type="date" className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50/50 text-gray-400 outline-none" />
          </div>

          {/* ÍCONE DE RELÓGIO AQUI */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Clock size={16} strokeWidth={1.5} className="text-gray-400" />
              Horário Preferido *
            </label>
            <input type="time" className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50/50 text-gray-400 outline-none" />
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
          🔒 Seus dados estão seguros. Ao clicar em finalizar, você concorda com os termos da plataforma Embeleze-se.
        </p>
      </div>
    </div>
  )
}