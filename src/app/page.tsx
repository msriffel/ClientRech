'use client';

import { useState, useEffect } from 'react';
import { Header } from './components/header';
import { StatsCards } from './components/dashboard/stats-cards';
import { ClientCard } from './components/dashboard/client-card';
import { Filters } from './components/dashboard/filters';
import { Client, ClientStats } from '@/lib/types';
import { fetchClients } from '@/lib/actions';
import { Card, CardContent } from '@/components/ui/card';

export default function Dashboard() {
  const [clients, setClients] = useState<Client[]>([]);
  const [stats, setStats] = useState<ClientStats>({ totalClients: 0, overdueContacts: 0, upcomingContacts: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [contactFilter, setContactFilter] = useState<'all' | 'overdue' | 'upcoming'>('all');
  const [upcomingDays, setUpcomingDays] = useState(10);
  const [loading, setLoading] = useState(true);

  // Carrega clientes
  useEffect(() => {
    const loadData = async () => {
      try {
        const clientsData = await fetchClients();
        setClients(clientsData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Calcula stats ignorando clientes inativos
  useEffect(() => {
    const now = new Date();
    let overdue = 0, upcoming = 0;

    clients.forEach(client => {
      if (client.status === 'Cliente Inativo') return; // ignora
      if (client.nextContactDate) {
        const next = new Date(client.nextContactDate);
        if (next < now) overdue++;
        else if ((next.getTime() - now.getTime()) / (1000 * 60 * 60 * 24) <= upcomingDays) upcoming++;
      }
    });

    setStats({ totalClients: clients.length, overdueContacts: overdue, upcomingContacts: upcoming });
  }, [clients, upcomingDays]);

  // Filtra e ordena clientes
  const filteredClients = clients
    .filter(client => {
      const matchesSearch = client.companyName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || client.status === statusFilter;

      const now = new Date();
      let matchesContact = true;
      if (contactFilter === 'overdue') {
        matchesContact = client.status === 'Cliente Inativo' ? false : (client.nextContactDate ? new Date(client.nextContactDate) < now : false);
      } else if (contactFilter === 'upcoming') {
        matchesContact = client.status === 'Cliente Inativo' ? false : (client.nextContactDate
          ? (new Date(client.nextContactDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24) <= upcomingDays
          : false);
      }

      return matchesSearch && matchesStatus && matchesContact;
    })
    .sort((a, b) => {
      // Clientes inativos sempre por último
      if (a.status === 'Cliente Inativo' && b.status !== 'Cliente Inativo') return 1;
      if (b.status === 'Cliente Inativo' && a.status !== 'Cliente Inativo') return -1;

      // Ativos/prospects: ordena pelo próximo contato
      const now = new Date();
      const aNext = a.nextContactDate ? new Date(a.nextContactDate).getTime() : Infinity;
      const bNext = b.nextContactDate ? new Date(b.nextContactDate).getTime() : Infinity;
      return aNext - bNext;
    });

  const handleClientUpdate = (clientId: string, updated: { nextContactDate: string }) => {
    setClients(prev =>
      prev.map(c => c.id === clientId ? { ...c, nextContactDate: updated.nextContactDate } : c)
    );
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8 flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Carregando...</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Gerencie seus clientes e acompanhe suas interações</p>
        </div>

        <StatsCards stats={stats} />

        <div className="mb-8 mt-2">
          <Card>
            <CardContent className="flex flex-col sm:flex-row sm:items-center gap-4 flex-wrap justify-between mt-4">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-700 font-medium">Próximos contatos em:</label>
                <input
                  type="number"
                  className="border rounded px-2 py-1 w-14 focus:outline-none focus:ring-2 focus:ring-primary"
                  value={upcomingDays}
                  onChange={(e) => setUpcomingDays(Number(e.target.value))}
                  min={1}
                />
                <span className="text-sm text-gray-500">dias</span>
              </div>

              <Filters
                searchTerm={searchTerm}
                statusFilter={statusFilter}
                contactFilter={contactFilter}
                onSearchChange={setSearchTerm}
                onStatusChange={setStatusFilter}
                onContactFilterChange={setContactFilter}
              />
            </CardContent>
          </Card>
        </div>

        {filteredClients.length === 0 ? (
          <div className="text-center py-12 text-gray-500 text-lg">
            {searchTerm || statusFilter !== 'all' || contactFilter !== 'all'
              ? 'Nenhum cliente encontrado com os filtros aplicados.'
              : 'Nenhum cliente cadastrado ainda.'}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredClients.map(client => (
              <ClientCard key={client.id} client={client} upcomingDays={upcomingDays} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
