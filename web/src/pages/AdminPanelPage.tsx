import { useEffect, useMemo, useState } from 'react'
import { ShieldCheck, RefreshCw, CheckCircle2, Clock3, XCircle } from 'lucide-react'
import { api } from '../lib/api'

type AdminPanelPageProps = {
  onBackHome: () => void
  onRequireLogin: () => void
}

type PartnerStatus = 'ANALISANDO' | 'APTO' | 'REPROVADO'

type AdminProfessional = {
  id: string
  category: string
  location: string
  basePrice: string | number
  rating: number
  status: PartnerStatus
  user: {
    id: string
    name: string
    email: string
    avatar?: string | null
    createdAt: string
  }
}

const statusOptions: Array<{ label: string; value: '' | PartnerStatus }> = [
  { label: 'Todos', value: '' },
  { label: 'Analisando', value: 'ANALISANDO' },
  { label: 'Aprovadas', value: 'APTO' },
  { label: 'Reprovado', value: 'REPROVADO' },
]

function formatMoney(value: string | number) {
  const numeric = Number(value)
  if (Number.isNaN(numeric)) return 'R$ 0,00'
  return `R$ ${numeric.toFixed(2).replace('.', ',')}`
}

function getStatusBadgeStyle(status: PartnerStatus) {
  if (status === 'APTO') {
    return 'bg-green-100 text-green-700 border-green-200'
  }

  if (status === 'REPROVADO') {
    return 'bg-rose-100 text-rose-700 border-rose-200'
  }

  return 'bg-amber-100 text-amber-700 border-amber-200'
}

