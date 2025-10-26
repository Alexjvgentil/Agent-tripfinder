import { GoogleGenAI } from "@google/genai";
import type { FlightInfo, WebSource } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

// Helper to find and parse JSON from a string that might contain markdown
const extractJson = (text: string): any | null => {
    // Look for JSON inside markdown ```json ... ``` or a raw JSON array/object
    const match = text.match(/```json\s*([\s\S]*?)\s*```|(\[[\s\S]*\]|\{[\s\S]*\})/);
    if (match) {
        try {
            // Use the first non-null capturing group
            return JSON.parse(match[1] || match[2]);
        } catch (e) {
            console.error("Failed to parse extracted JSON:", e);
            return null;
        }
    }
    try {
        return JSON.parse(text);
    } catch(e) {
        console.error("Failed to parse raw text as JSON", e);
        return null;
    }
}


export const generateFlightOptions = async (
    destination: string, 
    durationInDays: number, 
    departure: string, 
    radius: number,
    departureStartDate: string,
    departureEndDate: string
): Promise<{ flightInfo: FlightInfo | null, sources: WebSource[] }> => {
  try {
    const systemInstruction = `Você é um assistente especialista em busca de voos. Sua tarefa é analisar os critérios do usuário e retornar um resumo conciso da sua pesquisa exclusivamente em formato JSON. Não forneça nenhuma conversa, explicação ou texto introdutório. Sua resposta deve ser apenas o objeto JSON solicitado.`;

    const prompt = `Sua tarefa é agir como um especialista em buscas de voos. Analise as melhores opções para uma viagem de ${durationInDays} dias, saindo de "${departure}" para "${destination}", com a data de partida entre ${departureStartDate} e ${departureEndDate}.

Use a Pesquisa Google para:
1. Analisar a faixa de preços (mínimo e máximo) para a viagem completa (ida e volta).
2. Identificar o dia mais vantajoso para a partida dentro da janela de datas fornecida.
3. Listar as principais companhias aéreas que operam essa rota.
4. Escrever um breve resumo com dicas ou observações sobre a busca (ex: "Voos no meio da semana costumam ser mais baratos.").
5. Construir uma URL para a página de resultados da busca em um grande agregador de voos (como Google Voos, Kayak, Skyscanner) que o usuário possa usar para ver as opções em tempo real. A URL deve conter os parâmetros da busca.

${radius > 0 ? `Considere aeroportos alternativos em um raio de ${radius}km de "${departure}".` : ''}

Formate sua resposta como um único objeto JSON com as seguintes chaves: "priceRange", "bestDayToFly", "flightSummary", "airlinesFound", "searchLink", "sourceWebsite".
- "priceRange": uma string descrevendo o preço (ex: "R$ 2.800 - R$ 4.500").
- "bestDayToFly": a data de partida mais barata encontrada no formato AAAA-MM-DD.
- "flightSummary": uma string com o resumo da sua análise.
- "airlinesFound": um array de strings com os nomes das companhias aéreas (ex: ["Latam", "Azul", "Gol"]).
- "searchLink": a URL completa para a página de resultados da busca.
- "sourceWebsite": o nome do site onde a busca foi baseada (ex: "Google Voos").

Exemplo de formato:
{
  "priceRange": "R$ 3.200 - R$ 5.100",
  "bestDayToFly": "2024-11-12",
  "flightSummary": "Os preços são mais baixos para voos durante a semana, especialmente às terças-feiras. Voos diretos estão disponíveis, mas opções com uma parada podem ser mais econômicas.",
  "airlinesFound": ["Air France", "KLM", "Latam"],
  "searchLink": "https://www.google.com/travel/flights?q=Flights%20from%20GRU%20to%20CDG%20on%202024-11-12%20through%202024-11-19",
  "sourceWebsite": "Google Voos"
}

Retorne APENAS o objeto JSON. Se não encontrar informações suficientes, retorne null.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        tools: [{googleSearch: {}}],
      },
    });

    const flightData = extractJson(response.text.trim());
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.filter(c => c.web) || [];

    const isValidFlightInfo = flightData && typeof flightData === 'object' && !Array.isArray(flightData) && flightData.searchLink;

    return {
        flightInfo: isValidFlightInfo ? flightData as FlightInfo : null,
        sources: sources,
    };

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Não foi possível gerar opções de voo.");
  }
};
