import { NextRequest, NextResponse } from 'next/server';
import { suggestClientStatus } from '@/ai/flows/suggest-client-status';

export async function POST(request: NextRequest) {
  try {
    const { interactionLogs } = await request.json();

    if (!interactionLogs) {
      return NextResponse.json(
        { error: 'interactionLogs é obrigatório' },
        { status: 400 }
      );
    }

    // Simular chamada para o flow de IA
    // Em produção, você usaria o Genkit real
    const suggestion = await suggestClientStatus({ interactionLogs });

    return NextResponse.json(suggestion);
  } catch (error) {
    console.error('Erro na API de sugestão de status:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
