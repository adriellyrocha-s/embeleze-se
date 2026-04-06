import { useEffect, useState } from 'react'
import axios from 'axios'
import React from 'react';

// Definindo o que esperar da API (TypeScript)
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

  useEffect(() => {
    // Buscando os dados da sua API Node
    axios.get('http://localhost:3333/professionals')
      .then(response => {
        setProfessionals(response.data)
      })
  }, [])

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      {professionals.map(pro => (
        <div key={pro.id} className="border rounded-xl p-4 shadow-sm bg-white">
          <div className="flex items-center gap-4">
            {/* Círculo da foto (como no seu design) */}
            <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden">
               {pro.user.avatar ? <img src={pro.user.avatar} alt={pro.user.name} /> : <div className="w-full h-full bg-rose-100" />}
            </div>
            
            <div>
              <h3 className="font-serif text-lg font-bold">{pro.user.name}</h3>
              <p className="text-sm text-gray-500">{pro.category} • {pro.location}</p>
              <div className="flex items-center text-yellow-500 text-sm">
                ⭐ {pro.rating}
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <span className="text-rose-600 font-bold">R$ {pro.basePrice}</span>
            <button className="bg-rose-500 text-white px-4 py-2 rounded-lg text-sm">
              Ver Agenda
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}