export function AdminPanelPage({ onBackHome, onRequireLogin }: AdminPanelPageProps) {
  const [adminKey] = useState(localStorage.getItem('embeleze_admin_key') || '')
  const [adminName] = useState(localStorage.getItem('embeleze_admin_name') || 'Administrador')
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'' | PartnerStatus>('ANALISANDO')
  const [items, setItems] = useState<AdminProfessional[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState('')

  const summary = useMemo(() => {
    return {
      analisando: items.filter((item) => item.status === 'ANALISANDO').length,
      apto: items.filter((item) => item.status === 'APTO').length,
      reprovado: items.filter((item) => item.status === 'REPROVADO').length,
    }
  }, [items])

  async function loadProfessionals() {
    if (!adminKey.trim()) {
      setError('Informe a chave de administrador para continuar.')
      return
    }

    try {
      setLoading(true)
      setError('')

      const response = await api.get('/admin/professionals', {
        headers: {
          'x-admin-key': adminKey.trim(),
        },
        params: {
          status: selectedStatusFilter || undefined,
        },
      })

      const list = Array.isArray(response.data) ? response.data : []
      setItems(list)
    } catch (err: any) {
      const rawMessage = String(err?.response?.data?.message || '')
      const friendlyMessage =
        rawMessage.includes('Invalid `prisma.') || rawMessage.includes('Unknown argument `status`')
          ? 'Servidor indisponivel para este filtro no momento. Tente atualizar a API e buscar novamente.'
          : rawMessage || 'Nao foi possivel carregar parceiras.'

      setError(friendlyMessage)
      setItems([])

      if (err?.response?.status === 401) {
        localStorage.removeItem('embeleze_admin_logged_in')
        localStorage.removeItem('embeleze_admin_id')
        localStorage.removeItem('embeleze_admin_name')
        localStorage.removeItem('embeleze_admin_email')
        localStorage.removeItem('embeleze_admin_key')
        onRequireLogin()
      }
    } finally {
      setLoading(false)
    }
  }

  async function updateStatus(professionalId: string, status: PartnerStatus) {
    if (!adminKey.trim()) {
      setError('Informe a chave de administrador para continuar.')
      return
    }

    try {
      setUpdatingId(professionalId)
      setError('')

      await api.patch(
        `/admin/professionals/${professionalId}/status`,
        { status },
        {
          headers: {
            'x-admin-key': adminKey.trim(),
          },
        }
      )

      await loadProfessionals()
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Nao foi possivel atualizar o status.')
    } finally {
      setUpdatingId('')
    }
  }

  useEffect(() => {
    if (adminKey.trim()) {
      void loadProfessionals()
    } else {
      onRequireLogin()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStatusFilter])

  function handleLogoutAdmin() {
    localStorage.removeItem('embeleze_admin_logged_in')
    localStorage.removeItem('embeleze_admin_id')
    localStorage.removeItem('embeleze_admin_name')
    localStorage.removeItem('embeleze_admin_email')
    localStorage.removeItem('embeleze_admin_key')
    localStorage.removeItem('embeleze_admin_last_activity')
    onRequireLogin()
  }

  return (
    <div className="min-h-screen bg-[#FDF8F8] pt-32 pb-20 px-6">
      <div className="max-w-[1280px] mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-[#C38B94] uppercase tracking-[0.35em] text-[10px] font-bold block mb-2">Administracao</span>
            <h1 className="font-serif text-6xl text-[#1A1A1A] tracking-tight">Painel Admin</h1>
            <p className="text-gray-500 mt-2">Logado como {adminName}</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onBackHome}
              className="px-6 py-3 rounded-full border border-gray-200 text-gray-600 hover:border-[#C38B94] hover:text-[#C38B94] transition-colors"
            >
              Voltar ao site
            </button>
            <button
              type="button"
              onClick={handleLogoutAdmin}
              className="px-6 py-3 rounded-full border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
            >
              Sair do admin
            </button>
          </div>
        </div>

        <section className="bg-white border border-gray-100 rounded-3xl p-6 mb-6 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_160px] gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">Filtro de status</label>
              <select
                value={selectedStatusFilter}
                onChange={(event) => setSelectedStatusFilter(event.target.value as '' | PartnerStatus)}
                className="w-full p-4 rounded-2xl border border-gray-200 bg-gray-50/50 outline-none focus:ring-2 focus:ring-[#C38B94]/10 focus:border-[#C38B94]"
              >
                {statusOptions.map((statusOption) => (
                  <option key={statusOption.label} value={statusOption.value}>{statusOption.label}</option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => void loadProfessionals()}
              disabled={loading}
              className="mt-7 h-[56px] rounded-2xl bg-[#C38B94] text-white font-semibold hover:bg-[#B47E87] transition-colors disabled:opacity-60"
            >
              {loading ? 'Carregando...' : 'Buscar'}
            </button>
          </div>

          {error && <p className="text-sm text-rose-600 mt-3">{error}</p>}
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white border border-amber-100 rounded-3xl p-5">
            <div className="flex items-center gap-2 text-amber-700 text-sm mb-2"><Clock3 size={16} /> Em analise</div>
            <p className="font-serif text-5xl text-[#1A1A1A]">{summary.analisando}</p>
          </div>
          <div className="bg-white border border-green-100 rounded-3xl p-5">
            <div className="flex items-center gap-2 text-green-700 text-sm mb-2"><CheckCircle2 size={16} /> Aprovadas</div>
            <p className="font-serif text-5xl text-[#1A1A1A]">{summary.apto}</p>
          </div>
          <div className="bg-white border border-rose-100 rounded-3xl p-5">
            <div className="flex items-center gap-2 text-rose-700 text-sm mb-2"><XCircle size={16} /> Reprovadas</div>
            <p className="font-serif text-5xl text-[#1A1A1A]">{summary.reprovado}</p>
          </div>
        </section>

        <section className="space-y-4">
          {items.length === 0 && !loading ? (
            <div className="bg-white border border-gray-100 rounded-3xl p-10 text-center text-gray-500">
              Nenhuma parceira encontrada com o filtro atual.
            </div>
          ) : (
            items.map((item) => (
              <article key={item.id} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-serif text-4xl text-[#1A1A1A]">{item.user.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs border ${getStatusBadgeStyle(item.status)}`}>
                        {item.status}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm">{item.user.email}</p>
                    <p className="text-gray-500 text-sm mt-1">
                      {item.category} - {item.location} - {formatMoney(item.basePrice)}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => void updateStatus(item.id, 'ANALISANDO')}
                      disabled={updatingId === item.id}
                      className="px-4 py-2 rounded-full border border-amber-200 text-amber-700 hover:bg-amber-50 transition-colors disabled:opacity-60"
                    >
                      Em analise
                    </button>
                    <button
                      type="button"
                      onClick={() => void updateStatus(item.id, 'APTO')}
                      disabled={updatingId === item.id}
                      className="px-4 py-2 rounded-full border border-green-200 text-green-700 hover:bg-green-50 transition-colors disabled:opacity-60"
                    >
                      Aprovar
                    </button>
                    <button
                      type="button"
                      onClick={() => void updateStatus(item.id, 'REPROVADO')}
                      disabled={updatingId === item.id}
                      className="px-4 py-2 rounded-full border border-rose-200 text-rose-700 hover:bg-rose-50 transition-colors disabled:opacity-60"
                    >
                      Reprovar
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </section>

        <div className="mt-8 text-xs text-gray-500 flex items-center gap-2">
          <ShieldCheck size={14} />
          Dica: compartilhe a chave apenas com administradores e altere periodicamente.
          <button
            type="button"
            onClick={() => void loadProfessionals()}
            className="ml-2 inline-flex items-center gap-1 text-[#C38B94] hover:underline"
          >
            <RefreshCw size={12} /> Atualizar lista
          </button>
        </div>
      </div>
    </div>
  )
}
