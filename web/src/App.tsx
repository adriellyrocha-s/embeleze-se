import { useEffect, useRef, useState } from 'react'

// Componentes Globais
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'

// Seções da Home
import { Hero } from './components/Hero'
import { CategorySection } from './components/CategorySection'
import { ProfessionalList } from './components/ProfessionalList'
import { HowItWorks } from './components/HowItWorks'
import { ProductGrid } from './components/ProductGrid'
import type { ProductItem } from './components/ProductGrid'
import type { ProfessionalCard } from './components/ProfessionalList'

// Páginas
import { ProfessionalsPage } from './pages/ProfessionalsPage'
import { ProductsPage } from './pages/ProductsPage'
import { ServiceRequestPage } from './pages/ServiceRequestPage'
import { PartnerRegister } from './pages/PartnerRegister'
import { PartnerDashboard } from './pages/PartnerDashboard'
import { CartPage } from './pages/CartPage'
import { Register } from './pages/Register'
import { PaymentPage } from './pages/PaymentPage'
import { ProfessionalDetailsPage } from './pages/ProfessionalDetailsPage'
import { AdminPanelPage } from './pages/AdminPanelPage'

// Definição dos tipos de rotas para o TypeScript
type Page = 'home' | 'professionals' | 'products' | 'request' | 'client-register' | 'partner-register' | 'partner-dashboard' | 'admin-panel' | 'cart' | 'payment' | 'professional-details'

const ADMIN_SESSION_TIMEOUT_MS = 30 * 60 * 1000
const ADMIN_LAST_ACTIVITY_KEY = 'embeleze_admin_last_activity'

