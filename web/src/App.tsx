import { ProfessionalList } from './components/ProfessionalList'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'

function App() {
  return (
    <div className="min-h-screen bg-[#FDF8F8]">
      <Navbar />
      <Hero />
      <header className="p-10 text-center">
        
      </header>

      <main className="max-w-4xl mx-auto">
        <ProfessionalList />
      </main>
    </div>
  )
}

export default App