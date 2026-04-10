import { ArrowLeft, MapPin, Navigation, ChevronDown, Calendar, Clock, CreditCard, Lock, Search } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useState } from 'react';

// Corrigindo o ícone do Leaflet
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import type { LeafletMouseEvent } from 'leaflet';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

type ReverseGeocodeResponse = {
  display_name?: string;
  address?: {
    road?: string;
    house_number?: string;
    suburb?: string;
    city?: string;
    town?: string;
    village?: string;
    state?: string;
  };
};

function formatAddress(data: ReverseGeocodeResponse) {
  const a = data.address;
  if (!a) return data.display_name ?? '';
  const city = a.city || a.town || a.village;
  const street = [a.road, a.house_number].filter(Boolean).join(', ');
  return [street, a.suburb, city, a.state].filter(Boolean).join(' - ') || data.display_name || '';
}

export function ServiceRequestPage({ onBack, onGoToClientArea }: { onBack: () => void; onGoToClientArea: () => void }) {
  const [position, setPosition] = useState<[number, number]>([-23.5505, -46.6333]); // São Paulo
  const [address, setAddress] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [addressConfirmed, setAddressConfirmed] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  async function reverseGeocode(lat: number, lng: number) {
    setIsLoadingAddress(true);
    setLocationError('');
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=pt-BR`,
        { headers: { Accept: 'application/json' } }
      );
      const data = (await response.json()) as ReverseGeocodeResponse;
      setAddress(formatAddress(data));
    } catch {
      setLocationError('Não foi possível obter o endereço automaticamente.');
    } finally {
      setIsLoadingAddress(false);
    }
  }

  function updateLocation(lat: number, lng: number) {
    setPosition([lat, lng]);
    setAddressConfirmed(false); // Reseta confirmação ao mudar local
    void reverseGeocode(lat, lng);
  }

  function locateUser() {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (coords) => {
        updateLocation(coords.coords.latitude, coords.coords.longitude);
        setIsLocating(false);
      },
      () => setIsLocating(false),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  function LocationMarker() {
    useMapEvents({
      click(e: LeafletMouseEvent) {
        updateLocation(e.latlng.lat, e.latlng.lng);
      },
    });
    return <Marker position={position} />;
  }

  if (requestSubmitted) {
    return (
      <div className="min-h-screen bg-[#FDF8F8] pt-32 pb-20">
        <div className="max-w-[800px] mx-auto px-6">
          <div className="min-h-[65vh] flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-full bg-rose-50 flex items-center justify-center mb-8">
              <Search size={34} className="text-[#C38B94]" />
            </div>

            <h2 className="font-serif text-5xl text-[#1A1A1A] tracking-tight mb-5">
              Procurando profissionais...
            </h2>

            <p className="text-gray-500 text-2xl max-w-xl leading-relaxed mb-8">
              Sua solicitação foi publicada. Profissionais da sua região serão notificadas e poderão aceitar seu pedido.
            </p>

            <p className="text-[#C38B94] text-xl mb-8 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#C38B94] animate-pulse" />
              Aguardando respostas de profissionais
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onGoToClientArea}
                className="px-8 py-3 rounded-full bg-[#C38B94] text-white hover:bg-[#A87080] transition-colors"
              >
                Ver minha área
              </button>
              <button
                type="button"
                onClick={onBack}
                className="px-8 py-3 rounded-full border border-gray-200 text-gray-600 hover:border-[#C38B94] hover:text-[#C38B94] transition-colors"
              >
                Voltar ao Início
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF8F8] pt-32 pb-20">
      <div className="max-w-[800px] mx-auto px-6">
        
        <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-[#C38B94] transition-colors mb-12 text-sm group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Voltar
        </button>

        <header className="mb-12">
          <span className="text-[#C38B94] uppercase tracking-[0.4em] text-[10px] font-bold block mb-4">Solicitação de Serviço</span>
          <h1 className="font-serif text-6xl text-[#1A1A1A] tracking-tighter mb-6">Encontre uma profissional</h1>
          <p className="text-gray-500 font-light leading-relaxed max-w-2xl">
            Marque sua localização no mapa e informe o serviço desejado. As profissionais da sua região irão ver sua solicitação.
          </p>
        </header>

        {/* ETAPA 1: LOCALIZAÇÃO */}
        <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center gap-4 mb-8">
            <span className="w-8 h-8 rounded-full bg-rose-50 text-[#C38B94] flex items-center justify-center text-xs font-bold">1</span>
            <div className="flex items-center gap-2 text-gray-400 uppercase tracking-widest text-[10px] font-bold">
              <MapPin size={14} /> SUA LOCALIZAÇÃO
            </div>
          </div>

          <div className="rounded-3xl overflow-hidden h-[350px] relative border border-gray-100 mb-4">
            <MapContainer key={`${position[0]}-${position[1]}`} center={position} zoom={15} style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <LocationMarker />
            </MapContainer>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] bg-white/90 backdrop-blur-md px-6 py-2 rounded-full text-[10px] text-gray-500 shadow-xl">
              Toque no mapa para marcar sua localização
            </div>
          </div>

          <button
            type="button"
            onClick={locateUser}
            className="w-full py-4 flex items-center justify-center gap-2 text-gray-500 text-xs hover:bg-gray-50 rounded-2xl transition-colors border border-dashed border-gray-200 mb-6"
          >
            <Navigation size={14} className={isLocating ? "animate-spin" : "text-[#C38B94]"} />
            {isLocating ? 'Localizando...' : 'Usar minha localização atual'}
          </button>

          {/* CARD DE CONFIRMAÇÃO (image_7a5f24.png) */}
          {(address || isLoadingAddress) && (
            <div className="p-6 bg-[#FDF8F8] rounded-[2rem] border border-rose-100/50 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="flex items-center gap-2 text-[#C38B94] text-[10px] uppercase font-bold mb-3">
                <MapPin size={12} /> Local selecionado
              </div>
              <div className="mb-6 px-2">
                <label className="block text-[11px] uppercase tracking-wider text-gray-400 mb-2">
                  Endereço
                </label>
                <input
                  type="text"
                  value={isLoadingAddress ? 'Buscando endereço...' : address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    setAddressConfirmed(false);
                  }}
                  disabled={isLoadingAddress}
                  placeholder="Edite o endereço se o mapa localizar errado"
                  className="w-full bg-white border border-rose-100 py-3 px-4 rounded-2xl text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[#C38B94]/10 focus:border-[#C38B94] disabled:opacity-60"
                />
                <p className="text-[11px] text-gray-400 mt-2">
                  Se o local estiver incorreto, ajuste manualmente antes de confirmar.
                </p>
              </div>
              <button 
                onClick={() => setAddressConfirmed(true)}
                disabled={!address.trim() || isLoadingAddress}
                className={`w-full py-4 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
                  addressConfirmed ? "bg-green-500 text-white" : "bg-[#C38B94]/80 text-white hover:bg-[#C38B94] shadow-rose-100"
                }`}
              >
                <MapPin size={14} />
                {addressConfirmed ? 'Endereço Confirmado' : 'Confirmar este endereço'}
              </button>
            </div>
          )}
        </div>

        {/* ETAPA 2 e 3 (Mantidas conforme código anterior) */}
        <div className={`transition-opacity duration-500 ${!addressConfirmed ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100 mb-8">
              <div className="flex items-center gap-4 mb-8">
                <span className="w-8 h-8 rounded-full bg-rose-50 text-[#C38B94] flex items-center justify-center text-xs font-bold">2</span>
                <div className="flex items-center gap-2 text-gray-400 uppercase tracking-widest text-[10px] font-bold">SERVIÇO DESEJADO</div>
              </div>
              <div className="space-y-6">
                <div className="relative">
                    <select className="w-full bg-gray-50/50 border border-gray-100 py-4 px-6 rounded-2xl text-sm appearance-none focus:ring-2 focus:ring-[#C38B94]/10 focus:border-[#C38B94] outline-none">
                      <option>Selecione o tipo de serviço</option>
                      <option>Manicure</option>
                      <option>Cabelo</option>
                    </select>
                    <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </div>
                <textarea placeholder="Ex: Manicure com esmaltação em gel..." className="w-full bg-gray-50/50 border border-gray-100 py-4 px-6 rounded-3xl text-sm min-h-[120px] outline-none resize-none focus:ring-2 focus:ring-[#C38B94]/10" />
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100 mb-12">
              <div className="flex items-center gap-4 mb-8">
                <span className="w-8 h-8 rounded-full bg-rose-50 text-[#C38B94] flex items-center justify-center text-xs font-bold">3</span>
                <div className="flex items-center gap-2 text-gray-400 uppercase tracking-widest text-[10px] font-bold"><Clock size={14} /> DATA E PAGAMENTO</div>
              </div>
              <div className="grid grid-cols-2 gap-6 mb-6">
                <input type="date" className="w-full bg-gray-50/50 border border-gray-100 py-4 px-6 rounded-2xl text-sm outline-none" />
                <input type="time" className="w-full bg-gray-50/50 border border-gray-100 py-4 px-6 rounded-2xl text-sm outline-none" />
              </div>
              <div className="pt-6 border-t border-gray-50 space-y-4">
                <div className="relative">
                  <select className="w-full bg-gray-50/50 border border-gray-100 py-4 px-6 rounded-2xl text-sm appearance-none outline-none">
                    <option>Forma de pagamento</option>
                    <option>Cartão de Crédito</option>
                    <option>Pix</option>
                  </select>
                  <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </div>
              </div>
            </div>

            <div className="text-center space-y-4">
              <button
                type="button"
                onClick={() => setRequestSubmitted(true)}
                className="w-full bg-[#C38B94] text-white py-6 rounded-full font-bold flex items-center justify-center gap-3 shadow-lg hover:brightness-95 transition-all"
              >
                <Search size={20} /> Procurar Profissionais na Região
              </button>
            </div>
        </div>
      </div>
    </div>
  );
}