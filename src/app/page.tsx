'use client';

import { useState, useEffect } from 'react';
import { Header } from './components/header';
import { StatsCards } from './components/dashboard/stats-cards';
import { ClientCard } from './components/dashboard/client-card';
import { Filters } from './components/dashboard/filters';
import { Client, ClientStats } from '@/lib/types';
import { fetchClients, fetchClientStats } from '@/lib/actions';

export default function Dashboard() {
  const [clients, setClients] = useState<Client[]>([]);
  const [stats, setStats] = useState<ClientStats>({
    totalClients: 0,
    overdueContacts: 0,
    upcomingContacts: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [clientsData, statsDataFromApi] = await Promise.all([
          fetchClients(),
          fetchClientStats()
        ]);

        setClients(clientsData);

        // Ajusta os nomes para o StatsCards
        setStats({
          totalClients: statsDataFromApi.total ?? 0,
          overdueContacts: statsDataFromApi.active ?? 0,
          upcomingContacts: statsDataFromApi.inactive ?? 0
        });

      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-gray-600">Carregando...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Gerencie seus clientes e acompanhe suas interações</p>
        </div>

        <StatsCards stats={stats} />

        <div className="mt-8">
          <Filters
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            onSearchChange={setSearchTerm}
            onStatusChange={setStatusFilter}
          />

          {filteredClients.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Nenhum cliente encontrado com os filtros aplicados.' 
                  : 'Nenhum cliente cadastrado ainda.'}
              </div>
              {!searchTerm && statusFilter === 'all' && (
                <div className="mt-4">
                  <a 
                    href="/clients/new" 
                    className="text-primary hover:text-primary/80 font-medium"
                  >
                    Cadastrar primeiro cliente
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredClients.map((client) => (
                <ClientCard key={client.id} client={client} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
