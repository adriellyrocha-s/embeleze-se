import { ProfessionalList } from './components/ProfessionalList'

function App() {
  return (
    <div className="min-h-screen bg-[#FDF8F8]">
      <header className="p-10 text-center">
        <h1 className="font-serif text-4xl text-rose-600">Embeleze-se</h1>
      </header>

      <main className="max-w-4xl mx-auto">
        <ProfessionalList />
      </main>
    </div>
  )
}

export default App