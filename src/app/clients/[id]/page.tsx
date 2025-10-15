import { notFound } from 'next/navigation';
import { fetchClientById, fetchInteractionsByClientId } from '@/lib/actions';
import { ClientDetails } from './_components/client-details';
import { ContactsCard } from './_components/contacts-card';
import { AddInteraction } from './_components/add-interaction';
import { InteractionLog } from './_components/interaction-log';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface ClientPageProps {
  params: {
    id: string;
  };
}

export default async function ClientPage({ params }: ClientPageProps) {
  const [client, interactions] = await Promise.all([
    fetchClientById(params.id),
    fetchInteractionsByClientId(params.id)
  ]);

  if (!client) {
    notFound();
  }

  // Cria string com histórico de interações para a IA
  const interactionLogs = interactions
    .map(interaction =>
      `${interaction.type} em ${new Date(interaction.date).toLocaleDateString('pt-BR')}: ${interaction.notes}`
    )
    .join('\n');

  const isInactive = client.status === 'Cliente Inativo';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Dashboard
            </Link>
          </Button>

          <h1 className="text-3xl font-bold text-gray-900">{client.companyName}</h1>
          <p className="text-gray-600 mt-2">
            Gerencie os detalhes e interações desta empresa
          </p>

          {/* 🔴 Alerta de cliente inativo */}
          {isInactive && (
            <div className="mt-4 rounded-lg border border-red-400 bg-red-100 px-4 py-3 text-red-700">
              ⚠️ Este cliente está <strong>inativo</strong>. Os lembretes e próximos contatos estão desativados.
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna 1: Detalhes do Cliente, Contatos e Nova Interação */}
          <div className="space-y-6">
            <ClientDetails client={client} />
            <ContactsCard clientId={client.id} contacts={client.contacts} />
            {!isInactive && (
              <AddInteraction clientId={client.id} interactionLogs={interactionLogs} />
            )}
          </div>

          {/* Coluna 2: Histórico de Interações */}
          <div className="lg:col-span-2">
            <InteractionLog clientId={client.id} interactions={interactions} />
          </div>
        </div>
      </div>
    </div>
  );
}