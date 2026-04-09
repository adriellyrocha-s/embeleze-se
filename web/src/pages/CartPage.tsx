import { ArrowLeft, ShoppingBag, Loader, AlertCircle, CheckCircle, Plus, Minus } from 'lucide-react'
import { useState } from 'react'

type CartItem = {
  id: number
  name: string
  category: string
  image: string
  unitPrice: number
  quantity: number
}

type CartPageProps = {
  items: CartItem[]
  isClientLoggedIn: boolean
  onGoToClientProfile: () => void
  onRemoveItem: (id: number) => void
  onUpdateQuantity: (id: number, quantity: number) => void
  onFinalizePurchase: () => void
  onBackShopping: () => void
  onViewProducts: () => void
}

export function CartPage({
  items,
  isClientLoggedIn,
  onGoToClientProfile,
  onRemoveItem,
  onUpdateQuantity,
  onFinalizePurchase,
  onBackShopping,
  onViewProducts,
}: CartPageProps) {
  const [address, setAddress] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('PIX')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const total = items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0)
  const itemsCount = items.reduce((acc, item) => acc + item.quantity, 0)

  function formatMoney(value: number) {
    return `R$ ${value.toFixed(2).replace('.', ',')}`
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}
    
    if (!address.trim()) {
      errors.address = 'Endereço de entrega é obrigatório'
    } else if (address.trim().length < 10) {
      errors.address = 'Endereço deve ter pelo menos 10 caracteres'
    }
    
    if (!paymentMethod) {
      errors.payment = 'Selecione um método de pagamento'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleFinalizePurchase = async () => {
    if (!validateForm()) return

    setIsLoading(true)
    setError(null)

    try {
      const clientId = localStorage.getItem('embeleze_client_id')
      const clientProfile = localStorage.getItem('embeleze_client_profile')
      
      if (!clientId || !clientProfile) {
        throw new Error('Dados do cliente não encontrados')
      }

      const purchaseRecords = JSON.parse(localStorage.getItem('embeleze_purchase_records') || '[]')
      
      const record = {
        id: `purchase_${Date.now()}`,
        createdAt: new Date().toISOString(),
        client: JSON.parse(clientProfile),
        items,
        total,
        deliveryAddress: address.trim(),
        paymentMethod,
        status: 'PENDING',
      }

      localStorage.setItem('embeleze_purchase_records', JSON.stringify([record, ...purchaseRecords]))
      
      setSuccess(true)
      setAddress('')
      setPaymentMethod('PIX')
      
      setTimeout(() => {
        onFinalizePurchase()
      }, 1500)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao finalizar compra. Tente novamente.'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const updateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity > 0) {
      onUpdateQuantity(itemId, newQuantity)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FDF8F8] pt-28 pb-20 px-6">
        <div className="max-w-[1240px] mx-auto">
          <button
            type="button"
            onClick={onBackShopping}
            className="flex items-center gap-2 text-gray-400 hover:text-[#C38B94] transition-colors mb-8"
          >
            <ArrowLeft size={16} />
            Continuar comprando
          </button>

          <h1 className="font-serif text-[clamp(3.75rem,7vw,5.75rem)] text-[#1A1A1A] tracking-tight mb-20">
            Carrinho
            <span className="ml-4 align-middle text-2xl text-[#C38B94] font-sans font-semibold">
              ({itemsCount})
            </span>
          </h1>

          <section className="min-h-[48vh] flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-6">
              <ShoppingBag size={34} className="text-gray-300" strokeWidth={1.7} />
            </div>

            <h2 className="font-serif text-4xl text-[#1A1A1A] mb-3">Carrinho vazio</h2>
            <p className="text-gray-500 mb-8">Adicione produtos para começar.</p>

            <button
              type="button"
              onClick={onViewProducts}
              className="px-8 py-3 rounded-full border border-gray-200 text-gray-700 hover:border-[#C38B94] hover:text-[#C38B94] transition-colors"
            >
              Ver Produtos
            </button>
          </section>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FDF8F8] pt-28 pb-20 px-6">
      <div className="max-w-[1240px] mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_420px] gap-10 items-start">
        <div>
          <button
            type="button"
            onClick={onBackShopping}
            className="flex items-center gap-2 text-gray-400 hover:text-[#C38B94] transition-colors mb-8"
          >
            <ArrowLeft size={16} />
            Continuar comprando
          </button>

          <h1 className="font-serif text-[clamp(3.75rem,7vw,5.75rem)] text-[#1A1A1A] tracking-tight mb-12">
            Carrinho
            <span className="ml-4 align-middle text-2xl text-[#C38B94] font-sans font-semibold">
              ({itemsCount})
            </span>
          </h1>

          <section className="space-y-4">
            {items.map((item) => (
              <article
                key={item.id}
                className="bg-white rounded-[2rem] border border-gray-100 p-5 flex flex-col sm:flex-row sm:items-center gap-5 shadow-[0_18px_50px_rgba(195,139,148,0.08)] hover:border-gray-200 transition-colors"
              >
                <div className="w-28 h-28 rounded-[1.5rem] bg-[#F8F5F5] flex items-center justify-center shrink-0 overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain scale-[0.92]" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-400 italic">{item.category}</p>
                  <h3 className="font-serif text-3xl text-[#1A1A1A] leading-none mt-1">{item.name}</h3>
                  <p className="text-[#C38B94] font-semibold mt-3">{formatMoney(item.unitPrice)}</p>
                </div>

                <div className="flex items-center gap-3 border border-gray-200 rounded-full px-3 py-2 bg-white shrink-0">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1 text-gray-400 hover:text-[#C38B94] transition-colors"
                    aria-label="Diminuir quantidade"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center font-semibold text-[#1A1A1A]">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1 text-gray-400 hover:text-[#C38B94] transition-colors"
                    aria-label="Aumentar quantidade"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <div className="text-right">
                  <p className="font-serif text-3xl text-[#1A1A1A]">{formatMoney(item.unitPrice * item.quantity)}</p>
                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.id)}
                    className="text-xs text-gray-400 hover:text-rose-500 mt-2 transition-colors"
                  >
                    remover
                  </button>
                </div>
              </article>
            ))}
          </section>
        </div>

        <aside className="bg-white rounded-[2rem] border border-gray-100 p-7 h-fit sticky top-24 shadow-[0_18px_50px_rgba(195,139,148,0.08)]">
          <h2 className="font-serif text-4xl text-[#1A1A1A] mb-7">Resumo</h2>
          
          <div className="mb-7 space-y-4">
            <div className="flex justify-between text-gray-600 text-lg">
              <span>Subtotal</span>
              <span>{formatMoney(total)}</span>
            </div>
            <div className="flex justify-between text-gray-600 text-lg">
              <span>Entrega</span>
              <span className="text-[#C38B94] font-semibold">Grátis</span>
            </div>
            <div className="flex justify-between text-[#1A1A1A] font-semibold border-t border-gray-100 pt-4 text-lg">
              <span>Total</span>
              <span>{formatMoney(total)}</span>
            </div>
          </div>

          {!isClientLoggedIn ? (
            <div className="space-y-2">
              <button
                type="button"
                onClick={onGoToClientProfile}
                className="w-full bg-[#C38B94] text-white py-4 rounded-full font-semibold hover:bg-[#B47E87] transition-colors"
              >
                Finalizar pedido
              </button>
              <p className="text-xs text-gray-400 text-center">Seus dados serao solicitados no proximo passo.</p>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleFinalizePurchase(); }}>
              {/* Endereço de Entrega */}
              <div>
                <label htmlFor="address" className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                  Endereço de Entrega *
                </label>
                <input
                  id="address"
                  type="text"
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value)
                    if (formErrors.address) {
                      setFormErrors({ ...formErrors, address: '' })
                    }
                  }}
                  placeholder="Rua, número, bairro..."
                  className={`w-full px-4 py-3 rounded-full border transition-colors focus:outline-none ${
                    formErrors.address
                      ? 'border-rose-300 bg-rose-50'
                      : 'border-gray-200 bg-gray-50 focus:border-[#C38B94]'
                  }`}
                />
                {formErrors.address && (
                  <div className="flex items-center gap-2 mt-2 text-sm text-rose-600">
                    <AlertCircle size={14} />
                    {formErrors.address}
                  </div>
                )}
              </div>

              {/* Método de Pagamento */}
              <div>
                <label htmlFor="payment" className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                  Método de Pagamento *
                </label>
                <select
                  id="payment"
                  value={paymentMethod}
                  onChange={(e) => {
                    setPaymentMethod(e.target.value)
                    if (formErrors.payment) {
                      setFormErrors({ ...formErrors, payment: '' })
                    }
                  }}
                  className="w-full px-4 py-3 rounded-full border border-gray-200 bg-gray-50 text-[#1A1A1A] focus:outline-none focus:border-[#C38B94] transition-colors"
                >
                  <option value="PIX">PIX</option>
                  <option value="CARTAO">Cartão de Crédito</option>
                  <option value="CREDITO">Crédito em Conta</option>
                </select>
              </div>

              {/* Mensagem de erro */}
              {error && (
                <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-300 rounded-full text-sm text-rose-700">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              {/* Mensagem de sucesso */}
              {success && (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-300 rounded-full text-sm text-green-700">
                  <CheckCircle size={16} />
                  Pedido realizado com sucesso!
                </div>
              )}

              {/* Botão de Finalização */}
              <button
                type="submit"
                disabled={isLoading || success}
                className={`w-full py-4 rounded-full font-semibold transition-all flex items-center justify-center gap-2 ${
                  success
                    ? 'bg-green-500 text-white'
                    : isLoading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-[#C38B94] text-white hover:bg-[#B47E87]'
                }`}
              >
                {isLoading && <Loader size={18} className="animate-spin" />}
                {isLoading ? 'Processando...' : success ? 'Pedido confirmado!' : 'Finalizar Pedido'}
              </button>

              <p className="text-xs text-gray-500 text-center mt-3">
                Seus dados estão seguros e criptografados.
              </p>
            </form>
          )}
        </aside>
      </div>
    </div>
  )
}
