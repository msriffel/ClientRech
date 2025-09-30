'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

interface FiltersProps {
  searchTerm: string;
  statusFilter: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

export function Filters({ searchTerm, statusFilter, onSearchChange, onStatusChange }: FiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Buscar empresas..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      
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
