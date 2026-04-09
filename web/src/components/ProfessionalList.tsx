import { Star, ArrowUpRight, MapPin } from 'lucide-react'
import { useEffect, useState } from 'react'
import { api } from '../lib/api'

export type ProfessionalCard = {
  id: string
  name: string
  avatar: string
  category: string
  rating: number
  location: string
  basePrice: string
  bio: string
}

const fallbackProfessionals: ProfessionalCard[] = [
  {
    id: 'fallback-1',
    name: 'Camila Oliveira',
    avatar: 'https://images.unsplash.com/photo-1522337363627-5d512968c17a?q=80&w=600',
    category: 'Maquiadora',
    rating: 5.0,
    location: 'Moema',
    basePrice: '80,00',
    bio: 'Especialista em maquiagem social e noivas com atendimento personalizado em domicilio.',
  },
  {
    id: 'fallback-2',
    name: 'Ana Carolina Silva',
    avatar: 'https://images.unsplash.com/photo-1604902396830-aca29e19b067?q=80&w=600',
    category: 'Manicure',
    rating: 4.9,
    location: 'Vila Mariana',
    basePrice: '45,00',
    bio: 'Atendimento focado em acabamento premium e cuidados completos para maos e pes.',
  },
  {
    id: 'fallback-3',
    name: 'Bianca Souza',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=600',
    category: 'Cabeleireiro',
    rating: 4.8,
    location: 'Pinheiros',
    basePrice: '65,00',
    bio: 'Profissional de cabelo com foco em cortes modernos, coloracao e tratamentos.',
  },
  {
    id: 'fallback-4',
    name: 'Larissa Mendes',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=600',
    category: 'Pedicure',
    rating: 4.9,
    location: 'Santana',
    basePrice: '55,00',
    bio: 'Especialista em pedicure terapeutica, spa dos pes e acabamento de alta durabilidade.',
  },
  {
    id: 'fallback-5',
    name: 'Renata Prado',
    avatar: 'https://images.unsplash.com/photo-1559599101-f09722fb4948?q=80&w=600',
    category: 'Designer de Sobrancelhas',
    rating: 4.7,
    location: 'Tatuape',
    basePrice: '50,00',
    bio: 'Design personalizado com henna e visagismo para valorizar cada formato de rosto.',
  },
  {
    id: 'fallback-6',
    name: 'Patricia Ramos',
    avatar: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=600',
    category: 'Depiladora',
    rating: 4.8,
    location: 'Vila Madalena',
    basePrice: '60,00',
    bio: 'Atendimento em depilacao com cera e tecnica para peles sensiveis com conforto.',
  },
  {
    id: 'fallback-7',
    name: 'Fernanda Costa',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600',
    category: 'Massagista',
    rating: 4.9,
    location: 'Aclimacao',
    basePrice: '95,00',
    bio: 'Massagens relaxante e modeladora com foco em bem-estar e alivio de tensoes.',
  },
  {
    id: 'fallback-8',
    name: 'Juliana Nogueira',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600',
    category: 'Esteticista',
    rating: 4.8,
    location: 'Saude',
    basePrice: '110,00',
    bio: 'Protocolos faciais e corporais com foco em limpeza de pele, glow e rejuvenescimento.',
  },
]

function formatMoney(value: unknown) {
  const numeric = Number(value)
  if (Number.isNaN(numeric)) return '0,00'
  return numeric.toFixed(2).replace('.', ',')
}

function normalizeProfessional(pro: any): ProfessionalCard {
  return {
    id: String(pro?.id ?? Math.random()),
    name: pro?.user?.name ?? pro?.name ?? 'Profissional Embeleze-se',
    avatar: pro?.user?.avatar || pro?.avatar || 'https://images.unsplash.com/photo-1522337363627-5d512968c17a?q=80&w=600',
    category: pro?.category ?? 'Beleza',
    rating: Number(pro?.rating ?? 5),
    location: pro?.location ?? 'Sao Paulo',
    basePrice: formatMoney(pro?.basePrice),
    bio: pro?.bio ?? 'Profissional verificada na plataforma Embeleze-se.',
  }
}

type ProfessionalListProps = {
  onSelectProfessional?: (professional: ProfessionalCard) => void
  selectedCategory?: string
}

export function ProfessionalList({ onSelectProfessional, selectedCategory = 'Todas' }: ProfessionalListProps) {
  const [professionals, setProfessionals] = useState<ProfessionalCard[]>(fallbackProfessionals)
  const [loading, setLoading] = useState(true)

  const visibleProfessionals =
    selectedCategory === 'Todas'
      ? professionals
      : professionals.filter((pro) => pro.category.toLowerCase() === selectedCategory.toLowerCase())

  useEffect(() => {
    let mounted = true

    async function loadProfessionals() {
      try {
        setLoading(true)

        const res = await api.get('/professionals')
        if (!mounted) return

        const apiList = Array.isArray(res.data) ? res.data.map(normalizeProfessional) : []
        setProfessionals(apiList.length > 0 ? apiList : fallbackProfessionals)
      } catch {
        if (!mounted) return
        setProfessionals(fallbackProfessionals)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    void loadProfessionals()
    return () => {
      mounted = false
    }
  }, [])

  if (loading && professionals.length === 0) {
    return <p className="text-gray-500">Carregando profissionais...</p>
  }

  if (!loading && visibleProfessionals.length === 0) {
    return <p className="text-gray-500">Nenhuma profissional encontrada para essa categoria.</p>
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      {visibleProfessionals.map((pro) => (
        <article
          key={pro.id}
          className="relative h-[650px] rounded-[3.5rem] overflow-hidden group shadow-2xl transition-all duration-700 hover:-translate-y-3"
        >
          <button
            type="button"
            onClick={() => onSelectProfessional?.(pro)}
            className="absolute inset-0 z-10"
            aria-label={`Ver detalhes de ${pro.name}`}
          />
          <img 
            src={pro.avatar} 
            onError={(event) => {
              event.currentTarget.src = 'https://images.unsplash.com/photo-1522337363627-5d512968c17a?q=80&w=600'
            }}
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
              <span className="font-bold text-sm tracking-widest">{pro.rating?.toFixed(1) || '5.0'}</span>
              <span className="text-gray-400 text-[10px] font-light uppercase ml-1 opacity-60">( 127 avaliações )</span>
            </div>

            <h3 className="font-serif text-5xl mb-2 tracking-tight leading-none group-hover:italic transition-all">
              {pro.name}
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

              <button
                type="button"
                onClick={() => onSelectProfessional?.(pro)}
                className="relative z-20 bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-full hover:bg-white hover:text-black transition-all duration-500 transform group-hover:rotate-45"
              >
                <ArrowUpRight size={32} strokeWidth={1} />
              </button>
            </div>
          </div>
        </article>
      ))}
      </div>
    </div>
  )
}