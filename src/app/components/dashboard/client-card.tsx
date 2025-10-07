'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Client } from '@/lib/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AlertTriangle } from 'lucide-react';

interface ClientCardProps {
  client: Client;
  upcomingDays?: number;
}

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'Prospect Frio': return 'status-prospect-frio';
    case 'Prospect Morno': return 'status-prospect-morno';
    case 'Prospect Quente': return 'status-prospect-quente';
    case 'Cliente Ativo': return 'status-cliente-ativo';
    case 'Cliente Fiel': return 'status-cliente-fiel';
    case 'Cliente Inativo': return 'status-cliente-inativo';
    default: return 'status-prospect-frio';
  }
};

export function ClientCard({ client, upcomingDays = 15 }: ClientCardProps) {
  const now = new Date();
  const nextContactDateObj = client.nextContactDate ? new Date(client.nextContactDate) : null;
  const isOverdue = nextContactDateObj ? nextContactDateObj < now : false;

  let isUpcoming = false;
  if (nextContactDateObj) {
    const diffDays = (nextContactDateObj.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    isUpcoming = diffDays >= 0 && diffDays <= upcomingDays;
  }

  const nextContactDate = nextContactDateObj
    ? format(nextContactDateObj, 'dd/MM/yyyy HH:mm', { locale: ptBR })
    : 'Não definido';

  return (
    <Link href={`/clients/${client.id}`}>
      <Card className={`client-card ${isOverdue ? 'overdue' : ''} cursor-pointer`}>
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={client.logoUrl} alt={client.companyName} />
              <AvatarFallback>
                {client.companyName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {client.companyName}
                </h3>
                {isOverdue && (
                  <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0" />
                )}
              </div>

              <div className="mt-2 flex items-center space-x-2">
                <Badge className={getStatusBadgeVariant(client.status)}>
                  {client.status}
                </Badge>
                {isUpcoming && !isOverdue && (
                  <Badge className="bg-green-500 text-white text-xs">
                    Próximo Contato
                  </Badge>
                )}
              </div>

              <div className="mt-3 text-sm text-gray-600">
                <p>Próximo contato: {nextContactDate}</p>
                {client.website && <p className="truncate">{client.website}</p>}
              </div>

              <div className="mt-2 text-xs text-gray-500">
                {client.contacts.length} contato{client.contacts.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
