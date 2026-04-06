import { useEffect, useState } from 'react'
import axios from 'axios'

interface Professional {
  id: string
  category: string
  basePrice: number
  rating: number
  location: string
  user: {
    name: string
    avatar: string | null
  }
}

export function ProfessionalList() {
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Busca os dados REAIS da sua API
    axios.get('http://localhost:3333/professionals')
      .then(response => {
        setProfessionals(response.data)
        setLoading(false)
      })
      .catch(err => {
        console.error("Erro ao conectar com a API:", err)
        setLoading(false)
      })
  }, [])

  if (loading) return <div className="text-center py-10 font-serif">Buscando profissionais...</div>

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-12 py-10">
      {professionals.length > 0 ? (
        professionals.map(pro => (
          <div key={pro.id} className="relative h-[480px] rounded-[2.5rem] overflow-hidden group shadow-2xl bg-gray-200">
            {/* Foto Real do Banco ou Placeholder se não tiver */}
            <img 
              src={pro.user.avatar || "https://images.unsplash.com/photo-1522337363627-5d512968c17a?q=80&w=500"} 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

            <div className="absolute bottom-8 left-8 right-8 text-white">
              <div className="flex items-center gap-1 text-yellow-400 text-sm mb-2 font-bold">
                ⭐ {pro.rating.toFixed(1)}
              </div>
              <h3 className="font-serif text-3xl mb-1">{pro.user.name}</h3>
              <p className="text-gray-300 text-sm font-light italic">{pro.category} • {pro.location}</p>
              
              <div className="mt-6 flex justify-between items-center">
                <span className="text-sm font-light">A partir de <b className="text-xl">R$ {pro.basePrice}</b></span>
                <button className="bg-white/20 backdrop-blur-md border border-white/30 px-6 py-2 rounded-full text-xs hover:bg-white hover:text-black transition-all">
                  Ver Agenda
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="col-span-full text-center py-20 text-gray-400 font-serif italic text-xl">
          Nenhuma profissional cadastrada no momento. ✨
        </div>
      )}
    </div>
  )
}