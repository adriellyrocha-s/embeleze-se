import { Star, ArrowUpRight, MapPin } from 'lucide-react'
import { useEffect, useState } from 'react'
import axios from 'axios'

export function ProfessionalList() {
  const [professionals, setProfessionals] = useState<any[]>([])

  useEffect(() => {
    axios.get('http://localhost:3333/professionals').then(res => setProfessionals(res.data))
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      {professionals.map((pro) => (
        <div key={pro.id} className="relative h-[650px] rounded-[3.5rem] overflow-hidden group shadow-2xl transition-all duration-700 hover:-translate-y-3">
          <img 
            src={pro.user.avatar || "https://images.unsplash.com/photo-1522337363627-5d512968c17a?q=80&w=600"} 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

          {/* Badges Superiores */}
          <div className="absolute top-10 left-10 right-10 flex justify-between items-start">
            <div className="bg-white/90 backdrop-blur-md px-5 py-2 rounded-full flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] text-gray-800 uppercase tracking-widest font-black">Disponível</span>
            </div>
            <div className="bg-[#FF6B00] text-white text-[10px] px-5 py-2 rounded-full font-black uppercase tracking-tighter">
              Entrega Rápida
            </div>
          </div>

          {/* Conteúdo Inferior */}
          <div className="absolute bottom-12 left-12 right-12 text-white">
            <div className="flex items-center gap-2 mb-4 text-yellow-400">
              <Star size={14} fill="currentColor" />
              <span className="font-bold text-sm tracking-widest">{pro.rating?.toFixed(1) || "5.0"}</span>
              <span className="text-gray-400 text-[10px] font-light uppercase ml-1 opacity-60">( 127 avaliações )</span>
            </div>

            <h3 className="font-serif text-5xl mb-2 tracking-tight leading-none group-hover:italic transition-all">
              {pro.user.name}
            </h3>
            <p className="text-gray-300 text-sm font-light mb-10 italic opacity-80">{pro.category}</p>

            <div className="flex justify-between items-end border-t border-white/10 pt-8">
              <div className="space-y-2">
                <div className="flex items-center gap-1 text-gray-400 text-[10px] uppercase tracking-[0.2em]">
                  <MapPin size={12} /> {pro.location}
                </div>
                <div className="text-[10px] text-gray-400 uppercase tracking-widest">
                  A partir de <span className="text-3xl font-light text-white ml-2">R$ {pro.basePrice}</span>
                </div>
              </div>

              <button className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-full hover:bg-white hover:text-black transition-all duration-500 transform group-hover:rotate-45">
                <ArrowUpRight size={32} strokeWidth={1} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}