'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { Contact } from '@/lib/types';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import {
  createContact,
  updateContactAction,
  deleteContactAction,
} from '@/lib/actions';

interface ContactsCardProps {
  clientId: string;
  contacts: Contact[];
}

export function ContactsCard({ clientId, contacts }: ContactsCardProps) {
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleAddContact = async (formData: FormData) => {
    await createContact(clientId, formData);
    setIsAddingContact(false);
  };

  const handleEditContact = async (contactId: string, formData: FormData) => {
    await updateContactAction(clientId, contactId, formData);
    setEditingContact(null);
  };

  const handleDeleteContact = async (contactId: string) => {
    setIsDeleting(contactId);
    await deleteContactAction(clientId, contactId); // agora aceita 2 argumentos
    setIsDeleting(null);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Contatos</CardTitle>
          <Dialog open={isAddingContact} onOpenChange={setIsAddingContact}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Adicionar Contato
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Novo Contato</DialogTitle>
              </DialogHeader>
              <form action={handleAddContact} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome *</Label>
                    <Input id="name" name="name" required />
                  </div>
                  <div>
                    <Label htmlFor="role">Cargo *</Label>
                    <Input id="role" name="role" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" name="email" type="email" required />
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <Input id="phone" name="phone" />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddingContact(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">Adicionar</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {contacts.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            Nenhum contato cadastrado
          </p>
        ) : (
          <div className="space-y-4">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium">{contact.name}</h4>
                    <span className="text-sm text-gray-500">
                      ({contact.role})
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{contact.email}</p>
                  {contact.phone && (
                    <p className="text-sm text-gray-600">{contact.phone}</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Dialog
                    open={editingContact?.id === contact.id}
                    onOpenChange={(open) => !open && setEditingContact(null)}
                  >
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingContact(contact)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Editar Contato</DialogTitle>
                      </DialogHeader>
                      <form
                        action={(formData) =>
                          handleEditContact(contact.id, formData)
                        }
                        className="space-y-4"
                      >
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="name">Nome *</Label>
                            <Input
                              id="name"
                              name="name"
                              defaultValue={contact.name}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="role">Cargo *</Label>
                            <Input
                              id="role"
                              name="role"
                              defaultValue={contact.role}
                              required
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="email">Email *</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              defaultValue={contact.email}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="phone">Telefone</Label>
                            <Input
                              id="phone"
                              name="phone"
                              defaultValue={contact.phone || ''}
                            />
                          </div>
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setEditingContact(null)}
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
                          Tem certeza que deseja excluir o contato "
                          {contact.name}"?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteContact(contact.id)}
                          disabled={isDeleting === contact.id}
                        >
                          {isDeleting === contact.id
                            ? 'Excluindo...'
                            : 'Excluir'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
