import { Search, ShoppingBag, User, LayoutDashboard, LogOut } from 'lucide-react'
import { useState } from 'react'

type NavbarProps = {
  onNavigate?: (page: 'home' | 'professionals' | 'products' | 'request' | 'partner-register' | 'partner-dashboard' | 'admin-panel' | 'cart' | 'client-area') => void
  cartItemsCount?: number
}

export function Navbar({ onNavigate, cartItemsCount = 0 }: NavbarProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const isPartnerLoggedIn = localStorage.getItem('embeleze_partner_logged_in') === 'true'
  const isClientLoggedIn = localStorage.getItem('embeleze_client_logged_in') === 'true'
  const isAdminLoggedIn = localStorage.getItem('embeleze_admin_logged_in') === 'true'
  const isAnyLoggedIn = isPartnerLoggedIn || isClientLoggedIn || isAdminLoggedIn
  const adminName = localStorage.getItem('embeleze_admin_name') || 'Administrador'
  const adminContact = localStorage.getItem('embeleze_admin_email') || 'admin@embeleze.se'
  const partnerName = localStorage.getItem('embeleze_partner_name') || 'Parceira Embeleze-se'
  const partnerContact = localStorage.getItem('embeleze_partner_email') || 'contato@embeleze-se.com'
  const clientName = localStorage.getItem('embeleze_client_name') || 'Cliente'
  const clientContact = localStorage.getItem('embeleze_client_email') || ''

  function handleLogout() {
    localStorage.removeItem('embeleze_partner_logged_in')
    localStorage.removeItem('embeleze_partner_name')
    localStorage.removeItem('embeleze_partner_email')
    localStorage.removeItem('embeleze_partner_registered')
    localStorage.removeItem('embeleze_partner_id')
    localStorage.removeItem('embeleze_partner_professional_id')
    localStorage.removeItem('embeleze_client_logged_in')
    localStorage.removeItem('embeleze_client_id')
    localStorage.removeItem('embeleze_client_name')
    localStorage.removeItem('embeleze_client_email')
    localStorage.removeItem('embeleze_client_profile')
    localStorage.removeItem('embeleze_client_profile_created')
    localStorage.removeItem('embeleze_admin_logged_in')
    localStorage.removeItem('embeleze_admin_id')
    localStorage.removeItem('embeleze_admin_name')
    localStorage.removeItem('embeleze_admin_email')
    localStorage.removeItem('embeleze_admin_key')
    localStorage.removeItem('embeleze_admin_last_activity')
    setIsProfileOpen(false)
    onNavigate?.('home')
  }

  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-16 py-8 bg-white/40 backdrop-blur-md transition-all">
      
      {/* LOGO */}
      <button
        type="button"
        onClick={() => onNavigate?.('home')}
        className="font-serif text-2xl font-bold tracking-tight text-[#1A1A1A]"
      >
        Embeleze-se
      </button>

      <div className="hidden lg:flex gap-10 text-[10px] uppercase tracking-[0.2em] text-gray-500 font-semibold">
        <button
          type="button"
          onClick={() => onNavigate?.('home')}
          className="hover:text-rose-400 transition-colors"
        >
          Inicio
        </button>
        <button
          type="button"
          onClick={() => onNavigate?.('products')}
          className="hover:text-rose-400 transition-colors"
        >
          Produtos
        </button>
        <button
          type="button"
          onClick={() => onNavigate?.('professionals')}
          className="hover:text-rose-400 transition-colors"
        >
          Profissionais
        </button>
        <button
          type="button"
          onClick={() => onNavigate?.('request')}
          className="hover:text-rose-400 transition-colors"
        >
          Solicitar Serviço
        </button>
        <button
          type="button"
          onClick={() => onNavigate?.('partner-register')}
          className="hover:text-rose-400 transition-colors font-semibold"
        >
          Seja uma Parceira
        </button>
      </div>

      <div className="flex gap-8 items-center text-gray-800 relative">
        <Search 
          size={20} 
          strokeWidth={1.5} 
          className="cursor-pointer hover:text-rose-400 transition-all" 
        />
        <button
          type="button"
          onClick={() => onNavigate?.('cart')}
          className="relative inline-flex items-center justify-center hover:text-rose-400 transition-all"
          aria-label={`Abrir carrinho com ${cartItemsCount} item${cartItemsCount === 1 ? '' : 's'}`}
        >
          <ShoppingBag
            size={20}
            strokeWidth={1.5}
            className="cursor-pointer"
          />
          {cartItemsCount > 0 && (
            <span className="absolute -top-2 -right-2 z-20 min-w-[20px] h-[20px] px-1.5 rounded-full bg-[#C38B94] ring-2 ring-white text-white text-[10px] font-bold leading-[20px] text-center shadow-md">
              {cartItemsCount > 99 ? '99+' : cartItemsCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            if (!isAnyLoggedIn) {
              onNavigate?.('partner-dashboard')
              return
            }
            setIsProfileOpen((prev) => !prev)
          }}
          className={`rounded-xl p-2.5 transition-all ${
            isAnyLoggedIn ? 'bg-[#C38B94] text-white' : 'hover:bg-rose-50 hover:text-rose-400'
          }`}
        >
          <User size={18} strokeWidth={1.8} />
        </button>

        {isAnyLoggedIn && isProfileOpen && (
          <div className="absolute right-0 top-14 w-[260px] bg-white border border-gray-200 rounded-2xl shadow-xl p-5">
            <div className="pb-3 border-b border-gray-100">
              <p className="text-xl text-[#1A1A1A] font-semibold">{isAdminLoggedIn ? adminName : isPartnerLoggedIn ? partnerName : clientName}</p>
              <p className="text-xs text-gray-400">{isAdminLoggedIn ? adminContact : isPartnerLoggedIn ? partnerContact : clientContact}</p>
            </div>

            {isAdminLoggedIn && (
              <button
                type="button"
                onClick={() => {
                  setIsProfileOpen(false)
                  onNavigate?.('admin-panel')
                }}
                className="mt-4 w-full flex items-center gap-3 text-gray-700 hover:text-[#C38B94] transition-colors"
              >
                <LayoutDashboard size={16} />
                Painel Admin
              </button>
            )}

            {isPartnerLoggedIn && (
              <button
                type="button"
                onClick={() => {
                  setIsProfileOpen(false)
                  onNavigate?.('partner-dashboard')
                }}
                className="mt-4 w-full flex items-center gap-3 text-gray-700 hover:text-[#C38B94] transition-colors"
              >
                <LayoutDashboard size={16} />
                Painel da Parceira
              </button>
            )}

            {isClientLoggedIn && (
              <button
                type="button"
                onClick={() => {
                  setIsProfileOpen(false)
                  onNavigate?.('client-area')
                }}
                className="mt-4 w-full flex items-center gap-3 text-gray-700 hover:text-[#C38B94] transition-colors"
              >
                <LayoutDashboard size={16} />
                Minha Área
              </button>
            )}

            <button
              type="button"
              onClick={handleLogout}
              className="mt-4 w-full flex items-center gap-3 text-rose-500 hover:text-rose-600 transition-colors"
            >
              <LogOut size={16} />
              Sair
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}