export default function App() {
  // Estado que controla qual página o usuário está vendo
  const [currentPage, setCurrentPage] = useState<Page>('home')
  const [initialProfessionalsCategory, setInitialProfessionalsCategory] = useState('Todas')
  const [cartItems, setCartItems] = useState<Array<ProductItem & { unitPrice: number; quantity: number }>>([])
  const [selectedProfessional, setSelectedProfessional] = useState<ProfessionalCard | null>(null)
  const [previousPage, setPreviousPage] = useState<Page | null>(null)
  const isPartnerDashboard = currentPage === 'partner-dashboard'
  const isAdminPanel = currentPage === 'admin-panel'
  const isAdminLoggedIn = localStorage.getItem('embeleze_admin_logged_in') === 'true'
  const lastActivityWriteRef = useRef(0)

  function clearAdminSession() {
    localStorage.removeItem('embeleze_admin_logged_in')
    localStorage.removeItem('embeleze_admin_id')
    localStorage.removeItem('embeleze_admin_name')
    localStorage.removeItem('embeleze_admin_email')
    localStorage.removeItem('embeleze_admin_key')
    localStorage.removeItem(ADMIN_LAST_ACTIVITY_KEY)
  }

  function touchAdminSessionActivity(force = false) {
    const now = Date.now()
    const shouldWrite = force || now - lastActivityWriteRef.current > 15000
    if (!shouldWrite) return

    localStorage.setItem(ADMIN_LAST_ACTIVITY_KEY, String(now))
    lastActivityWriteRef.current = now
  }

  function isAdminSessionExpired() {
    const lastActivityRaw = localStorage.getItem(ADMIN_LAST_ACTIVITY_KEY)
    if (!lastActivityRaw) return true

    const lastActivity = Number(lastActivityRaw)
    if (Number.isNaN(lastActivity)) return true

    return Date.now() - lastActivity > ADMIN_SESSION_TIMEOUT_MS
  }
  const hasClientProfile = localStorage.getItem('embeleze_client_profile_created') === 'true'
  const isClientLoggedIn = localStorage.getItem('embeleze_client_logged_in') === 'true'
  const cartItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0)

  function parsePrice(value: string) {
    return Number(value.replace('.', '').replace(',', '.'))
  }

  function addToCart(product: ProductItem) {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }

      return [...prev, { ...product, unitPrice: parsePrice(product.price), quantity: 1 }]
    })
  }

  function removeFromCart(productId: number) {
    setCartItems((prev) => prev.filter((item) => item.id !== productId))
  }

  function updateQuantity(productId: number, quantity: number) {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    )
  }

  function finalizePurchase() {
    if (cartItems.length === 0) {
      return
    }

    const clientProfile = localStorage.getItem('embeleze_client_profile')
    const purchaseRecords = JSON.parse(localStorage.getItem('embeleze_purchase_records') || '[]')
    const total = cartItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0)

    const record = {
      id: `purchase_${Date.now()}`,
      createdAt: new Date().toISOString(),
      client: clientProfile ? JSON.parse(clientProfile) : null,
      items: cartItems,
      total,
    }

    localStorage.setItem('embeleze_purchase_records', JSON.stringify([record, ...purchaseRecords]))
    setCartItems([])
    setCurrentPage('home')
  }

  function handleNavigate(page: Page) {
    if (page === 'request' && !hasClientProfile) {
      setPreviousPage('request')
      setCurrentPage('client-register')
      return
    }

    if (page === 'admin-panel' && !isAdminLoggedIn) {
      setCurrentPage('partner-dashboard')
      return
    }

    if (page === 'admin-panel' && isAdminLoggedIn && isAdminSessionExpired()) {
      clearAdminSession()
      setCurrentPage('partner-dashboard')
      return
    }

    if (page === 'admin-panel' && isAdminLoggedIn) {
      touchAdminSessionActivity(true)
    }

    setCurrentPage(page)
  }

  useEffect(() => {
    if (!isAdminLoggedIn) return

    if (isAdminSessionExpired()) {
      clearAdminSession()
      if (currentPage === 'admin-panel') {
        setCurrentPage('partner-dashboard')
      }
      return
    }

    touchAdminSessionActivity(true)

    const activityEvents: Array<keyof WindowEventMap> = ['click', 'keydown', 'mousemove', 'scroll', 'touchstart']
    const handleActivity = () => touchAdminSessionActivity()
    activityEvents.forEach((eventName) => window.addEventListener(eventName, handleActivity, { passive: true }))

    const intervalId = window.setInterval(() => {
      if (!isAdminSessionExpired()) return

      clearAdminSession()
      if (currentPage === 'admin-panel') {
        setCurrentPage('partner-dashboard')
      }
    }, 30000)

    return () => {
      activityEvents.forEach((eventName) => window.removeEventListener(eventName, handleActivity))
      window.clearInterval(intervalId)
    }
  }, [isAdminLoggedIn, currentPage])

  function handleSelectProfessional(professional: ProfessionalCard) {
    setSelectedProfessional(professional)
    setCurrentPage('professional-details')
  }

  function handleCategoryShortcut(category: string) {
    setInitialProfessionalsCategory(category)
    setCurrentPage('professionals')
  }

  return (
    <div className="min-h-screen bg-[#FDF8F8] antialiased selection:bg-rose-100 selection:text-rose-900">
      
      {/* 1. Navbar: Recebe a função de navegação para trocar de página via links */}
      {!isPartnerDashboard && !isAdminPanel && (
        <Navbar
          onNavigate={(page: Page) => handleNavigate(page)}
          cartItemsCount={cartItemsCount}
        />
      )}

      <main>
        {/* --- ROTA: HOME --- */}
        {currentPage === 'home' && (
          <>
            <Hero
              onExplore={() => handleNavigate('request')}
              onViewProducts={() => handleNavigate('products')}
            />
            
            <CategorySection onSelectCategory={handleCategoryShortcut} />

            {/* Seção Parceiras em Destaque (Design Editorial image_796a27.png) */}
            <section className="max-w-[1440px] mx-auto px-6 md:px-16 py-32">
              <div className="flex justify-between items-end mb-20">
                <div className="relative group cursor-default">
                  <span className="text-[#C38B94] font-bold text-[11px] uppercase tracking-[0.6em] absolute -top-12 left-0">
                    Parceiras
                  </span>
                  <h2 className="font-serif text-8xl text-[#1A1A1A] tracking-tighter leading-[0.8] lowercase">
                    <span className="italic font-light opacity-40">!</span> em destaque
                  </h2>
                </div>
                
                <button 
                  onClick={() => setCurrentPage('professionals')}
                  className="group flex items-center gap-3 text-[#C38B94] text-sm font-bold tracking-widest uppercase hover:opacity-70 transition-all pb-2"
                >
                  Ver todas 
                  <span className="text-3xl transition-transform group-hover:translate-x-2">→</span>
                </button>
              </div>

              <ProfessionalList onSelectProfessional={handleSelectProfessional} />
            </section>

            <HowItWorks />

            {/* Seção Loja Compacta na Home (image_79818d.png) */}
            <div className="py-20">
              <ProductGrid onAddToCart={addToCart} />
            </div>
          </>
        )}

        {/* --- ROTA: LISTAGEM DE PROFISSIONAIS (image_79df45.png) --- */}
        {currentPage === 'professionals' && (
          <ProfessionalsPage
            onSelectProfessional={handleSelectProfessional}
            initialCategory={initialProfessionalsCategory}
          />
        )}

        {/* --- ROTA: DETALHE DA PROFISSIONAL --- */}
        {currentPage === 'professional-details' && selectedProfessional && (
          <ProfessionalDetailsPage
            professional={selectedProfessional}
            onBack={() => setCurrentPage('professionals')}
          />
        )}

        {/* --- ROTA: LOJA DE PRODUTOS (image_79f92e.png) --- */}
        {currentPage === 'products' && (
          <ProductsPage onAddToCart={addToCart} />
        )}

        {/* --- ROTA: SOLICITAR SERVIÇO (MAPA - image_7a52c9.png) --- */}
        {currentPage === 'request' && (
          <ServiceRequestPage onBack={() => setCurrentPage('home')} />
        )}

        {/* --- ROTA: CRIAR PERFIL DE CLIENTE --- */}
        {currentPage === 'client-register' && (
          <Register
            onBack={() => setCurrentPage('home')}
            onProfileCreated={() => {
              localStorage.setItem('embeleze_client_profile_created', 'true')
              setCurrentPage(previousPage === 'request' ? 'request' : 'payment')
              setPreviousPage(null)
            }}
            onSkip={() => {
              setCurrentPage(previousPage === 'request' ? 'request' : 'cart')
              setPreviousPage(null)
            }}
          />
        )}

        {/* --- ROTA: PAGAMENTO DO CARRINHO --- */}
        {currentPage === 'payment' && (
          <PaymentPage
            items={cartItems}
            isClientLoggedIn={isClientLoggedIn}
            onBackToCart={() => setCurrentPage('cart')}
            onGoToClientProfile={() => setCurrentPage('client-register')}
            onCompletePayment={finalizePurchase}
          />
        )}

        {/* --- ROTA: CARRINHO --- */}
        {currentPage === 'cart' && (
          <CartPage
            items={cartItems}
            isClientLoggedIn={isClientLoggedIn}
            onGoToClientProfile={() => setCurrentPage('payment')}
            onRemoveItem={removeFromCart}
            onUpdateQuantity={updateQuantity}
            onFinalizePurchase={finalizePurchase}
            onBackShopping={() => setCurrentPage('products')}
            onViewProducts={() => setCurrentPage('products')}
          />
        )}

        {/* --- ROTA: CADASTRO PARCEIRA --- */}
        {currentPage === 'partner-register' && (
          <PartnerRegister onRegistered={() => setCurrentPage('partner-dashboard')} />
        )}

        {/* --- ROTA: PAINEL PARCEIRA (RESTRITO) --- */}
        {currentPage === 'partner-dashboard' && (
          <PartnerDashboard
            onBackHome={() => setCurrentPage('home')}
            onGoToRegister={() => setCurrentPage('partner-register')}
            onGoToAdminPanel={() => setCurrentPage('admin-panel')}
          />
        )}

        {/* --- ROTA: PAINEL ADMIN --- */}
        {currentPage === 'admin-panel' && (
          <AdminPanelPage
            onBackHome={() => setCurrentPage('home')}
            onRequireLogin={() => setCurrentPage('partner-dashboard')}
          />
        )}
      </main>

      {/* 2. Footer: Estático em todas as páginas */}
      {!isPartnerDashboard && !isAdminPanel && <Footer />}
    </div>
  )
}