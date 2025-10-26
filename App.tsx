import React, { useState, useCallback } from 'react';
import type { FlightInfo, WebSource } from './types';
import { generateFlightOptions } from './services/geminiService';
import { InputForm } from './components/InputForm';
import { FlightInfoDisplay } from './components/FlightCard';
import { LoadingSpinner } from './components/LoadingSpinner';
import { PlaneIcon } from './components/icons';

const App: React.FC = () => {
  const [destination, setDestination] = useState<string>('');
  const [duration, setDuration] = useState<string>('7');
  const [departure, setDeparture] = useState<string>('');
  const [radius, setRadius] = useState<string>('');
  const [departureStartDate, setDepartureStartDate] = useState<string>('');
  const [departureEndDate, setDepartureEndDate] = useState<string>('');
  const [flightInfo, setFlightInfo] = useState<FlightInfo | null>(null);
  const [sources, setSources] = useState<WebSource[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState<boolean>(false);

  const handleSearch = useCallback(async () => {
    if (!destination || !duration || !departure || !departureStartDate || !departureEndDate) {
      setError('Por favor, preencha todos os campos para a busca.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setFlightInfo(null);
    setSources([]);
    setSearched(true);

    try {
      const results = await generateFlightOptions(
        destination, 
        parseInt(duration, 10), 
        departure, 
        parseInt(radius, 10) || 0,
        departureStartDate,
        departureEndDate
      );
      setFlightInfo(results.flightInfo);
      setSources(results.sources);
    } catch (err) {
      console.error(err);
      setError('Ocorreu um erro ao buscar os voos. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, [destination, duration, departure, radius, departureStartDate, departureEndDate]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center p-8">
          <LoadingSpinner />
          <p className="mt-4 text-slate-600">Analisando o mercado de voos para você...</p>
        </div>
      );
    }

    if (error) {
      return <p className="text-center text-red-500 p-8">{error}</p>;
    }
    
    if (searched && !flightInfo) {
        return <p className="text-center text-slate-600 p-8">Nenhuma informação encontrada. Tente uma nova busca com critérios diferentes.</p>;
    }

    if (searched && flightInfo) {
      return (
        <>
          <FlightInfoDisplay info={flightInfo} />

          {sources.length > 0 && (
            <div className="mt-10 pt-6 border-t border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Fontes da Pesquisa</h3>
              <ul className="space-y-2">
                {sources.map((source, index) => (
                  <li key={index} className="bg-white p-3 rounded-lg shadow-sm">
                    <a href={source.web.uri} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline hover:text-blue-800 transition-colors">
                      {source.web.title || source.web.uri}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      );
    }
    
    return null;
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <main className="w-full max-w-5xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <PlaneIcon className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900">Agente de Viagens IA</h1>
          </div>
          <p className="text-lg text-slate-600">Sua análise inteligente das melhores ofertas de voos.</p>
        </header>

        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 sticky top-4 z-10">
          <InputForm
            destination={destination}
            setDestination={setDestination}
            duration={duration}
            setDuration={setDuration}
            departure={departure}
            setDeparture={setDeparture}
            radius={radius}
            setRadius={setRadius}
            departureStartDate={departureStartDate}
            setDepartureStartDate={setDepartureStartDate}
            departureEndDate={departureEndDate}
            setDepartureEndDate={setDepartureEndDate}
            onSearch={handleSearch}
            isLoading={isLoading}
          />
        </div>
        
        <div className="mt-10">
            {renderContent()}
        </div>
      </main>
      <footer className="text-center text-sm text-slate-500 mt-12 pb-4">
        <p>A análise de voos é gerada usando a Pesquisa Google para fins de demonstração.</p>
        <p>&copy; {new Date().getFullYear()} Agente de Viagens IA. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default App;
