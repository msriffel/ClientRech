import { ClientStatus, AISuggestion } from '../../lib/types';

// Simulação simples de IA para demonstração
export const suggestClientStatus = async (input: { interactionLogs: string }): Promise<AISuggestion> => {
  // Simular delay de processamento
  await new Promise(resolve => setTimeout(resolve, 1000));

  const { interactionLogs } = input;
  
  // Análise simples baseada em palavras-chave
  const logs = interactionLogs.toLowerCase();
  
  // Contar indicadores de engajamento
  const positiveWords = ['satisfeito', 'interessado', 'positivo', 'bom', 'ótimo', 'excelente', 'recomendo'];
  const negativeWords = ['problema', 'insatisfeito', 'negativo', 'ruim', 'péssimo', 'cancelar'];
  const activeWords = ['contrato', 'fechado', 'assinado', 'pago', 'ativo'];
  const coldWords = ['não responde', 'sem retorno', 'silêncio', 'inativo'];
  
  const positiveCount = positiveWords.filter(word => logs.includes(word)).length;
  const negativeCount = negativeWords.filter(word => logs.includes(word)).length;
  const activeCount = activeWords.filter(word => logs.includes(word)).length;
  const coldCount = coldWords.filter(word => logs.includes(word)).length;
  
  // Lógica de decisão simples
  if (activeCount > 0) {
    return {
      suggestedStatus: 'Cliente Ativo',
      reason: 'Baseado nas interações, o cliente demonstra atividade comercial com contratos ou pagamentos.'
    };
  }
  
  if (coldCount > 0 || negativeCount > positiveCount) {
    return {
      suggestedStatus: 'Cliente Inativo',
      reason: 'O histórico indica baixo engajamento ou problemas na comunicação.'
    };
  }
  
  if (positiveCount >= 3) {
    return {
      suggestedStatus: 'Prospect Quente',
      reason: 'Múltiplas indicações positivas sugerem alto interesse e probabilidade de conversão.'
    };
  }
  
  if (positiveCount >= 1) {
    return {
      suggestedStatus: 'Prospect Morno',
      reason: 'Algumas indicações positivas, mas ainda precisa de mais engajamento.'
    };
  }
  
  return {
    suggestedStatus: 'Prospect Frio',
    reason: 'Poucas interações ou indicadores de engajamento. Recomenda-se mais follow-up.'
  };
};
