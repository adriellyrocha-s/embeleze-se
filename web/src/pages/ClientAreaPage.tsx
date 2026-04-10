import { ArrowLeft, CalendarDays, ClipboardList, LogOut, Package, Plus } from 'lucide-react'
import { useMemo, useState } from 'react'

type ClientAreaPageProps = {
  onNewRequest: () => void
  onBackHome: () => void
}

type ServiceRequest = {
  id: string
  type: string
  location: string
  date: string
  price: number
  status: 'not_hired' | 'professional_found' | 'completed'
  professional?: {
    name: string
    confirmed: boolean
  }
  daysAgo: number
}

type ClientAppointment = {
  id: string
  type: string
  location: string
  date: string
  price: number
  professionalName: string
  status: 'confirmed' | 'completed'
}

type ProductOrder = {
  id: string
  createdAt: string
  total: number
  itemsCount: number
}

export function ClientAreaPage({ onNewRequest, onBackHome }: ClientAreaPageProps) {
  const clientName = localStorage.getItem('embeleze_client_name') || 'Cliente'
  const clientContact = localStorage.getItem('embeleze_client_email') || ''
  const [currentSection, setCurrentSection] = useState<'service-requests' | 'orders' | 'appointments'>('service-requests')

  const [requests] = useState<ServiceRequest[]>([
    {
      id: '1',
      type: 'Pedicure',
      location: 'Itacarubi, Florianópolis',
      date: '08/04/2026',
      price: 10,
      status: 'not_hired',
      daysAgo: 3
    },
    {
      id: '2',
      type: 'Cabeleireiro',
      location: 'Itacarubi, Florianópolis',
      date: '07/04/2026',
      price: 150,
      status: 'professional_found',
      professional: {
        name: 'Adrielly Silva',
        confirmed: true
      },
      daysAgo: 4
    },
    {
      id: '3',
      type: 'Pedicure',
      location: 'Itacarubi, Florianópolis',
      date: '08/04/2026',
      price: 100,
      status: 'professional_found',
      professional: {
        name: 'Adrielly Silva',
        confirmed: true
      },
      daysAgo: 4
    }
  ])

  const appointments = useMemo<ClientAppointment[]>(() => {
    return requests
      .filter((request) => request.status === 'professional_found' || request.status === 'completed')
      .map((request) => ({
        id: request.id,
        type: request.type,
        location: request.location,
        date: request.date,
        price: request.price,
        professionalName: request.professional?.name || 'Profissional',
        status: request.status === 'completed' ? 'completed' : 'confirmed',
      }))
  }, [requests])

  const orders = useMemo<ProductOrder[]>(() => {
    try {
      const raw = localStorage.getItem('embeleze_purchase_records') || '[]'
      const parsed = JSON.parse(raw)
      if (!Array.isArray(parsed)) return []

      return parsed.map((order: any) => ({
        id: String(order.id || ''),
        createdAt: String(order.createdAt || ''),
        total: Number(order.total || 0),
        itemsCount: Array.isArray(order.items)
          ? order.items.reduce((acc: number, item: any) => acc + Number(item.quantity || 0), 0)
          : 0,
      }))
    } catch {
      return []
    }
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'not_hired':
        return 'bg-red-100 text-red-600'
      case 'professional_found':
        return 'bg-green-100 text-green-600'
      case 'completed':
        return 'bg-blue-100 text-blue-600'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'not_hired':
        return '⭘ Não contratado'
      case 'professional_found':
        return '✓ Profissional encontrado!'
      case 'completed':
        return '✓ Concluído'
      default:
        return 'Pendente'
    }
  }

  function handleLogout() {
    localStorage.removeItem('embeleze_client_logged_in')
    localStorage.removeItem('embeleze_client_id')
    localStorage.removeItem('embeleze_client_name')
    localStorage.removeItem('embeleze_client_email')
    onBackHome()
  }

  return (
    <div className="bg-[#FDF8F8] min-h-screen">
      <main className="pt-24 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr]">
          <aside className="bg-white border-r border-gray-200 min-h-[calc(100vh-96px)] p-5 flex flex-col">
            <div className="mb-6">
              <p className="text-3xl font-serif font-bold text-[#1A1A1A] leading-none">{clientName}</p>
              <p className="text-sm text-gray-400 mt-2">{clientContact}</p>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setCurrentSection('service-requests')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                  currentSection === 'service-requests'
                    ? 'bg-rose-50 text-[#C38B94] font-semibold'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <ClipboardList size={16} />
                Solicitações de Serviços
              </button>

              <button
                type="button"
                onClick={() => setCurrentSection('orders')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                  currentSection === 'orders'
                    ? 'bg-rose-50 text-[#C38B94] font-semibold'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Package size={16} />
                Pedidos
              </button>

              <button
                type="button"
                onClick={() => setCurrentSection('appointments')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                  currentSection === 'appointments'
                    ? 'bg-rose-50 text-[#C38B94] font-semibold'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <CalendarDays size={16} />
                Agendamentos
              </button>
            </div>

            <div className="mt-auto pt-6 border-t border-gray-200 space-y-3">
              <button
                type="button"
                onClick={onBackHome}
                className="w-full flex items-center gap-3 text-gray-500 hover:text-[#C38B94] transition-colors"
              >
                <ArrowLeft size={16} />
                Voltar ao site
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-3 text-rose-500 hover:text-rose-600 transition-colors"
              >
                <LogOut size={16} />
                Sair
              </button>
            </div>
          </aside>

          <section className="px-6 lg:px-12">
            <div className="max-w-3xl mx-auto">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h1 className="font-serif text-5xl text-[#1A1A1A] mb-2">
                    {currentSection === 'service-requests' ? 'Solicitações de Serviços' : currentSection === 'orders' ? 'Pedidos de Produtos' : 'Agendamentos'}
                  </h1>
                  <p className="text-gray-500 text-lg">Olá, {clientName} 👋</p>
                </div>
                <button
                  onClick={onNewRequest}
                  className="bg-[#C38B94] hover:bg-[#A87080] text-white rounded-full px-6 py-2 font-bold text-sm flex items-center gap-2 transition-colors"
                >
                  <Plus size={18} />
                  Nova solicitação
                </button>
              </div>

              {currentSection === 'service-requests' && (
                <div className="space-y-4">
            {requests.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">
                <p className="text-gray-400 text-lg">Nenhuma solicitação ainda</p>
              </div>
            ) : (
              requests.map((request) => (
                <div
                  key={request.id}
                  className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">{request.type}</h3>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${getStatusColor(request.status)}`}>
                        {getStatusText(request.status)}
                      </span>
                    </div>
                    <span className="text-sm text-gray-400">{request.daysAgo} days ago</span>
                  </div>

                  <div className="flex items-center gap-8 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <span>📍</span>
                      {request.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <span>📅</span>
                      {request.date}
                    </div>
                    <div className="flex items-center gap-2">
                      <span>💰</span>
                      R$ {request.price}
                    </div>
                  </div>

                  {request.professional && (
                    <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#C38B94]/20 flex items-center justify-center text-[#C38B94]">
                        👤
                      </div>
                      <div>
                        <p className="font-semibold text-[#1A1A1A]">{request.professional.name}</p>
                        {request.professional.confirmed && (
                          <p className="text-xs text-gray-500">Profissional confirmada</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
                </div>
              )}

              {currentSection === 'orders' && (
                <div className="space-y-4">
                  {orders.length === 0 ? (
                    <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
                      <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                        <Package size={28} className="text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-lg mb-5">Você ainda não tem pedidos</p>
                    </div>
                  ) : (
                    orders.map((order) => (
                      <article
                        key={order.id}
                        className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">Pedido {order.id.slice(-6).toUpperCase()}</h3>
                            <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-600">✓ Pago</span>
                          </div>
                          <span className="text-sm text-gray-400">
                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString('pt-BR') : '-'}
                          </span>
                        </div>

                        <div className="flex items-center gap-8 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <span>🛍️</span>
                            {order.itemsCount} itens
                          </div>
                          <div className="flex items-center gap-2">
                            <span>💳</span>
                            Pago
                          </div>
                          <div className="flex items-center gap-2 font-semibold text-[#1A1A1A]">
                            <span>💰</span>
                            R$ {order.total.toFixed(2).replace('.', ',')}
                          </div>
                        </div>
                      </article>
                    ))
                  )}
                </div>
              )}

              {currentSection === 'appointments' && (
          <div className="space-y-4">
            {appointments.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <CalendarDays size={28} className="text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg mb-5">Você ainda não tem agendamentos</p>
                <button
                  type="button"
                  onClick={onNewRequest}
                  className="px-6 py-2 rounded-full border border-gray-200 text-gray-700 hover:border-[#C38B94] hover:text-[#C38B94] transition-colors font-semibold"
                >
                  Nova solicitação
                </button>
              </div>
            ) : (
              appointments.map((appointment) => (
                <article
                  key={appointment.id}
                  className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">{appointment.type}</h3>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${appointment.status === 'completed' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                        {appointment.status === 'completed' ? '✓ Concluído' : '✓ Confirmado'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-8 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <span>📍</span>
                      {appointment.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <span>📅</span>
                      {appointment.date}
                    </div>
                    <div className="flex items-center gap-2">
                      <span>💰</span>
                      R$ {appointment.price}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#C38B94]/20 flex items-center justify-center text-[#C38B94]">
                      👤
                    </div>
                    <div>
                      <p className="font-semibold text-[#1A1A1A]">{appointment.professionalName}</p>
                      <p className="text-xs text-gray-500">Profissional confirmada</p>
                    </div>
                  </div>
                </article>
              ))
            )}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
