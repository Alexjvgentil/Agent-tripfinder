import React from 'react';
import type { FlightInfo } from '../types';
import { ArrowRightIcon, CalendarIcon, CurrencyIcon } from './icons';

interface FlightInfoDisplayProps {
  info: FlightInfo;
}

export const FlightInfoDisplay: React.FC<FlightInfoDisplayProps> = ({ info }) => {

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Não disponível';
    try {
      const [year, month, day] = dateString.split('-');
      if(day && month && year) {
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        return new Intl.DateTimeFormat('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(date);
      }
      return dateString;
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300">
      <div className="p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-6">Resumo da sua Viagem</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="flex items-center mb-2">
              <CurrencyIcon className="w-6 h-6 mr-3 text-blue-600" />
              <h4 className="font-semibold text-slate-700">Faixa de Preço</h4>
            </div>
            <p className="text-2xl font-bold text-slate-900">{info.priceRange || 'Não disponível'}</p>
            <p className="text-sm text-slate-500">Estimativa para ida e volta.</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="flex items-center mb-2">
              <CalendarIcon className="w-6 h-6 mr-3 text-green-600" />
              <h4 className="font-semibold text-slate-700">Melhor Dia para Partir</h4>
            </div>
            <p className="text-xl font-bold text-slate-900">{formatDate(info.bestDayToFly)}</p>
            <p className="text-sm text-slate-500">Dentro da janela de busca.</p>
          </div>
        </div>

        <div className="mb-6">
            <h4 className="font-semibold text-slate-700 mb-2">Análise do Agente IA</h4>
            <p className="text-slate-600 bg-blue-50/50 border-l-4 border-blue-200 p-4 rounded-r-lg">{info.flightSummary || 'Não foi possível gerar um resumo.'}</p>
        </div>

        {info.airlinesFound && info.airlinesFound.length > 0 && (
          <div className="mb-8">
            <h4 className="font-semibold text-slate-700 mb-3">Companhias Aéreas Encontradas</h4>
            <div className="flex flex-wrap gap-2">
              {info.airlinesFound.map((airline, index) => (
                <span key={index} className="bg-slate-200 text-slate-800 text-sm font-medium px-3 py-1 rounded-full">{airline}</span>
              ))}
            </div>
          </div>
        )}

        <div className="text-center border-t border-slate-200 pt-6">
           <a
              href={info.searchLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
            >
              Ver Ofertas em Tempo Real em {info.sourceWebsite || '...'}
              <ArrowRightIcon className="w-5 h-5 ml-3" />
            </a>
            <p className="text-xs text-slate-500 mt-3">Você será redirecionado para {info.sourceWebsite} para ver os resultados ao vivo.</p>
        </div>
      </div>
    </div>
  );
};
