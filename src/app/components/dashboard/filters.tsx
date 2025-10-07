'use client';

import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

interface FiltersProps {
  searchTerm: string;
  statusFilter: string;
  contactFilter: 'all' | 'overdue' | 'upcoming';
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onContactFilterChange: (value: 'all' | 'overdue' | 'upcoming') => void;
}

export function Filters({
  searchTerm,
  statusFilter,
  contactFilter,
  onSearchChange,
  onStatusChange,
  onContactFilterChange,
}: FiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1 flex-wrap">

      {/* Botões de filtro de contatos */}
      <div className="flex gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => onContactFilterChange('all')}
          className={`px-3 py-1 rounded font-medium text-sm ${contactFilter === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
        >
          Todos
        </button>
        <button
          type="button"
          onClick={() => onContactFilterChange('overdue')}
          className={`px-3 py-1 rounded font-medium text-sm ${contactFilter === 'overdue' ? 'bg-red-500 text-white' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
        >
          Contatos Atrasados
        </button>
        <button
          type="button"
          onClick={() => onContactFilterChange('upcoming')}
          className={`px-3 py-1 rounded font-medium text-sm ${contactFilter === 'upcoming' ? 'bg-green-500 text-white' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
        >
          Próximos Contatos
        </button>
      </div>

      {/* Campo de busca */}
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Buscar empresas..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 w-full"
        />
      </div>

      {/* Select de status */}
      <Select value={statusFilter} onValueChange={onStatusChange}>
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue placeholder="Filtrar por status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os status</SelectItem>
          <SelectItem value="Prospect Frio">Prospect Frio</SelectItem>
          <SelectItem value="Prospect Morno">Prospect Morno</SelectItem>
          <SelectItem value="Prospect Quente">Prospect Quente</SelectItem>
          <SelectItem value="Cliente Ativo">Cliente Ativo</SelectItem>
          <SelectItem value="Cliente Fiel">Cliente Fiel</SelectItem>
          <SelectItem value="Cliente Inativo">Cliente Inativo</SelectItem>
        </SelectContent>
      </Select>

    </div>
  );
}
