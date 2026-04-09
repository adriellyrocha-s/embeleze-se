import { ArrowLeft, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { api } from '../lib/api'

type RegisterProps = {
  onBack: () => void
  onProfileCreated: () => void
  onSkip: () => void
}

const categories = [
  'Manicure',
  'Pedicure',
  'Cabeleireiro',
  'Maquiadora',
  'Designer de Sobrancelhas',
  'Depiladora',
  'Massagista',
  'Esteticista',
]

export function Register({ onBack, onProfileCreated, onSkip }: RegisterProps) {
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')
  const [district, setDistrict] = useState('')
  const [address, setAddress] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function toggleService(service: string) {
    setSelectedServices((prev) =>
      prev.includes(service) ? prev.filter((item) => item !== service) : [...prev, service]
    )
  }

  async function handleCreateProfile() {
    if (!name.trim() || !email.trim() || !city.trim()) {
      setError('Preencha nome, email e cidade para criar seu perfil.')
      return
    }

    const profile = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      city: city.trim(),
      district: district.trim(),
      address: address.trim(),
      selectedServices,
    }

    try {
      setLoading(true)
      const response = await api.post('/auth/customer/register', {
        name: profile.name,
        email: profile.email,
      })

      localStorage.setItem('embeleze_client_profile', JSON.stringify(profile))
      localStorage.setItem('embeleze_client_profile_created', 'true')
      localStorage.setItem('embeleze_client_logged_in', 'true')
      localStorage.setItem('embeleze_client_id', response.data.id)
      localStorage.setItem('embeleze_client_name', response.data.name)
      localStorage.setItem('embeleze_client_email', response.data.email)
      setError('')
      onProfileCreated()
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Nao foi possivel criar seu perfil agora.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FDF8F8] pt-32 pb-20 px-6">
      <div className="max-w-[760px] mx-auto">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 hover:text-[#C38B94] transition-colors mb-10"
        >
          <ArrowLeft size={16} />
          Voltar
        </button>

        <header className="mb-10">
          <span className="text-[#C38B94] uppercase tracking-[0.35em] text-[10px] font-bold block mb-3">
            Para clientes
          </span>
          <h1 className="font-serif text-6xl text-[#1A1A1A] tracking-tight mb-4">Crie seu perfil</h1>
          <p className="text-gray-500 text-3xl font-light leading-relaxed">
            Preencha seus dados para receber as melhores profissionais de beleza na sua regiao.
          </p>
        </header>

        <div className="space-y-6">
          <section className="bg-white rounded-[2rem] border border-gray-100 p-7 shadow-sm">
            <div className="flex items-center gap-3 mb-5 text-gray-500 uppercase tracking-wider text-sm">
              <span className="w-7 h-7 rounded-full bg-rose-50 text-[#C38B94] flex items-center justify-center text-xs font-bold">1</span>
              <span>Seus dados</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Nome completo *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  className="w-full p-4 rounded-2xl border border-gray-200 bg-gray-50/40 outline-none focus:ring-2 focus:ring-[#C38B94]/10 focus:border-[#C38B94]"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seuemail@exemplo.com"
                  className="w-full p-4 rounded-2xl border border-gray-200 bg-gray-50/40 outline-none focus:ring-2 focus:ring-[#C38B94]/10 focus:border-[#C38B94]"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Telefone / WhatsApp</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(11) 99999-9999"
                  className="w-full p-4 rounded-2xl border border-gray-200 bg-gray-50/40 outline-none focus:ring-2 focus:ring-[#C38B94]/10 focus:border-[#C38B94]"
                />
              </div>
            </div>
          </section>

          <section className="bg-white rounded-[2rem] border border-gray-100 p-7 shadow-sm">
            <div className="flex items-center gap-3 mb-5 text-gray-500 uppercase tracking-wider text-sm">
              <span className="w-7 h-7 rounded-full bg-rose-50 text-[#C38B94] flex items-center justify-center text-xs font-bold">2</span>
              <span>Localizacao</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Cidade *</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Ex: Sao Paulo"
                  className="w-full p-4 rounded-2xl border border-gray-200 bg-gray-50/40 outline-none focus:ring-2 focus:ring-[#C38B94]/10 focus:border-[#C38B94]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Bairro</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="Ex: Pinheiros"
                  className="w-full p-4 rounded-2xl border border-gray-200 bg-gray-50/40 outline-none focus:ring-2 focus:ring-[#C38B94]/10 focus:border-[#C38B94]"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm text-gray-700 mb-2">Endereco</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Rua, numero, complemento"
                className="w-full p-4 rounded-2xl border border-gray-200 bg-gray-50/40 outline-none focus:ring-2 focus:ring-[#C38B94]/10 focus:border-[#C38B94]"
              />
            </div>
          </section>

          <section className="bg-white rounded-[2rem] border border-gray-100 p-7 shadow-sm">
            <div className="flex items-center gap-3 mb-5 text-gray-500 uppercase tracking-wider text-sm">
              <span className="w-7 h-7 rounded-full bg-rose-50 text-[#C38B94] flex items-center justify-center text-xs font-bold">3</span>
              <span>Servicos de interesse</span>
            </div>

            <div className="flex flex-wrap gap-3">
              {categories.map((service) => {
                const active = selectedServices.includes(service)
                return (
                  <button
                    key={service}
                    type="button"
                    onClick={() => toggleService(service)}
                    className={`px-5 py-2.5 rounded-full border text-sm transition-colors ${
                      active
                        ? 'bg-[#C38B94] text-white border-[#C38B94]'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-[#C38B94] hover:text-[#C38B94]'
                    }`}
                  >
                    {service}
                  </button>
                )
              })}
            </div>
          </section>
        </div>

        <div className="mt-8 flex flex-col md:flex-row gap-3">
          <button
            type="button"
            onClick={handleCreateProfile}
            disabled={loading}
            className="flex-1 bg-[#C38B94] text-white py-5 rounded-full font-bold text-lg hover:bg-[#B47E87] transition-all flex items-center justify-center gap-3"
          >
            <Sparkles size={18} />
            {loading ? 'Criando perfil...' : 'Criar meu perfil'}
          </button>
          <button
            type="button"
            onClick={onSkip}
            className="px-8 py-5 rounded-full border border-gray-200 text-gray-600 hover:border-[#C38B94] hover:text-[#C38B94] transition-colors"
          >
            Continuar sem perfil
          </button>
        </div>
        {error && <p className="text-sm text-rose-500 mt-3">{error}</p>}
      </div>
    </div>
  )
}
