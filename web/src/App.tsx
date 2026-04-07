import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { CategorySection } from './components/CategorySection'
import { ProfessionalList } from './components/ProfessionalList'
import { HowItWorks } from './components/HowItWorks'
import { ProductGrid } from './components/ProductGrid'
import { Footer } from './components/Footer'

export default function App() {
  return (
    <div className="min-h-screen bg-[#FDF8F8] antialiased">
      <Navbar />

      <main>
        <Hero />
        <CategorySection />

        {/* Seção Parceiras em Destaque */}
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
            
            <button className="group flex items-center gap-3 text-[#C38B94] text-sm font-bold tracking-widest uppercase hover:opacity-70 transition-all pb-2">
              Ver todas 
              <span className="text-3xl transition-transform group-hover:translate-x-2">→</span>
            </button>
          </div>

          <ProfessionalList />
        </section>

        <HowItWorks />
        <ProductGrid />
      </main>

      <Footer />
    </div>
  )
}