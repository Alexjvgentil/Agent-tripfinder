import React from 'react';
import { SearchIcon } from './icons';

interface InputFormProps {
  destination: string;
  setDestination: (value: string) => void;
  duration: string;
  setDuration: (value: string) => void;
  departure: string;
  setDeparture: (value: string) => void;
  radius: string;
  setRadius: (value: string) => void;
  departureStartDate: string;
  setDepartureStartDate: (value: string) => void;
  departureEndDate: string;
  setDepartureEndDate: (value: string) => void;
  onSearch: () => void;
  isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ 
  destination, setDestination, 
  duration, setDuration, 
  departure, setDeparture, 
  radius, setRadius, 
  departureStartDate, setDepartureStartDate,
  departureEndDate, setDepartureEndDate,
  onSearch, 
  isLoading 
}) => {
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };
  
  const today = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="departure" className="block text-sm font-medium text-slate-700 mb-1">
                De onde você vai sair?
                </label>
                <input
                id="departure"
                type="text"
                value={departure}
                onChange={(e) => setDeparture(e.target.value)}
                placeholder="Ex: São Paulo, Brasil"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200"
                disabled={isLoading}
                />
            </div>
            <div>
                <label htmlFor="destination" className="block text-sm font-medium text-slate-700 mb-1">
                Para onde você quer ir?
                </label>
                <input
                id="destination"
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Ex: Paris, França"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200"
                disabled={isLoading}
                />
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-end">
            <div className="md:col-span-2">
                <label htmlFor="departure-start-date" className="block text-sm font-medium text-slate-700 mb-1">
                    Partida a partir de
                </label>
                <input
                    id="departure-start-date"
                    type="date"
                    value={departureStartDate}
                    onChange={(e) => setDepartureStartDate(e.target.value)}
                    min={today}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200"
                    disabled={isLoading}
                />
            </div>
             <div className="md:col-span-2">
                <label htmlFor="departure-end-date" className="block text-sm font-medium text-slate-700 mb-1">
                    Partida até
                </label>
                <input
                    id="departure-end-date"
                    type="date"
                    value={departureEndDate}
                    onChange={(e) => setDepartureEndDate(e.target.value)}
                    min={departureStartDate || today}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200"
                    disabled={isLoading}
                />
            </div>
            <div className="md:col-span-1">
                <label htmlFor="duration" className="block text-sm font-medium text-slate-700 mb-1">
                    Duração
                </label>
                <input
                id="duration"
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Dias"
                min="1"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200"
                disabled={isLoading}
                />
            </div>
            <div className="md:col-span-1">
                <label htmlFor="radius" className="block text-sm font-medium text-slate-700 mb-1">
                    Raio (km)
                </label>
                <input
                id="radius"
                type="number"
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
                placeholder="Opc."
                min="0"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200"
                disabled={isLoading}
                />
            </div>
            <button
                type="submit"
                disabled={isLoading || !destination || !duration || !departure || !departureStartDate || !departureEndDate}
                className="md:col-span-1 w-full flex items-center justify-center px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors duration-200"
            >
                <SearchIcon className="w-5 h-5 md:mr-2" />
                <span className="hidden md:inline">{isLoading ? 'Buscando...' : 'Buscar'}</span>
            </button>
        </div>
    </form>
  );
};