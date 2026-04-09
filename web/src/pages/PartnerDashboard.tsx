import { CalendarDays, CircleDollarSign, ListChecks, Star, UserCog, ArrowLeftRight, LogOut } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { api } from '../lib/api'

type PartnerDashboardProps = {
  onBackHome: () => void
  onGoToRegister: () => void
  onGoToAdminPanel: () => void
}

const weekDays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom']

export function PartnerDashboard({ onBackHome, onGoToRegister, onGoToAdminPanel }: PartnerDashboardProps) {
  const partnerName = localStorage.getItem('embeleze_partner_name') || 'Parceira'
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('embeleze_partner_logged_in') === 'true')
  const [partnerStatus, setPartnerStatus] = useState(localStorage.getItem('embeleze_partner_status') || 'ANALISANDO')
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [isLoadingLogin, setIsLoadingLogin] = useState(false)
  const [weeklyAppointments, setWeeklyAppointments] = useState<number[]>([0, 0, 0, 0, 0, 0, 0])
  const [totalAppointments, setTotalAppointments] = useState(0)
  const [completedAppointments, setCompletedAppointments] = useState(0)
  const [totalRevenue, setTotalRevenue] = useState(0)

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
      setLoginError(err?.response?.data?.message || 'Nao foi possivel fazer login no momento.')
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
      } catch {
        setWeeklyAppointments([0, 0, 0, 0, 0, 0, 0])
        setTotalAppointments(0)
        setCompletedAppointments(0)
        setTotalRevenue(0)
      }
    }

    void loadDashboardData()
  }, [isLoggedIn])

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
            <div className="bg-rose-50 text-[#C38B94] px-4 py-3 rounded-2xl font-semibold">Visao Geral</div>
            <div className="px-4 py-3 rounded-2xl text-gray-500">Agendamentos</div>
            <div className="px-4 py-3 rounded-2xl text-gray-500">Solicitacoes</div>
            <div className="px-4 py-3 rounded-2xl text-gray-500">Meu Perfil</div>
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
