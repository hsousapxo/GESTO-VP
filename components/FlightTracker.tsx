import React, { useState, useEffect, useRef } from 'react';
import { Plane, Search, Navigation, Clock, Activity, Loader2 } from 'lucide-react';

// Access Leaflet from global scope since we loaded it via CDN in index.html
declare global {
    interface Window {
        L: any;
    }
}

interface FlightData {
    departure: { code: string; name: string };
    arrival: { code: string; name: string };
    latitude: number;
    longitude: number;
    altitude: number;
    speed: number;
    status: string;
    timeRemaining: string;
}

const FlightTracker: React.FC = () => {
    const [flightNumber, setFlightNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [flightData, setFlightData] = useState<FlightData | null>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);
    const markerRef = useRef<any>(null);
    const intervalRef = useRef<number | null>(null);

    // Initialize Map
    useEffect(() => {
        if (mapContainerRef.current && !mapInstanceRef.current && window.L) {
            // Default center (Atlantic/Portugal)
            mapInstanceRef.current = window.L.map(mapContainerRef.current).setView([33.07, -16.34], 6);
            
            // Satellite Layer (Esri World Imagery)
            window.L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            }).addTo(mapInstanceRef.current);

            // Optional: Add labels overlay (Stamen Toner Lite or similar could be used, but keeping it simple satellite for now)
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []);

    // Handle Map Updates when data changes
    useEffect(() => {
        if (flightData && mapInstanceRef.current && window.L) {
            const { latitude, longitude } = flightData;
            
            // Custom Plane Icon
            const planeIcon = window.L.divIcon({
                html: '<div style="font-size: 32px; transform: rotate(-45deg); filter: drop-shadow(0 0 5px rgba(0,0,0,0.5));">✈️</div>',
                className: 'plane-icon',
                iconSize: [40, 40],
                iconAnchor: [20, 20],
                popupAnchor: [0, -20]
            });

            const popupContent = `
                <div style="text-align: center; min-width: 150px;">
                    <div style="font-weight: bold; font-size: 14px; margin-bottom: 4px; color: #1a365d;">
                        ${flightData.departure.code} <span style="color: #666;">➔</span> ${flightData.arrival.code}
                    </div>
                    <div style="font-size: 12px; color: #444;">
                        <b>Alt:</b> ${Math.round(flightData.altitude)} ft<br/>
                        <b>Vel:</b> ${Math.round(flightData.speed)} km/h
                    </div>
                    <div style="font-size: 11px; color: #666; margin-top: 4px;">
                        ${flightData.status}
                    </div>
                </div>
            `;

            if (markerRef.current) {
                markerRef.current.setLatLng([latitude, longitude]);
                // Update popup content dynamically if open
                if (markerRef.current.getPopup()) {
                    markerRef.current.setPopupContent(popupContent);
                }
            } else {
                markerRef.current = window.L.marker([latitude, longitude], { icon: planeIcon })
                    .addTo(mapInstanceRef.current)
                    .bindPopup(popupContent);
                
                // Open popup automatically on first load
                markerRef.current.openPopup();
            }
            
            mapInstanceRef.current.setView([latitude, longitude], 7);
        }
    }, [flightData]);

    const simulateFlightData = (code: string) => {
        const mock: FlightData = {
            departure: { code: 'LIS', name: 'Lisboa Humberto Delgado' },
            arrival: { code: 'PXO', name: 'Porto Santo' },
            latitude: 36.5 + (Math.random() - 0.5),
            longitude: -12.0 + (Math.random() - 0.5),
            altitude: 28000 + Math.random() * 1000,
            speed: 750 + Math.random() * 50,
            status: 'Em Cruzeiro',
            timeRemaining: '45 min'
        };
        
        setFlightData(mock);
        setLoading(false);

        // Simulate live movement
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = window.setInterval(() => {
            setFlightData(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    latitude: prev.latitude + (Math.random() - 0.5) * 0.05,
                    longitude: prev.longitude - 0.05, // Moving west roughly
                    altitude: prev.altitude + (Math.random() - 0.5) * 50,
                    speed: prev.speed + (Math.random() - 0.5) * 5
                };
            });
        }, 3000);
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!flightNumber.trim()) return;

        setLoading(true);
        setError('');
        setFlightData(null);
        if (markerRef.current) {
            markerRef.current.remove();
            markerRef.current = null;
        }

        try {
            // NOTE: Integration with AviationStack API would go here.
            // Using simulation for demo purposes as per request context.
            // const response = await fetch(`https://api.aviationstack.com/v1/flights?access_key=YOUR_API_KEY&flight_iata=${flightNumber}`);
            
            setTimeout(() => {
                simulateFlightData(flightNumber);
            }, 1500);

        } catch (err) {
            setError("Erro ao buscar voo.");
            setLoading(false);
        }
    };

    return (
        <div className="p-6 h-full flex flex-col">
            <div className="max-w-6xl mx-auto w-full flex flex-col h-full">
                
                {/* Header Section */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6 transition-colors">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-primary dark:text-blue-400 flex items-center gap-2">
                                <Plane className="w-7 h-7" />
                                Radar de Voos
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                                Rastreamento em tempo real (AviationStack / Simulação)
                            </p>
                        </div>
                        
                        <form onSubmit={handleSearch} className="flex w-full md:w-auto gap-2">
                            <input 
                                type="text" 
                                value={flightNumber}
                                onChange={(e) => setFlightNumber(e.target.value.toUpperCase())}
                                placeholder="N.º Voo (ex: TP1699)"
                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                            <button 
                                type="submit"
                                disabled={loading}
                                className="bg-primary dark:bg-blue-600 hover:bg-secondary dark:hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-70"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                                Rastrear
                            </button>
                        </form>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-4 rounded-xl mb-6 border border-red-200 dark:border-red-800 text-center">
                        {error}
                    </div>
                )}

                {/* Content Area */}
                <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
                    
                    {/* Map */}
                    <div className="lg:flex-[2] bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden relative min-h-[400px]">
                        <div ref={mapContainerRef} className="absolute inset-0 z-0" />
                        {!flightData && !loading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-50/80 dark:bg-gray-900/80 z-10">
                                <div className="text-center text-gray-400">
                                    <Navigation className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                    <p>Mapa aguardando dados de voo...</p>
                                </div>
                            </div>
                        )}
                        {/* Legend for Satellite */}
                        {flightData && (
                            <div className="absolute bottom-2 right-2 z-[400] bg-white/80 dark:bg-black/50 px-2 py-1 text-[10px] rounded text-black dark:text-white">
                                Satélite (Esri)
                            </div>
                        )}
                    </div>

                    {/* Info Panel */}
                    <div className="lg:flex-1 flex flex-col gap-4">
                        {flightData ? (
                            <>
                                {/* Route Card */}
                                <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Rota de Voo</h3>
                                    <div className="flex justify-between items-center relative">
                                        <div className="text-center z-10">
                                            <div className="text-3xl font-bold text-primary dark:text-blue-400">{flightData.departure.code}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-[100px] truncate">{flightData.departure.name}</div>
                                        </div>
                                        
                                        <div className="flex-1 border-t-2 border-dashed border-gray-300 dark:border-gray-600 absolute top-1/2 left-0 right-0 -translate-y-1/2 mx-12"></div>
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 p-1 rounded-full z-10">
                                            <Plane className="w-5 h-5 text-accent dark:text-blue-300 transform rotate-90" />
                                        </div>

                                        <div className="text-center z-10">
                                            <div className="text-3xl font-bold text-primary dark:text-blue-400">{flightData.arrival.code}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-[100px] truncate">{flightData.arrival.name}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-2 gap-4">
                                    <StatCard 
                                        label="Altitude" 
                                        value={`${Math.round(flightData.altitude)} ft`} 
                                        icon={<Activity className="w-4 h-4" />}
                                    />
                                    <StatCard 
                                        label="Velocidade" 
                                        value={`${Math.round(flightData.speed)} km/h`} 
                                        icon={<Navigation className="w-4 h-4" />}
                                    />
                                    <StatCard 
                                        label="Status" 
                                        value={flightData.status} 
                                        icon={<Activity className="w-4 h-4" />}
                                        highlight
                                    />
                                    <StatCard 
                                        label="Restante" 
                                        value={flightData.timeRemaining} 
                                        icon={<Clock className="w-4 h-4" />}
                                    />
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center text-center transition-colors">
                                <Search className="w-16 h-16 text-gray-200 dark:text-gray-700 mb-4" />
                                <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300">Sem dados</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                                    Pesquise um número de voo para ver os detalhes em tempo real.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard: React.FC<{ label: string; value: string; icon: React.ReactNode; highlight?: boolean }> = ({ label, value, icon, highlight }) => (
    <div className={`p-4 rounded-xl border ${highlight ? 'bg-primary dark:bg-blue-900/30 border-primary/20 dark:border-blue-500/30' : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700'} shadow-sm transition-colors`}>
        <div className="flex items-center gap-2 mb-2">
            <span className={highlight ? 'text-primary dark:text-blue-300' : 'text-gray-400'}>{icon}</span>
            <span className={`text-xs uppercase font-bold tracking-wider ${highlight ? 'text-primary/70 dark:text-blue-300/70' : 'text-gray-400'}`}>{label}</span>
        </div>
        <div className={`text-lg font-bold ${highlight ? 'text-primary dark:text-blue-300' : 'text-gray-800 dark:text-gray-100'}`}>
            {value}
        </div>
    </div>
);

export default FlightTracker;