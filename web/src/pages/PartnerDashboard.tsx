import { CalendarDays, CircleDollarSign, ListChecks, Star, UserCog, ArrowLeftRight, LogOut } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { api } from '../lib/api'

type PartnerDashboardProps = {
  onBackHome: () => void
  onGoToRegister: () => void
  onGoToAdminPanel: () => void
  onGoToClientArea: () => void
}

const weekDays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom']

export function PartnerDashboard({ onBackHome, onGoToRegister, onGoToAdminPanel, onGoToClientArea }: PartnerDashboardProps) {
  const partnerName = localStorage.getItem('embeleze_partner_name') || 'Parceira'
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('embeleze_partner_logged_in') === 'true')
  const [currentSection, setCurrentSection] = useState<'overview' | 'appointments' | 'requests' | 'profile'>('overview')
  const [requestsFilter, setRequestsFilter] = useState<'all' | 'accepted' | 'rejected'>('all')
  const [partnerStatus, setPartnerStatus] = useState(localStorage.getItem('embeleze_partner_status') || 'ANALISANDO')
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [isLoadingLogin, setIsLoadingLogin] = useState(false)
  const [weeklyAppointments, setWeeklyAppointments] = useState<number[]>([0, 0, 0, 0, 0, 0, 0])
  const [totalAppointments, setTotalAppointments] = useState(0)
  const [completedAppointments, setCompletedAppointments] = useState(0)
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [appointmentsList, setAppointmentsList] = useState<any[]>([])
  const [appointmentsFilter, setAppointmentsFilter] = useState<'upcoming' | 'completed' | 'all'>('upcoming')
  const [requestsList, setRequestsList] = useState<any[]>([])
  const [partnerProfile, setPartnerProfile] = useState<any>(null)
  const [profileFormData, setProfileFormData] = useState({
    name: '',
    category: '',
    bio: '',
    city: '',
    neighborhood: '',
    minPrice: '',
    maxPrice: '',
    workHours: 'Seg-Dom 7h-20h'
  })
  const [services, setServices] = useState<string[]>([])
  const [newService, setNewService] = useState('')

  const maxValue = useMemo(() => Math.max(...weeklyAppointments, 1), [weeklyAppointments])

  async function handleLogin() {
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setLoginError('Informe email e senha para entrar no painel.')
      return
    }

    try {
      setIsLoadingLogin(true)
      const normalizedEmail = loginEmail.trim().toLowerCase()

      try {
        const adminResponse = await api.post('/auth/admin/login', {
          email: normalizedEmail,
          password: loginPassword,
        })

        localStorage.setItem('embeleze_admin_logged_in', 'true')
        localStorage.setItem('embeleze_admin_id', adminResponse.data.id)
        localStorage.setItem('embeleze_admin_name', adminResponse.data.name)
        localStorage.setItem('embeleze_admin_email', adminResponse.data.email)
        localStorage.setItem('embeleze_admin_key', adminResponse.data.adminApiKey)
        localStorage.setItem('embeleze_admin_last_activity', String(Date.now()))

        // Evita sessao simultanea de parceira quando o login e administrativo.
        localStorage.removeItem('embeleze_partner_logged_in')
        localStorage.removeItem('embeleze_partner_id')
        localStorage.removeItem('embeleze_partner_professional_id')
        localStorage.removeItem('embeleze_partner_status')

        setLoginError('')
        onGoToAdminPanel()
        return
      } catch (adminErr: any) {
        if (adminErr?.response?.status && adminErr.response.status !== 401) {
          throw adminErr
        }
      }

      const response = await api.post('/auth/partner/login', {
        email: normalizedEmail,
        password: loginPassword,
      })

      localStorage.removeItem('embeleze_admin_logged_in')
      localStorage.removeItem('embeleze_admin_id')
      localStorage.removeItem('embeleze_admin_name')
      localStorage.removeItem('embeleze_admin_email')
      localStorage.removeItem('embeleze_admin_key')
      localStorage.removeItem('embeleze_admin_last_activity')

      localStorage.setItem('embeleze_partner_registered', 'true')
      localStorage.setItem('embeleze_partner_logged_in', 'true')
      localStorage.setItem('embeleze_partner_id', response.data.id)
      localStorage.setItem('embeleze_partner_professional_id', response.data.professional?.id || '')
      localStorage.setItem('embeleze_partner_status', response.data.professional?.status || 'ANALISANDO')
      localStorage.setItem('embeleze_partner_name', response.data.name)
      localStorage.setItem('embeleze_partner_email', response.data.email)
      setLoginError('')
      setPartnerStatus(response.data.professional?.status || 'ANALISANDO')
      setIsLoggedIn(true)
    } catch (err: any) {
      try {
        const customerResponse = await api.post('/auth/customer/login', {
          email: loginEmail.trim().toLowerCase(),
          password: loginPassword,
        })

        localStorage.removeItem('embeleze_admin_logged_in')
        localStorage.removeItem('embeleze_admin_id')
        localStorage.removeItem('embeleze_admin_name')
        localStorage.removeItem('embeleze_admin_email')
        localStorage.removeItem('embeleze_admin_key')
        localStorage.removeItem('embeleze_admin_last_activity')
        localStorage.removeItem('embeleze_partner_logged_in')
        localStorage.removeItem('embeleze_partner_id')
        localStorage.removeItem('embeleze_partner_professional_id')
        localStorage.removeItem('embeleze_partner_status')

        localStorage.setItem('embeleze_client_logged_in', 'true')
        localStorage.setItem('embeleze_client_profile_created', 'true')
        localStorage.setItem('embeleze_client_id', customerResponse.data.id)
        localStorage.setItem('embeleze_client_name', customerResponse.data.name)
        localStorage.setItem('embeleze_client_email', customerResponse.data.email)

        setLoginError('')
        onGoToClientArea()
        return
      } catch (customerErr: any) {
        setLoginError(customerErr?.response?.data?.message || err?.response?.data?.message || 'Nao foi possivel fazer login no momento.')
      }
    } finally {
      setIsLoadingLogin(false)
    }
  }

  function handleLogout() {
    localStorage.removeItem('embeleze_partner_logged_in')
    localStorage.removeItem('embeleze_partner_id')
    localStorage.removeItem('embeleze_partner_professional_id')
    localStorage.removeItem('embeleze_partner_status')
    setIsLoggedIn(false)
    onBackHome()
  }

  useEffect(() => {
    async function loadDashboardData() {
      if (!isLoggedIn) return

      const professionalId = localStorage.getItem('embeleze_partner_professional_id')
      if (!professionalId) return

      try {
        const response = await api.get(`/professionals/${professionalId}/appointments`)
        const appointments = Array.isArray(response.data) ? response.data : []
        setAppointmentsList(appointments)

        const weekCounts = [0, 0, 0, 0, 0, 0, 0]
        const dayMap = [6, 0, 1, 2, 3, 4, 5]

        appointments.forEach((item: any) => {
          const date = new Date(item.scheduledAt)
          if (!Number.isNaN(date.getTime())) {
            const dayIndex = dayMap[date.getDay()]
            weekCounts[dayIndex] += 1
          }
        })

        setWeeklyAppointments(weekCounts)
        setTotalAppointments(appointments.length)
        setCompletedAppointments(appointments.filter((item: any) => item.status === 'COMPLETED').length)
        setTotalRevenue(
          appointments
            .filter((item: any) => item.status !== 'CANCELLED')
            .reduce((acc: number, item: any) => acc + Number(item.totalPrice || 0), 0)
        )

        // Carregar perfil
        const profileResponse = await api.get(`/professionals/${professionalId}`)
        setPartnerProfile(profileResponse.data)
      } catch {
        setWeeklyAppointments([0, 0, 0, 0, 0, 0, 0])
        setTotalAppointments(0)
        setCompletedAppointments(0)
        setTotalRevenue(0)
        setAppointmentsList([])
      }
    }

    void loadDashboardData()
  }, [isLoggedIn])

  // Carregar solicitações separadamente (dados mock)
  useEffect(() => {
    if (isLoggedIn) {
      setRequestsList([
        {
          id: '1',
          clientName: 'Adrielly Silva',
          serviceCategory: 'Pedicure',
          serviceType: 'Pedicure',
          location: 'Itacarubi, Florianópolis',
          addressDetails: 'Rua das Flores, 123 - Apto 42 - CEP: 88015-100 - SC',
          scheduledDate: '08/04/2026',
          scheduledTime: '17:38',
          budget: 100,
          paymentMethod: 'Cartão de Crédito',
          server: 'Feliciano Martins Vieira',
          notes: 'Cliente solicitou design em degradê. Preferência por cores rosê e nude. Tem sensibilidade em problemas de fungos.',
          status: 'PENDING',
        },
        {
          id: '2',
          clientName: 'Maria Santos',
          serviceCategory: 'Manicure',
          serviceType: 'Manicure',
          location: 'Centro, São Paulo',
          addressDetails: 'Avenida Paulista, 1000 - Sala 1501 - CEP: 01311-100 - SP',
          scheduledDate: '12/04/2026',
          scheduledTime: '14:00',
          budget: 80,
          paymentMethod: 'Pix',
          server: 'Sistema Embeleze-se',
          notes: 'Manicure clássica francesa. Cliente já é regular.',
          status: 'PENDING',
        },
      ])

      // Exemplo de agendamento confirmado
      setAppointmentsList([
        {
          id: 'apt-1',
          clientName: 'João Silva',
          serviceType: 'Manicure',
          scheduledAt: '2026-04-11T14:30',
          location: 'Centro, São Paulo',
          totalPrice: 75,
          clientPhone: '11 98765-4321',
          status: 'CONFIRMED'
        }
      ])
    }
  }, [isLoggedIn])

  // Sincronizar dados do perfil com o formulário
  useEffect(() => {
    if (partnerProfile) {
      setProfileFormData({
        name: partnerProfile.name || '',
        category: partnerProfile.category || '',
        bio: partnerProfile.bio || '',
        city: partnerProfile.location?.split(',')[0] || '',
        neighborhood: partnerProfile.location?.split(',')[1] || '',
        minPrice: partnerProfile.basePrice || '',
        maxPrice: partnerProfile.basePrice || '',
        workHours: 'Seg-Dom 7h-20h'
      })
      setServices(['Maquiagem Social', 'Maquiagem para Noivas', 'Maquiagem Artística', 'Automaquiagem (Curso)'])
    }
  }, [partnerProfile])

  function handleAddService() {
    if (newService.trim()) {
      setServices([...services, newService.trim()])
      setNewService('')
    }
  }

  function handleRemoveService(index: number) {
    setServices(services.filter((_, i) => i !== index))
  }

  function handleSaveProfile() {
    console.log('Salvando perfil:', profileFormData, services)
    alert('Perfil salvo com sucesso!')
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#FDF8F8] px-6 py-20">
        <div className="max-w-3xl mx-auto bg-white border border-rose-100 rounded-[2rem] p-10 text-center shadow-sm">
          <UserCog className="mx-auto mb-6 text-[#C38B94]" size={44} />
          <h1 className="font-serif text-5xl text-[#1A1A1A] mb-4">Entrar na conta</h1>
          <p className="text-gray-500 mb-8">
            Entre com email e senha da sua conta cadastrada para continuar.
          </p>

          <div className="max-w-md mx-auto text-left">
            <label className="block text-sm text-gray-700 mb-2">Email cadastrado</label>
            <input
              type="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              placeholder="seuemail@exemplo.com"
              className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50/50 outline-none focus:ring-2 focus:ring-[#C38B94]/10 focus:border-[#C38B94]"
            />

            <label className="block text-sm text-gray-700 mb-2 mt-4">Senha</label>
            <input
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              placeholder="Sua senha"
              className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50/50 outline-none focus:ring-2 focus:ring-[#C38B94]/10 focus:border-[#C38B94]"
            />
            {loginError && <p className="text-sm text-rose-500 mt-2">{loginError}</p>}
          </div>

          <div className="flex gap-4 justify-center mt-8">
            <button
              type="button"
              onClick={handleLogin}
              disabled={isLoadingLogin}
              className="px-8 py-3 rounded-full bg-[#C38B94] text-white font-semibold hover:brightness-95"
            >
              {isLoadingLogin ? 'Entrando...' : 'Fazer login'}
            </button>
            <button
              type="button"
              onClick={onBackHome}
              className="px-8 py-3 rounded-full border border-gray-200 text-gray-600 hover:border-[#C38B94] hover:text-[#C38B94]"
            >
              Voltar ao site
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FDF8F8] text-[#1A1A1A] flex">
      <aside className="w-[280px] border-r border-rose-100 bg-white p-8 flex flex-col justify-between">
        <div>
          <h2 className="font-serif text-4xl mb-10">Embeleze-se</h2>
          <nav className="space-y-3 text-sm">
            <button
              type="button"
              onClick={() => setCurrentSection('overview')}
              className={`w-full text-left px-4 py-3 rounded-2xl font-semibold transition-colors ${
                currentSection === 'overview'
                  ? 'bg-rose-50 text-[#C38B94]'
                  : 'text-gray-500 hover:text-[#C38B94]'
              }`}
            >
              Visao Geral
            </button>
            <button
              type="button"
              onClick={() => setCurrentSection('appointments')}
              className={`w-full text-left px-4 py-3 rounded-2xl font-semibold transition-colors ${
                currentSection === 'appointments'
                  ? 'bg-rose-50 text-[#C38B94]'
                  : 'text-gray-500 hover:text-[#C38B94]'
              }`}
            >
              Agendamentos
            </button>
            <button
              type="button"
              onClick={() => setCurrentSection('requests')}
              className={`w-full text-left px-4 py-3 rounded-2xl font-semibold transition-colors ${
                currentSection === 'requests'
                  ? 'bg-rose-50 text-[#C38B94]'
                  : 'text-gray-500 hover:text-[#C38B94]'
              }`}
            >
              Solicitacoes
            </button>
            <button
              type="button"
              onClick={() => setCurrentSection('profile')}
              className={`w-full text-left px-4 py-3 rounded-2xl font-semibold transition-colors ${
                currentSection === 'profile'
                  ? 'bg-rose-50 text-[#C38B94]'
                  : 'text-gray-500 hover:text-[#C38B94]'
              }`}
            >
              Meu Perfil
            </button>
          </nav>
        </div>

        <div className="space-y-3 text-sm text-gray-500">
          <button type="button" onClick={onBackHome} className="flex items-center gap-2 hover:text-[#C38B94]">
            <ArrowLeftRight size={16} /> Voltar ao site
          </button>
          <button type="button" onClick={handleLogout} className="flex items-center gap-2 hover:text-[#C38B94]">
            <LogOut size={16} /> Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 p-10">
        <span className="text-[#C38B94] uppercase tracking-[0.35em] text-[10px] font-bold block mb-3">Painel Parceira</span>

        {currentSection === 'overview' && (
          <>
            <h1 className="font-serif text-6xl">Visao Geral</h1>
            <p className="text-gray-500 mt-2 mb-10">Bem-vinda, {partnerName}</p>

            {partnerStatus !== 'APTO' && (
              <div className="mb-8 rounded-3xl border border-amber-200 bg-amber-50 p-5 text-amber-900">
                <p className="font-semibold mb-1">Perfil em analise</p>
                <p className="text-sm">
                  Seu cadastro esta em avaliacao e pode levar ate 5 dias uteis. Seu perfil so aparece para clientes apos status APTO.
                </p>
              </div>
            )}

            <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
              <MetricCard icon={<CalendarDays size={18} />} label="Agendamentos" value={String(totalAppointments)} />
              <MetricCard icon={<ListChecks size={18} />} label="Concluidos" value={String(completedAppointments)} />
              <MetricCard icon={<CircleDollarSign size={18} />} label="Receita" value={`R$ ${totalRevenue.toFixed(2).replace('.', ',')}`} />
              <MetricCard icon={<Star size={18} />} label="Avaliacao" value="5.0" />
            </section>

            <section className="bg-white border border-rose-100 rounded-3xl p-8 shadow-sm">
              <h3 className="font-serif text-4xl mb-8">Agendamentos da Semana</h3>
              <div className="h-64 grid grid-cols-7 gap-4 items-end">
                {weeklyAppointments.map((value, index) => (
                  <div key={weekDays[index]} className="flex flex-col items-center gap-2">
                    <div
                      className="w-full bg-[#C38B94] rounded-t-xl"
                      style={{ height: `${(value / maxValue) * 180}px` }}
                    />
                    <span className="text-xs text-gray-400">{weekDays[index]}</span>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {currentSection === 'appointments' && (
          <>
            <h1 className="font-serif text-6xl">Agendamentos</h1>
            <p className="text-gray-500 mt-2 mb-10">Gerencie seus agendamentos confirmados</p>

            {/* Filtros */}
            <div className="flex gap-4 mb-8">
              <button
                type="button"
                onClick={() => setAppointmentsFilter('upcoming')}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  appointmentsFilter === 'upcoming'
                    ? 'bg-white text-[#1A1A1A]'
                    : 'bg-transparent text-gray-500 border border-gray-300 hover:border-[#C38B94]'
                }`}
              >
                Proximos
              </button>
              <button
                type="button"
                onClick={() => setAppointmentsFilter('completed')}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  appointmentsFilter === 'completed'
                    ? 'bg-white text-[#1A1A1A]'
                    : 'bg-transparent text-gray-500 border border-gray-300 hover:border-[#C38B94]'
                }`}
              >
                Concluidos
              </button>
              <button
                type="button"
                onClick={() => setAppointmentsFilter('all')}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  appointmentsFilter === 'all'
                    ? 'bg-white text-[#1A1A1A]'
                    : 'bg-transparent text-gray-500 border border-gray-300 hover:border-[#C38B94]'
                }`}
              >
                Todos
              </button>
            </div>

            {/* Cards de Agendamentos */}
            <div className="space-y-4">
              {appointmentsList
                .filter(appointment => {
                  if (appointmentsFilter === 'all') return true
                  if (appointmentsFilter === 'upcoming') return appointment.status !== 'COMPLETED'
                  if (appointmentsFilter === 'completed') return appointment.status === 'COMPLETED'
                  return true
                })
                .length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center">
                  <p className="text-gray-400">Nenhum agendamento neste filtro</p>
                </div>
              ) : (
                appointmentsList
                  .filter(appointment => {
                    if (appointmentsFilter === 'all') return true
                    if (appointmentsFilter === 'upcoming') return appointment.status !== 'COMPLETED'
                    if (appointmentsFilter === 'completed') return appointment.status === 'COMPLETED'
                    return true
                  })
                  .map((appointment) => (
                    <div
                      key={appointment.id}
                      className="bg-white border border-gray-200 rounded-3xl p-6 hover:border-[#C38B94]/50 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold text-[#1A1A1A]">{appointment.clientName || 'Cliente'}</h3>
                            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                              appointment.status === 'COMPLETED' 
                                ? 'bg-green-100 text-green-700'
                                : appointment.status === 'CANCELLED'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}>
                              {appointment.status === 'COMPLETED' ? 'Concluido' : appointment.status === 'CANCELLED' ? 'Cancelado' : 'Confirmado'}
                            </span>
                          </div>
                          <p className="text-gray-500 text-sm">{appointment.serviceType || 'Serviço não informado'}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <span>📍</span> {appointment.location || 'Localização não informada'}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <span>📅</span> {new Date(appointment.scheduledAt).toLocaleDateString('pt-BR')} às {new Date(appointment.scheduledAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <span>💰</span> R$ {Number(appointment.totalPrice || 0).toFixed(2).replace('.', ',')}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <span>📞</span> {appointment.clientPhone || 'Sem telefone'}
                        </div>
                      </div>

                      {appointment.status === 'COMPLETED' && (
                        <div className="flex gap-3">
                          <button
                            type="button"
                            className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full font-semibold transition-colors"
                          >
                            ↙ Voltar
                          </button>
                        </div>
                      )}
                    </div>
                  ))
              )}
            </div>
          </>
        )}

        {currentSection === 'requests' && (
          <>
            <h1 className="font-serif text-2xl">Solicitacoes</h1>
            <p className="text-gray-500 text-xs mt-0.5 mb-2">{partnerName}</p>

            {/* Filtros */}
            <div className="flex flex-wrap gap-1 mb-2">
              <button
                type="button"
                onClick={() => setRequestsFilter('all')}
                className={`px-2 py-0.5 rounded-full font-bold text-xs ${
                  requestsFilter === 'all'
                    ? 'bg-[#C38B94] text-white'
                    : 'bg-white text-gray-700 border border-gray-300'
                }`}
              >
                Todas ({requestsList.length})
              </button>
              <button
                type="button"
                onClick={() => setRequestsFilter('accepted')}
                className={`px-2 py-0.5 rounded-full font-bold text-xs ${
                  requestsFilter === 'accepted'
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300'
                }`}
              >
                ✓ Aceitas {requestsList.filter(r => r.status === 'ACCEPTED').length > 0 && `(${requestsList.filter(r => r.status === 'ACCEPTED').length})`}
              </button>
              <button
                type="button"
                onClick={() => setRequestsFilter('rejected')}
                className={`px-2 py-0.5 rounded-full font-bold text-xs ${
                  requestsFilter === 'rejected'
                    ? 'bg-red-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300'
                }`}
              >
                ✕ Recusadas {requestsList.filter(r => r.status === 'REJECTED').length > 0 && `(${requestsList.filter(r => r.status === 'REJECTED').length})`}
              </button>
            </div>

            {/* Cards - Ultra Compacto */}
            <div className="space-y-1 pb-4">
              {requestsList
                .filter(request => {
                  if (requestsFilter === 'all') return true
                  if (requestsFilter === 'accepted') return request.status === 'ACCEPTED'
                  if (requestsFilter === 'rejected') return request.status === 'REJECTED'
                  return true
                })
                .length === 0 ? (
                <div className="bg-white border border-gray-200 rounded px-2 py-1.5 text-center">
                  <p className="text-gray-400 text-xs">Nenhuma solicitacao</p>
                </div>
              ) : (
                requestsList
                  .filter(request => {
                    if (requestsFilter === 'all') return true
                    if (requestsFilter === 'accepted') return request.status === 'ACCEPTED'
                    if (requestsFilter === 'rejected') return request.status === 'REJECTED'
                    return true
                  })
                  .map((request) => (
                    <div
                      key={request.id}
                      className={`border rounded-lg overflow-hidden transition-all ${
                        request.status === 'PENDING'
                          ? 'bg-gradient-to-r from-amber-50 to-white border-amber-300'
                          : request.status === 'ACCEPTED'
                          ? 'bg-gradient-to-r from-green-50 to-white border-green-300'
                          : 'bg-gradient-to-r from-red-50 to-white border-red-300'
                      }`}
                    >
                      {/* Header */}
                      <div className="p-1 border-b border-gray-100">
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex-1">
                            <h3 className="text-base font-bold text-[#1A1A1A]">{request.clientName}</h3>
                            <div className="flex items-center gap-1 mt-0.5">
                              <span className={`text-xs font-bold px-1 py-0 rounded-full ${
                                request.status === 'ACCEPTED' 
                                  ? 'bg-green-600 text-white'
                                  : request.status === 'REJECTED'
                                  ? 'bg-red-600 text-white'
                                  : 'bg-amber-600 text-white'
                              }`}>
                                {request.status === 'ACCEPTED' ? '✓' : request.status === 'REJECTED' ? '✕' : 'Aguardando'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Conteúdo */}
                      <div className="p-1">
                        {/* Serviço */}
                        <p className="text-xs text-gray-600 font-bold mb-0.5">🎯 {request.serviceCategory}</p>

                        {/* Info inline */}
                        <div className="grid grid-cols-2 gap-0.5 mb-1 text-xs">
                          <div className="bg-gray-50 rounded px-1 py-0">
                            <p className="font-bold text-gray-700">📅 {request.scheduledDate}</p>
                          </div>
                          <div className="bg-[#C38B94] text-white rounded px-1 py-0 font-bold">
                            💰 R$ {Number(request.budget || 0).toFixed(2).replace('.', ',')}
                          </div>
                        </div>
                        <div className="text-xs text-gray-600 mb-0.5">🕐 {request.scheduledTime}</div>

                        {/* Endereço */}
                        <div className="bg-blue-50 rounded px-1 py-0.5 mb-0.5 text-xs">
                          <p className="text-gray-700 font-bold leading-tight">📍 {request.location}</p>
                          {request.addressDetails && (
                            <p className="text-xs text-gray-600 leading-tight">{request.addressDetails}</p>
                          )}
                        </div>

                        {/* Info secundária inline */}
                        <div className="flex flex-wrap gap-0.5 text-xs mb-0.5">
                          <span className="bg-gray-100 px-1 py-0.5 rounded font-bold">💳 {request.paymentMethod}</span>
                          <span className="bg-gray-100 px-1 py-0.5 rounded font-bold">👤 {request.server}</span>
                        </div>

                        {/* Observações - opcional */}
                        {request.notes && (
                          <div className="text-xs text-gray-600 italic mt-0.5 mb-0.5">
                            📝 "{request.notes}"
                          </div>
                        )}

                        {/* Botões compactos */}
                        <div className="flex gap-0.5">
                          {request.status === 'PENDING' ? (
                            <>
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = requestsList.map(r => 
                                    r.id === request.id ? { ...r, status: 'ACCEPTED' } : r
                                  )
                                  setRequestsList(updated)
                                  
                                  // Adicionar à lista de agendamentos
                                  const newAppointment = {
                                    id: request.id,
                                    clientName: request.clientName,
                                    serviceType: request.serviceCategory,
                                    scheduledAt: `${request.scheduledDate}T${request.scheduledTime}`,
                                    location: request.location,
                                    totalPrice: request.budget,
                                    clientPhone: request.server,
                                    status: 'CONFIRMED'
                                  }
                                  setAppointmentsList([...appointmentsList, newAppointment])
                                }}
                                className="py-1 px-3 bg-green-600 hover:bg-green-700 text-white rounded font-bold text-xs w-fit"
                              >
                                ✓ Aceitar
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = requestsList.map(r => 
                                    r.id === request.id ? { ...r, status: 'REJECTED' } : r
                                  )
                                  setRequestsList(updated)
                                }}
                                className="py-1 px-3 bg-red-600 hover:bg-red-700 text-white rounded font-bold text-xs w-fit"
                              >
                                ✕ Recusar
                              </button>
                            </>
                          ) : (
                            <div className="w-full py-0 text-center text-xs font-bold text-gray-600">
                              {request.status === 'ACCEPTED' ? '✓ Aceito' : '✕ Recusado'}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </>
        )}

        {currentSection === 'profile' && (
          <>
            <h1 className="font-serif text-4xl">Meu Perfil</h1>
            <p className="text-gray-500 text-sm mt-1 mb-6">Bem-vindo, {partnerName}</p>

            <div className="bg-white border border-gray-200 rounded-2xl p-8 space-y-8 shadow-sm">
              {/* Informações Básicas */}
              <div>
                <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">Informações Básicas</h2>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs text-gray-600 font-bold mb-2">Nome *</label>
                    <input
                      type="text"
                      value={profileFormData.name}
                      onChange={(e) => setProfileFormData({...profileFormData, name: e.target.value})}
                      className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-[#1A1A1A] focus:border-[#C38B94] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 font-bold mb-2">Categoria *</label>
                    <select 
                      value={profileFormData.category}
                      onChange={(e) => setProfileFormData({...profileFormData, category: e.target.value})}
                      className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-[#1A1A1A] focus:border-[#C38B94] focus:outline-none"
                    >
                      <option value="">Selecionar</option>
                      <option value="Maquiadora">Maquiadora</option>
                      <option value="Manicure">Manicure</option>
                      <option value="Pedicure">Pedicure</option>
                      <option value="Cabelereira">Cabelereira</option>
                    </select>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-xs text-gray-400 font-bold mb-2">Bio</label>
                  <textarea
                    value={profileFormData.bio}
                    onChange={(e) => setProfileFormData({...profileFormData, bio: e.target.value})}
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-[#1A1A1A] focus:border-[#C38B94] focus:outline-none"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs text-gray-600 font-bold mb-2">Cidade *</label>
                    <input
                      type="text"
                      value={profileFormData.city}
                      onChange={(e) => setProfileFormData({...profileFormData, city: e.target.value})}
                      className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-[#1A1A1A] focus:border-[#C38B94] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 font-bold mb-2">Bairro</label>
                    <input
                      type="text"
                      value={profileFormData.neighborhood}
                      onChange={(e) => setProfileFormData({...profileFormData, neighborhood: e.target.value})}
                      className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-[#1A1A1A] focus:border-[#C38B94] focus:outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs text-gray-600 font-bold mb-2">Preço Mínimo (R$)</label>
                    <input
                      type="number"
                      value={profileFormData.minPrice}
                      onChange={(e) => setProfileFormData({...profileFormData, minPrice: e.target.value})}
                      className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-[#1A1A1A] focus:border-[#C38B94] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 font-bold mb-2">Preço Máximo (R$)</label>
                    <input
                      type="number"
                      value={profileFormData.maxPrice}
                      onChange={(e) => setProfileFormData({...profileFormData, maxPrice: e.target.value})}
                      className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-[#1A1A1A] focus:border-[#C38B94] focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 font-bold mb-2">Horário de Trabalho</label>
                  <input
                    type="text"
                    value={profileFormData.workHours}
                    onChange={(e) => setProfileFormData({...profileFormData, workHours: e.target.value})}
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-[#1A1A1A] focus:border-[#C38B94] focus:outline-none"
                  />
                </div>
              </div>

              {/* Serviços Oferecidos */}
              <div>
                <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">Serviços Oferecidos</h2>
                <div className="mb-4 flex gap-2">
                  <input
                    type="text"
                    placeholder="Adicionar serviço..."
                    value={newService}
                    onChange={(e) => setNewService(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddService()}
                    className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-[#1A1A1A] focus:border-[#C38B94] focus:outline-none"
                  />
                  <button 
                    onClick={handleAddService}
                    type="button"
                    className="bg-[#C38B94] hover:bg-[#A87080] text-white rounded-full w-10 h-10 flex items-center justify-center font-bold transition-colors"
                  >
                    +
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {services.map((service, index) => (
                    <span 
                      key={index}
                      className="bg-gray-200 text-[#1A1A1A] text-xs px-3 py-1 rounded-full font-bold flex items-center gap-2 hover:bg-gray-300 transition-colors"
                    >
                      {service}
                      <button
                        onClick={() => handleRemoveService(index)}
                        type="button"
                        className="cursor-pointer hover:text-red-300"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Botão Salvar */}
              <button 
                onClick={handleSaveProfile}
                type="button"
                className="w-full bg-[#C38B94] hover:bg-[#A87080] text-white rounded-xl py-3 font-bold transition-colors"
              >
                💾 Salvar Perfil
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

type MetricCardProps = {
  icon: ReactNode
  label: string
  value: string
}

function MetricCard({ icon, label, value }: MetricCardProps) {
  return (
    <article className="bg-white border border-rose-100 rounded-3xl p-6 shadow-sm">
      <div className="flex items-center gap-3 text-gray-500 text-sm mb-4">
        {icon}
        <span>{label}</span>
      </div>
      <p className="font-serif text-5xl text-[#1A1A1A]">{value}</p>
    </article>
  )
}
