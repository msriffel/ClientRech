'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Client } from '@/lib/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Edit2, Trash2, Save, X } from 'lucide-react';
import { updateClientAction, deleteClientAction } from '@/lib/actions';

interface ClientDetailsProps {
  client: Client;
}

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'Prospect Frio':
      return 'status-prospect-frio';
    case 'Prospect Morno':
      return 'status-prospect-morno';
    case 'Prospect Quente':
      return 'status-prospect-quente';
    case 'Cliente Ativo':
      return 'status-cliente-ativo';
    case 'Cliente Fiel':
      return 'status-cliente-fiel';
    case 'Cliente Inativo':
      return 'status-cliente-inativo';
    default:
      return 'status-prospect-frio';
  }
};

export function ClientDetails({ client }: ClientDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    companyName: client.companyName,
    website: client.website || '',
    phone: client.phone || '',
    logoUrl: client.logoUrl,
    status: client.status,
    nextContactDate: format(new Date(client.nextContactDate), "yyyy-MM-dd'T'HH:mm")
  });

  const handleSave = async () => {
    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      form.append(key, value);
    });
    
    await updateClientAction(client.id, form);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteClientAction(client.id);
  };

  const handleCancel = () => {
    setFormData({
      companyName: client.companyName,
      website: client.website || '',
      phone: client.phone || '',
      logoUrl: client.logoUrl,
      status: client.status,
      nextContactDate: format(new Date(client.nextContactDate), "yyyy-MM-dd'T'HH:mm")
    });
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Detalhes da Empresa</CardTitle>
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <Button size="sm" onClick={handleSave}>
                  <Save className="w-4 h-4 mr-1" />
                  Salvar
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancel}>
                  <X className="w-4 h-4 mr-1" />
                  Cancelar
                </Button>
              </>
            ) : (
              <>
                <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                  <Edit2 className="w-4 h-4 mr-1" />
                  Editar
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="destructive">
                      <Trash2 className="w-4 h-4 mr-1" />
                      Excluir
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja excluir a empresa "{client.companyName}"? 
                        Esta ação não pode ser desfeita e todos os dados relacionados serão perdidos.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                        {isDeleting ? 'Excluindo...' : 'Excluir'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-start space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={client.logoUrl} alt={client.companyName} />
            <AvatarFallback className="text-lg">
              {client.companyName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-4">
            <div>
              <Label htmlFor="companyName">Nome da Empresa</Label>
              {isEditing ? (
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                />
              ) : (
                <p className="text-lg font-semibold">{client.companyName}</p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Badge className={getStatusBadgeVariant(client.status)}>
                {client.status}
              </Badge>
              {isEditing && (
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as any })}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Prospect Frio">Prospect Frio</SelectItem>
                    <SelectItem value="Prospect Morno">Prospect Morno</SelectItem>
                    <SelectItem value="Prospect Quente">Prospect Quente</SelectItem>
                    <SelectItem value="Cliente Ativo">Cliente Ativo</SelectItem>
                    <SelectItem value="Cliente Fiel">Cliente Fiel</SelectItem>
                    <SelectItem value="Cliente Inativo">Cliente Inativo</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="website">Website</Label>
            {isEditing ? (
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://exemplo.com"
              />
            ) : (
              <p className="text-sm text-gray-600">
                {client.website ? (
                  <a href={client.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    {client.website}
                  </a>
                ) : (
                  'Não informado'
                )}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="phone">Telefone</Label>
            {isEditing ? (
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+55 11 99999-9999"
              />
            ) : (
              <p className="text-sm text-gray-600">{client.phone || 'Não informado'}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="logoUrl">URL do Logo</Label>
            {isEditing ? (
              <Input
                id="logoUrl"
                value={formData.logoUrl}
                onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                placeholder="https://exemplo.com/logo.png"
              />
            ) : (
              <p className="text-sm text-gray-600 break-all">{client.logoUrl}</p>
            )}
          </div>

          <div>
            <Label htmlFor="nextContactDate">Próximo Contato</Label>
            {isEditing ? (
              <Input
                id="nextContactDate"
                type="datetime-local"
                value={formData.nextContactDate}
                onChange={(e) => setFormData({ ...formData, nextContactDate: e.target.value })}
              />
            ) : (
              <p className="text-sm text-gray-600">
                {format(new Date(client.nextContactDate), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
          <div>
            <Label>Último Contato</Label>
            <p className="text-sm text-gray-600">
              {format(new Date(client.lastContactDate), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
            </p>
          </div>

          <div>
            <Label>Cliente Desde</Label>
            <p className="text-sm text-gray-600">
              {format(new Date(client.createdAt), 'dd/MM/yyyy', { locale: ptBR })}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
