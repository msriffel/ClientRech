'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { InteractionType, AISuggestion } from '@/lib/types';
import { createInteraction, updateClient } from '@/lib/actions';
import { Brain } from 'lucide-react';

interface AddInteractionProps {
  clientId: string;
  interactionLogs: string;
}

export function AddInteraction({ clientId, interactionLogs }: AddInteractionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<AISuggestion | null>(null);
  const [showAIDialog, setShowAIDialog] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      await createInteraction(formData);
    } catch (error) {
      console.error('Erro ao criar interação:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAISuggestion = async () => {
    if (!interactionLogs || interactionLogs.trim() === '') {
      console.warn('Não há interações para analisar.');
      setAiSuggestion({
        suggestedStatus: 'Prospect Frio',
        reason: 'Cliente sem histórico de interações'
      });
      setShowAIDialog(true);
      return;
    }

    setIsSuggesting(true);
    try {
      const response = await fetch('/api/ai/suggest-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ interactionLogs }),
      });

      if (response.ok) {
        const suggestion = await response.json();
        setAiSuggestion(suggestion);
        setShowAIDialog(true);
      } else {
        console.error('Falha ao obter sugestão de IA:', response.statusText);
      }
    } catch (error) {
      console.error('Erro ao obter sugestão de IA:', error);
    } finally {
      setIsSuggesting(false);
    }
  };


  const handleAcceptSuggestion = async () => {
    if (aiSuggestion) {
      try {
        // Atualiza o status do cliente no Supabase
        await updateClient(clientId, { status: aiSuggestion.suggestedStatus });
        console.log('Status atualizado:', aiSuggestion.suggestedStatus);
      } catch (error) {
        console.error('Erro ao atualizar status do cliente:', error);
      } finally {
        setShowAIDialog(false);
        setAiSuggestion(null);
      }
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Registrar Interação</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-4">
            <input type="hidden" name="client_id" value={clientId} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Tipo de Interação *</Label>
                <Select name="type" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Chamada">Chamada</SelectItem>
                    <SelectItem value="Email">Email</SelectItem>
                    <SelectItem value="Reunião">Reunião</SelectItem>
                    <SelectItem value="Outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="nextContactDate">Próximo Contato *</Label>
                <Input
                  id="nextContactDate"
                  name="nextContactDate"
                  type="datetime-local"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Notas da Interação *</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Descreva o que foi discutido, acordado ou observado..."
                required
                rows={4}
              />
            </div>

            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={handleAISuggestion}
                disabled={isSuggesting}
              >
                <Brain className="w-4 h-4 mr-2" />
                {isSuggesting ? 'Analisando...' : 'Sugerir Status (IA)'}
              </Button>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Registrando...' : 'Registrar Interação'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <AlertDialog open={showAIDialog} onOpenChange={setShowAIDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sugestão de Status</AlertDialogTitle>
            <AlertDialogDescription>
              {aiSuggestion ? (
                <span className="space-y-4 block">
                  <span>
                    <strong>Status Sugerido:</strong>
                    <span className="ml-2 px-2 py-1 bg-primary text-primary-foreground rounded text-sm">
                      {aiSuggestion.suggestedStatus}
                    </span>
                  </span>
                  <span>
                    <strong>Motivo:</strong>
                    <span className="mt-1 text-sm block">{aiSuggestion.reason}</span>
                  </span>
                </span>
              ) : (
                'Carregando sugestão...'
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleAcceptSuggestion}>
              Aceitar Sugestão
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
