import { useState } from 'react'
import { Calendar, Clock3, CreditCard, Shield, Star, MapPin, ArrowLeft, X } from 'lucide-react'
import type { ProfessionalCard } from '../components/ProfessionalList'
import { api } from '../lib/api'
import type { AxiosError } from 'axios'

type ProfessionalDetailsPageProps = {
  professional: ProfessionalCard
  onBack: () => void
}

function getServicesByCategory(category: string) {
  const normalized = category.toLowerCase()

  if (normalized.includes('cabel')) {
    return ['Corte Feminino', 'Coloracao', 'Hidratacao', 'Escova', 'Progressiva']
  }

  if (normalized.includes('maqui')) {
    return ['Maquiagem Social', 'Noiva', 'Pele Glow', 'Olhos Esfumados', 'Producoes']
  }

  if (normalized.includes('manicure')) {
    return ['Manicure Tradicional', 'Esmaltacao em Gel', 'Spa das Maos', 'Blindagem', 'Nail Art']
  }

  return ['Atendimento Premium', 'Servico em Domicilio', 'Agendamento Flexivel', 'Pacotes', 'Consulta Rapida']
}

export function ProfessionalDetailsPage({ professional, onBack }: ProfessionalDetailsPageProps) {
  const services = getServicesByCategory(professional.category)
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [selectedService, setSelectedService] = useState('')
  const [appointmentDate, setAppointmentDate] = useState('')
  const [appointmentTime, setAppointmentTime] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [notes, setNotes] = useState('')
  const [formError, setFormError] = useState('')
  const [bookingConfirmed, setBookingConfirmed] = useState(false)
  const [bookingMessage, setBookingMessage] = useState('')

  async function handleConfirmBooking() {
    if (!selectedService || !appointmentDate || !appointmentTime || !customerName.trim()) {
      setFormError('Preencha os campos obrigatorios para confirmar o agendamento.')
      return
    }

    const customerId = localStorage.getItem('embeleze_client_id')
    const customerEmail = localStorage.getItem('embeleze_client_email') || ''
    const scheduledAtIso = new Date(`${appointmentDate}T${appointmentTime}`).toISOString()
    const basePriceValue = Number(professional.basePrice.replace(',', '.')) || 0
    const appointmentPayload = {
      customerId,
      customerName: customerName.trim(),
      customerEmail,
      professionalId: professional.id,
      professionalName: professional.name,
      professionalCategory: professional.category,
      professionalLocation: professional.location,
      professionalBasePrice: basePriceValue,
      professionalAvatar: professional.avatar,
      scheduledAt: scheduledAtIso,
      service: selectedService,
      notes,
      totalPrice: basePriceValue,
    }

    try {
      await api.post('/appointments', appointmentPayload)

      setFormError('')
      setBookingConfirmed(true)
      setBookingMessage('Agendamento confirmado! Em breve voce recebera os detalhes.')
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>
      const statusCode = axiosError.response?.status
      const apiMessage = axiosError.response?.data?.message
      const shouldUseLocalFallback = !statusCode || statusCode >= 500

      if (shouldUseLocalFallback) {
        const localQueue = JSON.parse(localStorage.getItem('embeleze_local_appointments') || '[]')
        localQueue.unshift({
          id: `local_${Date.now()}`,
          createdAt: new Date().toISOString(),
          status: 'PENDING_LOCAL',
          ...appointmentPayload,
        })
        localStorage.setItem('embeleze_local_appointments', JSON.stringify(localQueue))

        setFormError('')
        setBookingConfirmed(true)
        setBookingMessage('Agendamento salvo localmente. API indisponivel no momento, mas seu pedido foi registrado.')
        return
      }

      setBookingConfirmed(false)
      setBookingMessage('')
      setFormError(apiMessage || 'Nao foi possivel confirmar o agendamento agora. Tente novamente.')
    }
  }

  return (
    <div className="min-h-screen bg-[#FDF8F8] pt-28 pb-20">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <button
          type="button"
          onClick={onBack}
          className="mb-6 text-sm flex items-center gap-2 text-gray-500 hover:text-[#C38B94] transition-colors"
        >
          <ArrowLeft size={16} /> Voltar para profissionais
        </button>

        <section className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">
          <div>
            <div className="relative rounded-[2rem] overflow-hidden border border-rose-100 bg-white">
              <div className="absolute top-5 left-5 z-10 bg-white/90 px-4 py-1.5 rounded-full text-xs font-semibold text-gray-700 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500" /> Disponivel agora
              </div>
              <img
                src={professional.avatar}
                onError={(event) => {
                  event.currentTarget.src = 'https://images.unsplash.com/photo-1522337363627-5d512968c17a?q=80&w=1200'
                }}
                alt={professional.name}
                className="w-full h-[420px] object-cover"
              />
            </div>

            <div className="pt-6">
              <span className="inline-flex px-3 py-1 rounded-full bg-rose-50 text-[#C38B94] text-xs font-semibold mb-3">
                {professional.category}
              </span>

              <h1 className="font-serif text-5xl text-[#1A1A1A] mb-3 tracking-tight">{professional.name}</h1>

              <div className="flex flex-wrap items-center gap-4 text-gray-500 text-sm mb-5">
                <span className="flex items-center gap-1"><Star size={14} className="text-[#C38B94]" fill="currentColor" /> {professional.rating.toFixed(1)} (89 avaliações)</span>
                <span className="flex items-center gap-1"><MapPin size={14} /> {professional.location}, Sao Paulo</span>
                <span className="flex items-center gap-1"><Clock3 size={14} /> Seg-Sex 9h-18h</span>
              </div>

              <p className="text-gray-600 text-lg leading-relaxed max-w-4xl">
                {professional.bio}
              </p>

              <div className="mt-10">
                <h2 className="font-serif text-4xl text-[#1A1A1A] mb-4">Servicos</h2>
                <div className="flex flex-wrap gap-3">
                  {services.map((service) => (
                    <span
                      key={service}
                      className="px-4 py-2 rounded-full text-sm bg-white border border-gray-200 text-gray-700"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-10 pb-8">
                <h2 className="font-serif text-4xl text-[#1A1A1A] mb-4">Avaliacoes</h2>
                <div className="space-y-4 bg-white border border-gray-100 rounded-3xl p-6">
                  <div className="pb-4 border-b border-gray-100">
                    <p className="text-[#C38B94] mb-1">★★★★★ Leticia Souza</p>
                    <p className="text-gray-600">Melhor profissional que ja fui. Entendeu exatamente o que eu queria.</p>
                  </div>
                  <div>
                    <p className="text-[#C38B94] mb-1">★★★★☆ Renata Alves</p>
                    <p className="text-gray-600">Otimo atendimento e resultado bonito. Pretendo marcar novamente.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <aside className="bg-white border border-gray-100 rounded-3xl p-6 sticky top-28 shadow-sm">
            {!isBookingOpen ? (
              <>
                <p className="text-gray-400">A partir de</p>
                <p className="font-serif text-6xl text-[#C38B94] leading-none mt-1 mb-5">R$ {professional.basePrice}</p>

                <button
                  type="button"
                  onClick={() => {
                    setIsBookingOpen(true)
                    setBookingConfirmed(false)
                  }}
                  className="w-full bg-[#C38B94] text-white py-4 rounded-full font-semibold hover:bg-[#b07982] transition-colors flex items-center justify-center gap-2"
                >
                  <Calendar size={16} /> Agendar Agora
                </button>

                <div className="mt-6 pt-5 border-t border-gray-100 text-gray-500 text-sm space-y-2">
                  <p className="flex items-center gap-2"><CreditCard size={14} /> Pagamento seguro online</p>
                  <p className="flex items-center gap-2"><Shield size={14} /> Profissional verificada</p>
                </div>
              </>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-serif text-4xl text-[#1A1A1A]">Agendar</h3>
                  <button
                    type="button"
                    onClick={() => {
                      setIsBookingOpen(false)
                      setBookingConfirmed(false)
                      setFormError('')
                    }}
                    className="text-gray-400 hover:text-[#C38B94] transition-colors"
                    aria-label="Fechar agendamento"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 text-sm mb-2">Servico *</label>
                    <select
                      value={selectedService}
                      onChange={(event) => setSelectedService(event.target.value)}
                      className="w-full border border-gray-200 bg-gray-50/60 rounded-2xl px-4 py-3 text-gray-700 outline-none focus:ring-2 focus:ring-[#C38B94]/10 focus:border-[#C38B94]"
                    >
                      <option value="">Selecione o servico</option>
                      {services.map((service) => (
                        <option key={service} value={service}>{service}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-700 text-sm mb-2">Data *</label>
                      <input
                        type="date"
                        value={appointmentDate}
                        onChange={(event) => setAppointmentDate(event.target.value)}
                        className="w-full border border-gray-200 bg-gray-50/60 rounded-2xl px-4 py-3 text-gray-700 outline-none focus:ring-2 focus:ring-[#C38B94]/10 focus:border-[#C38B94]"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm mb-2">Horario *</label>
                      <input
                        type="time"
                        value={appointmentTime}
                        onChange={(event) => setAppointmentTime(event.target.value)}
                        className="w-full border border-gray-200 bg-gray-50/60 rounded-2xl px-4 py-3 text-gray-700 outline-none focus:ring-2 focus:ring-[#C38B94]/10 focus:border-[#C38B94]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm mb-2">Seu nome *</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(event) => setCustomerName(event.target.value)}
                      placeholder="Seu nome completo"
                      className="w-full border border-gray-200 bg-gray-50/60 rounded-2xl px-4 py-3 text-gray-700 outline-none focus:ring-2 focus:ring-[#C38B94]/10 focus:border-[#C38B94]"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm mb-2">Observacoes</label>
                    <textarea
                      value={notes}
                      onChange={(event) => setNotes(event.target.value)}
                      placeholder="Alguma observacao especial?"
                      className="w-full border border-gray-200 bg-gray-50/60 rounded-2xl px-4 py-3 text-gray-700 outline-none min-h-[100px] resize-none focus:ring-2 focus:ring-[#C38B94]/10 focus:border-[#C38B94]"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleConfirmBooking}
                    className="w-full bg-[#C38B94] text-white py-4 rounded-full font-semibold hover:bg-[#b07982] transition-colors flex items-center justify-center gap-2"
                  >
                    <Calendar size={16} /> Confirmar Agendamento
                  </button>

                  {formError && (
                    <p className="text-sm text-rose-500">{formError}</p>
                  )}

                  {bookingConfirmed && (
                    <p className="text-sm text-green-600">{bookingMessage}</p>
                  )}
                </div>
              </div>
            )}
          </aside>
        </section>
      </div>
    </div>
  )
}