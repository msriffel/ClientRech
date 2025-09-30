export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
}

export type InteractionType = 'Chamada' | 'Email' | 'Reunião' | 'Outro';

export interface Interaction {
  id: string;
  clientId: string;
  date: string; // ISO format
  type: InteractionType;
  notes: string;
}

export type ClientStatus = 
  | 'Prospect Frio' 
  | 'Prospect Morno' 
  | 'Prospect Quente' 
  | 'Cliente Ativo' 
  | 'Cliente Fiel' 
  | 'Cliente Inativo';

export interface Client {
  id: string;
  companyName: string;
  website?: string;
  phone?: string;
  logoUrl: string;
  status: ClientStatus;
  lastContactDate: string; // ISO format
  nextContactDate: string; // ISO format
  createdAt: string; // ISO format
  contacts: Contact[];
}

export interface ClientStats {
  totalClients: number;
  overdueContacts: number;
  upcomingContacts: number;
}

export interface AISuggestion {
  suggestedStatus: ClientStatus;
  reason: string;
}
