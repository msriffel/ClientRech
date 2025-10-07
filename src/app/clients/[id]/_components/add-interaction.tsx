'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { AISuggestion } from '@/lib/types';
import { createInteraction, updateClient } from '@/lib/actions';
import { Brain } from 'lucide-react';

interface AddInteractionProps {
  clientId: string;
  interactionLogs: string;
  onClientUpdate?: (updatedClient: { nextContactDate: string }) => void;
}

export function AddInteraction({ clientId, interactionLogs, onClientUpdate }: AddInteractionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<AISuggestion | null>(null);
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      // 1️⃣ Criar interação
      await createInteraction(formData);

      // 2️⃣ Atualizar nextContactDate do cliente
      let nextContactDate = formData.get('nextContactDate') as string;

      // Salva exatamente o valor informado no formulário, sem ajuste de fuso
      if (nextContactDate) {
        nextContactDate = nextContactDate.toString();
      }


      await updateClient(clientId, { nextContactDate });


      // 3️⃣ Atualizar estado local da página
      if (onClientUpdate) onClientUpdate({ nextContactDate });

      // 4️⃣ Mostrar mensagem de sucesso
      setSuccessMessage('Interação registrada com sucesso!');

      // 5️⃣ Limpar formulário
      if (formRef.current) formRef.current.reset();

      // Limpar mensagem após 3 segundos
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Erro ao criar interação:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAISuggestion = async () => {
    if (!interactionLogs || interactionLogs.trim() === '') {
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
        headers: { 'Content-Type': 'application/json' },
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
        await updateClient(clientId, { status: aiSuggestion.suggestedStatus });
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
          {successMessage && (
            <div className="mb-4 p-2 bg-green-100 text-green-800 rounded text-sm">
              {successMessage}
            </div>
          )}

          <form
            ref={formRef}
            onSubmit={(e) => {
              e.preventDefault();
              const data = new FormData(e.currentTarget);
              handleSubmit(data);
            }}
            className="space-y-6"
          >
            <input type="hidden" name="client_id" value={clientId} />

            <div className="flex flex-col md:flex-row md:space-x-4 gap-4">
              <div className="flex-1">
                <Label htmlFor="type">Tipo de Interação *</Label>
                <Select name="type" required>
                  <SelectTrigger className="w-full">
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

              <div className="flex-1">
                <Label htmlFor="nextContactDate">Próximo Contato *</Label>
                <Input
                  id="nextContactDate"
                  name="nextContactDate"
                  type="datetime-local"
                  required
                  className="w-full"
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

            <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
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
                <div className="space-y-2">
                  <p>
                    <strong>Status Sugerido:</strong>
                    <span className="ml-2 px-2 py-1 bg-primary text-primary-foreground rounded text-sm">
                      {aiSuggestion.suggestedStatus}
                    </span>
                  </p>
                  <p>
                    <strong>Motivo:</strong> {aiSuggestion.reason}
                  </p>
                </div>
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
