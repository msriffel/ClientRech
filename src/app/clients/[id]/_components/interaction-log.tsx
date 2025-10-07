'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Interaction, InteractionType } from '@/lib/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Edit2, Trash2 } from 'lucide-react';
import { updateInteractionAction, deleteInteractionAction } from '@/lib/actions';

interface InteractionLogProps {
  clientId: string;
  interactions: Interaction[];
}

const getInteractionTypeColor = (type: InteractionType) => {
  switch (type) {
    case 'Chamada':
      return 'bg-blue-100 text-blue-800';
    case 'Email':
      return 'bg-green-100 text-green-800';
    case 'Reunião':
      return 'bg-purple-100 text-purple-800';
    case 'Outro':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export function InteractionLog({ clientId, interactions }: InteractionLogProps) {
  const [editingInteraction, setEditingInteraction] = useState<Interaction | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleEditInteraction = async (interactionId: string, formData: FormData) => {
    const dateStr = formData.get('date') as string;

    if (dateStr) {
      // 🔒 Interpreta a data como horário local e mantém o mesmo ao salvar
      // Evita que o JS converta automaticamente para UTC
      const [datePart, timePart] = dateStr.split('T');
      const [year, month, day] = datePart.split('-').map(Number);
      const [hour, minute] = timePart.split(':').map(Number);

      // Cria uma data em horário local, sem ajuste de fuso
      const localDate = new Date(year, month - 1, day, hour, minute);

      // Salva em formato ISO, mas sem alterar o horário
      const isoLocal = localDate.toISOString().slice(0, 16);

      formData.set('date', isoLocal);
    }

    await updateInteractionAction(interactionId, formData);
    setEditingInteraction(null);
  };


  const handleDeleteInteraction = async (interactionId: string) => {
    setIsDeleting(interactionId);
    await deleteInteractionAction(interactionId, clientId);
    setIsDeleting(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Interações</CardTitle>
      </CardHeader>
      <CardContent>
        {interactions.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Nenhuma interação registrada</p>
        ) : (
          <div className="space-y-4">
            {interactions.map((interaction) => (
              <div key={interaction.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className={getInteractionTypeColor(interaction.type)}>
                        {interaction.type}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {format(new Date(interaction.date), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{interaction.notes}</p>
                  </div>

                  <div className="flex space-x-2 ml-4">
                    <Dialog
                      open={editingInteraction?.id === interaction.id}
                      onOpenChange={(open) => !open && setEditingInteraction(null)}
                    >
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingInteraction(interaction)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Editar Interação</DialogTitle>
                        </DialogHeader>
                        <form
                          action={(formData) => handleEditInteraction(interaction.id, formData)}
                          className="space-y-4"
                        >
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="type">Tipo de Interação</Label>
                              <Select name="type" defaultValue={interaction.type}>
                                <SelectTrigger>
                                  <SelectValue />
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
                              <Label htmlFor="date">Data e Hora</Label>
                              <Input
                                id="date"
                                name="date"
                                type="datetime-local"
                                // ✅ mostra o horário local correto
                                defaultValue={format(new Date(interaction.date), "yyyy-MM-dd'T'HH:mm")}
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="notes">Notas</Label>
                            <Textarea
                              id="notes"
                              name="notes"
                              defaultValue={interaction.notes}
                              rows={4}
                            />
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setEditingInteraction(null)}
                            >
                              Cancelar
                            </Button>
                            <Button type="submit">Salvar</Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir esta interação?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteInteraction(interaction.id)}
                            disabled={isDeleting === interaction.id}
                          >
                            {isDeleting === interaction.id ? 'Excluindo...' : 'Excluir'}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
