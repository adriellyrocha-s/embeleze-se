import { ArrowLeft, CreditCard, Lock, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'

type PaymentItem = {
  id: number
  name: string
  category: string
  image: string
  unitPrice: number
  quantity: number
}

type PaymentPageProps = {
  items: PaymentItem[]
  isClientLoggedIn: boolean
  onBackToCart: () => void
  onCompletePayment: () => void
  onGoToClientProfile?: () => void
}

export function PaymentPage({ items, isClientLoggedIn, onBackToCart, onCompletePayment, onGoToClientProfile }: PaymentPageProps) {
  const total = items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0)
  const [paymentMethod, setPaymentMethod] = useState<'CARTAO' | 'PIX' | 'SALDO'>('CARTAO')
  const [selectedInstallments, setSelectedInstallments] = useState(1)

  const installmentOptions = useMemo(() => {
    return Array.from({ length: 12 }, (_, index) => {
      const count = index + 1
      const feeMultiplier = count <= 3 ? 1 : 1 + (count - 3) * 0.012
      const installmentValue = (total * feeMultiplier) / count
      const totalWithFees = installmentValue * count

      return {
        count,
        installmentValue,
        totalWithFees,
      }
    })
  }, [total])

  const selectedInstallment = installmentOptions.find((option) => option.count === selectedInstallments)

  const pixPayload = useMemo(() => {
    const amount = total.toFixed(2)
    return `00020126580014BR.GOV.BCB.PIX0136contato@embeleze-se.com520400005303986540${amount.length.toString().padStart(2, '0')}${amount}5802BR5916EMBELEZE-SE LTDA6009SAO PAULO62070503***6304ABCD`
  }, [total])

  const pixQrCodeUrl = useMemo(() => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(pixPayload)}`
  }, [pixPayload])

  async function handleCopyPixCode() {
    try {
      await navigator.clipboard.writeText(pixPayload)
    } catch {
      // Silently ignore when clipboard is unavailable.
    }
  }

  return (
    <div className="min-h-screen bg-[#FDF8F8] pt-32 pb-20 px-6">
      <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
        <div>
          <button
            type="button"
            onClick={onBackToCart}
            className="flex items-center gap-2 text-gray-400 hover:text-[#C38B94] transition-colors mb-8"
          >
            <ArrowLeft size={16} />
            Voltar ao carrinho
          </button>

          <h1 className="font-serif text-6xl text-[#1A1A1A] tracking-tight mb-4">Pagamento</h1>
          <p className="text-gray-500 max-w-2xl mb-10">
            Revise os itens do seu pedido e escolha a forma de pagamento para concluir a compra.
          </p>

          <section className="space-y-4">
            {items.map((item) => (
              <article key={item.id} className="bg-white rounded-3xl border border-gray-100 p-4 flex gap-4 items-center">
                <img src={item.image} alt={item.name} className="w-24 h-24 rounded-2xl object-cover" />
                <div className="flex-1">
                  <p className="text-xs text-gray-400 italic">{item.category}</p>
                  <h3 className="font-serif text-2xl text-[#1A1A1A]">{item.name}</h3>
                  <p className="text-[#C38B94] font-semibold mt-1">Qtd: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-serif text-2xl text-[#1A1A1A]">R$ {(item.unitPrice * item.quantity).toFixed(2).replace('.', ',')}</p>
                </div>
              </article>
            ))}
          </section>

          <section className="bg-white rounded-[2rem] border border-gray-100 p-7 shadow-sm mt-8">
            <div className="flex items-center gap-3 mb-5 text-gray-500 uppercase tracking-wider text-sm">
              <span className="w-7 h-7 rounded-full bg-rose-50 text-[#C38B94] flex items-center justify-center text-xs font-bold">1</span>
              <span>Forma de pagamento</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <label className="flex items-center gap-3 p-4 rounded-2xl border border-gray-200 bg-gray-50/40 cursor-pointer">
                <input
                  type="radio"
                  name="payment-method"
                  checked={paymentMethod === 'CARTAO'}
                  onChange={() => setPaymentMethod('CARTAO')}
                  className="accent-[#C38B94]"
                />
                <CreditCard size={18} className="text-[#C38B94]" />
                <span className="text-sm text-gray-700">Cartão</span>
              </label>
              <label className="flex items-center gap-3 p-4 rounded-2xl border border-gray-200 bg-gray-50/40 cursor-pointer">
                <input
                  type="radio"
                  name="payment-method"
                  checked={paymentMethod === 'PIX'}
                  onChange={() => setPaymentMethod('PIX')}
                  className="accent-[#C38B94]"
                />
                <span className="w-[18px] h-[18px] rounded-full bg-[#C38B94] text-white text-[10px] font-bold flex items-center justify-center">R$</span>
                <span className="text-sm text-gray-700">Pix</span>
              </label>
              <label className="flex items-center gap-3 p-4 rounded-2xl border border-gray-200 bg-gray-50/40 cursor-pointer">
                <input
                  type="radio"
                  name="payment-method"
                  checked={paymentMethod === 'SALDO'}
                  onChange={() => setPaymentMethod('SALDO')}
                  className="accent-[#C38B94]"
                />
                <Sparkles size={18} className="text-[#C38B94]" />
                <span className="text-sm text-gray-700">Saldo</span>
              </label>
            </div>

            {paymentMethod === 'PIX' && (
              <div className="mt-6 rounded-3xl border border-[#C38B94]/25 bg-rose-50/40 p-5">
                <p className="text-sm text-[#1A1A1A] mb-3">
                  Escaneie o QR Code para pagar com Pix.
                </p>
                <div className="flex flex-col md:flex-row gap-4 md:items-center">
                  <img
                    src={pixQrCodeUrl}
                    alt="QR Code Pix"
                    className="w-[180px] h-[180px] rounded-2xl border border-rose-100 bg-white"
                  />
                  <div className="flex-1 space-y-3">
                    <p className="text-xs text-gray-500 break-all">{pixPayload}</p>
                    <button
                      type="button"
                      onClick={handleCopyPixCode}
                      className="px-5 py-2.5 rounded-full bg-[#C38B94] text-white text-sm font-semibold hover:bg-[#B47E87] transition-colors"
                    >
                      Copiar codigo Pix
                    </button>
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'CARTAO' && (
              <div className="mt-6 rounded-3xl border border-gray-200 bg-gray-50/40 p-5 space-y-4">
                <div>
                  <label htmlFor="installments" className="block text-sm text-[#1A1A1A] mb-2 font-medium">
                    Parcelamento
                  </label>
                  <select
                    id="installments"
                    value={selectedInstallments}
                    onChange={(event) => setSelectedInstallments(Number(event.target.value))}
                    className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[#C38B94]/10 focus:border-[#C38B94]"
                  >
                    {installmentOptions.map((option) => (
                      <option key={option.count} value={option.count}>
                        {option.count}x de R$ {option.installmentValue.toFixed(2).replace('.', ',')}
                        {option.count <= 3 ? ' sem juros' : ' com juros'}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedInstallment && (
                  <p className="text-sm text-gray-600">
                    Total no cartao: <span className="font-semibold text-[#1A1A1A]">R$ {selectedInstallment.totalWithFees.toFixed(2).replace('.', ',')}</span>
                  </p>
                )}
              </div>
            )}

            {paymentMethod === 'SALDO' && (
              <div className="mt-6 rounded-3xl border border-[#C38B94]/25 bg-rose-50/40 p-5 space-y-3">
                <p className="text-sm text-[#1A1A1A]">
                  Use seu saldo Embeleze-se para pagar. Se ainda nao tem saldo, crie seu perfil e faca um deposito.
                </p>
                <button
                  type="button"
                  onClick={() => onGoToClientProfile?.()}
                  className="px-5 py-2.5 rounded-full bg-[#C38B94] text-white text-sm font-semibold hover:bg-[#B47E87] transition-colors"
                >
                  Criar perfil e depositar saldo
                </button>
                {!isClientLoggedIn && (
                  <p className="text-xs text-gray-500">Apos criar seu perfil, voce podera carregar e usar seu saldo.</p>
                )}
              </div>
            )}

            <p className="mt-4 text-xs text-gray-400 flex items-center gap-2">
              <Lock size={14} /> Pagamento protegido e seguro.
            </p>
          </section>
        </div>

        <aside className="bg-white rounded-3xl border border-gray-100 p-6 h-fit sticky top-28">
          <h2 className="font-serif text-3xl text-[#1A1A1A] mb-6">Resumo</h2>

          <div className="flex justify-between text-gray-600 mb-3">
            <span>Subtotal</span>
            <span>R$ {total.toFixed(2).replace('.', ',')}</span>
          </div>
          <div className="flex justify-between text-[#1A1A1A] font-semibold border-t border-gray-100 pt-4 mb-6">
            <span>Total</span>
            <span>R$ {total.toFixed(2).replace('.', ',')}</span>
          </div>

          <button
            type="button"
            onClick={onCompletePayment}
            disabled={items.length === 0}
            className="w-full bg-[#C38B94] text-white py-4 rounded-full font-semibold hover:bg-[#B47E87] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirmar pagamento
          </button>
        </aside>
      </div>
    </div>
  )
}