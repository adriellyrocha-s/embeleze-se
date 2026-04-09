import { UserPlus, Camera, Smartphone, CalendarDays, Clock } from 'lucide-react'
import { useState } from 'react'
import { api } from '../lib/api'

type PartnerRegisterProps = {
  onRegistered?: () => void
}

export function PartnerRegister({ onRegistered }: PartnerRegisterProps) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [category, setCategory] = useState('')
  const [location, setLocation] = useState('')
  const [basePrice, setBasePrice] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleRegister() {
    if (!fullName.trim() || !email.trim() || !password.trim() || !whatsapp.trim() || !category.trim()) {
      setError('Preencha nome, email, senha, categoria e WhatsApp para finalizar o cadastro.')
      return
    }

    try {
      setLoading(true)
      const response = await api.post('/auth/partner/register', {
        name: fullName.trim(),
        email: email.trim(),
        password: password.trim(),
        category: category.trim(),
        location: location.trim() || 'Nao informado',
        basePrice: Number(basePrice) || 0,
      })

      localStorage.setItem('embeleze_partner_registered', 'true')
      localStorage.setItem('embeleze_partner_logged_in', 'true')
      localStorage.setItem('embeleze_partner_id', response.data.id)
      localStorage.setItem('embeleze_partner_professional_id', response.data.professional?.id || '')
      localStorage.setItem('embeleze_partner_status', response.data.professional?.status || 'ANALISANDO')
      localStorage.setItem('embeleze_partner_name', response.data.name)
      localStorage.setItem('embeleze_partner_email', response.data.email)
      localStorage.setItem('embeleze_partner_whatsapp', whatsapp.trim())
      setError('')
      onRegistered?.()
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Nao foi possivel concluir o cadastro agora.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FDF8F8] pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center mb-4">
          <span className="text-[#C38B94] uppercase tracking-[0.35em] text-[10px] font-bold block mb-4">
            Area de Parceiras
          </span>
          <h1 className="font-serif text-6xl text-[#1A1A1A] tracking-tight mb-4">Seja uma Parceira</h1>
          <p className="text-gray-500 font-light text-base">Preencha seus dados para ativar seu painel exclusivo.</p>
        </div>

        <div className="bg-[#F7EFEF] border border-rose-100 rounded-[2rem] px-6 py-4 text-sm text-[#8A5D66]">
          Seu cadastro leva menos de 2 minutos. Depois de finalizar, seu perfil ficara em analise por ate 5 dias uteis.
        </div>

        {/* SEÇÃO 1: IDENTIDADE */}
        <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4 mb-8">
            <span className="bg-rose-50 text-[#C38B94] w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold font-serif">1</span>
            <h2 className="font-serif text-lg tracking-widest text-gray-400 uppercase">IDENTIDADE</h2>
          </div>

          {/* INPUT: NOME COMPLETO */}
          <div className="space-y-6">
            <div className="flex flex-col items-center mb-8">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center border-2 border-dashed border-gray-300 text-gray-400 hover:border-[#C38B94] hover:text-[#C38B94] cursor-pointer transition-all">
                <Camera size={32} />
              </div>
              <span className="text-[10px] uppercase tracking-wider text-gray-400 mt-2">Sua Foto de Perfil</span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo *</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nome Completo"
                className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50/50 outline-none focus:ring-2 focus:ring-[#C38B94]/10 focus:border-[#C38B94]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seuemail@exemplo.com"
                  className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50/50 outline-none focus:ring-2 focus:ring-[#C38B94]/10 focus:border-[#C38B94]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Senha *</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Crie sua senha"
                  className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50/50 outline-none focus:ring-2 focus:ring-[#C38B94]/10 focus:border-[#C38B94]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SEÇÃO 2: ATENDIMENTO E VALORES */}
        <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4 mb-8">
            <span className="bg-rose-50 text-[#C38B94] w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold font-serif">2</span>
            <h2 className="font-serif text-lg tracking-widest text-gray-400 uppercase">ATENDIMENTO e VALORES</h2>
          </div>

          {/* INPUT: WHATSAPP/CONTATO (COM ÍCONE) */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categoria *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50/50 text-gray-500 outline-none appearance-none focus:ring-2 focus:ring-[#C38B94]/10 focus:border-[#C38B94]"
                >
                  <option>Selecione sua especialidade</option>
                  <option>Manicure</option>
                  <option>Maquiadora</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Smartphone size={16} strokeWidth={1.5} className="text-gray-400" />
                  Contato / WhatsApp *
                </label>
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="WhatsApp"
                  className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50/50 outline-none focus:ring-2 focus:ring-[#C38B94]/10 focus:border-[#C38B94]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Local de atendimento</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ex: Moema"
                  className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50/50 outline-none focus:ring-2 focus:ring-[#C38B94]/10 focus:border-[#C38B94]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Valor base (R$)</label>
                <input
                  type="number"
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
                  placeholder="Ex: 80"
                  className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50/50 outline-none focus:ring-2 focus:ring-[#C38B94]/10 focus:border-[#C38B94]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SEÇÃO 3: HORÁRIOS E PREFERÊNCIA (ÍCONES AQUI) */}
        <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4 mb-8">
            <span className="bg-rose-50 text-[#C38B94] w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold font-serif">3</span>
            <h2 className="font-serif text-lg tracking-widest text-gray-400 uppercase">HORARIOS E PREFERENCIA</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <CalendarDays size={16} strokeWidth={1.5} className="text-gray-400" />
                Dia de Preferencia *
              </label>
              <input type="date" className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50/50 text-gray-400 outline-none focus:ring-2 focus:ring-[#C38B94]/10 focus:border-[#C38B94]" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Clock size={16} strokeWidth={1.5} className="text-gray-400" />
                Horario Preferido *
              </label>
              <input type="time" className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50/50 text-gray-400 outline-none focus:ring-2 focus:ring-[#C38B94]/10 focus:border-[#C38B94]" />
            </div>
          </div>
        </div>

        {/* BOTÃO DE CADASTRO */}
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={handleRegister}
            disabled={loading}
            className="w-full bg-[#C38B94] hover:bg-[#B47E87] text-white py-6 rounded-full font-medium shadow-lg shadow-[#C38B94]/20 flex items-center justify-center gap-3 transition-all active:scale-95"
          >
            <UserPlus size={20} />
            {loading ? 'Cadastrando...' : 'Finalizar Cadastro de Parceira'}
          </button>
          {error && <p className="text-sm text-rose-500 mt-3">{error}</p>}
          <p className="text-[10px] text-gray-400 mt-4 px-4 md:px-12">
            Seus dados estao seguros. Ao clicar em finalizar, voce concorda com os termos da plataforma Embeleze-se.
          </p>
        </div>
      </div>
    </div>
  )
}