'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClientStats } from '@/lib/types';
import { Users, Clock, Calendar } from 'lucide-react';

interface StatsCardsProps {
  stats: ClientStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Total de Clientes */}
      <Card className="h-16">
        <CardContent className="flex items-center justify-between px-3 py-2">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Total de Clientes</span>
          </div>
          <span className="text-lg font-bold">{stats.totalClients}</span>
        </CardContent>
      </Card>

      {/* Contatos Atrasados */}
      <Card className="h-16">
        <CardContent className="flex items-center justify-between px-3 py-2">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-destructive" />
            <span className="text-sm font-medium">Contatos Atrasados</span>
          </div>
          <span className="text-lg font-bold text-destructive">{stats.overdueContacts}</span>
        </CardContent>
      </Card>

      {/* Próximos Contatos */}
      <Card className="h-16">
        <CardContent className="flex items-center justify-between px-3 py-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Próximos Contatos</span>
          </div>
          <span className="text-lg font-bold">{stats.upcomingContacts}</span>
        </CardContent>
      </Card>
    </div>
  );
}
