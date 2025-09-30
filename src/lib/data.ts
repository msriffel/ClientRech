import { Client, Interaction, Contact, ClientStats } from './types';

// Dados simulados para clientes
export const mockClients: Client[] = [
  {
    id: '1',
    companyName: 'TechCorp Solutions',
    website: 'https://techcorp.com',
    phone: '+55 11 99999-1111',
    logoUrl: 'https://picsum.photos/seed/1/100/100',
    status: 'Cliente Ativo',
    lastContactDate: '2024-01-15T10:00:00Z',
    nextContactDate: '2024-02-15T10:00:00Z',
    createdAt: '2023-06-01T08:00:00Z',
    contacts: [
      {
        id: '1-1',
        name: 'João Silva',
        email: 'joao@techcorp.com',
        phone: '+55 11 99999-1111',
        role: 'CEO'
      },
      {
        id: '1-2',
        name: 'Maria Santos',
        email: 'maria@techcorp.com',
        phone: '+55 11 99999-1112',
        role: 'CTO'
      }
    ]
  },
  {
    id: '2',
    companyName: 'Inovação Digital',
    website: 'https://inovacao.com',
    phone: '+55 21 88888-2222',
    logoUrl: 'https://picsum.photos/seed/2/100/100',
    status: 'Prospect Quente',
    lastContactDate: '2024-01-10T14:30:00Z',
    nextContactDate: '2024-01-25T14:30:00Z',
    createdAt: '2023-12-15T09:00:00Z',
    contacts: [
      {
        id: '2-1',
        name: 'Carlos Oliveira',
        email: 'carlos@inovacao.com',
        phone: '+55 21 88888-2222',
        role: 'Diretor'
      }
    ]
  },
  {
    id: '3',
    companyName: 'StartupXYZ',
    website: 'https://startupxyz.com',
    logoUrl: 'https://picsum.photos/seed/3/100/100',
    status: 'Prospect Frio',
    lastContactDate: '2023-11-20T16:00:00Z',
    nextContactDate: '2024-01-20T16:00:00Z',
    createdAt: '2023-10-01T10:00:00Z',
    contacts: [
      {
        id: '3-1',
        name: 'Ana Costa',
        email: 'ana@startupxyz.com',
        role: 'Fundadora'
      }
    ]
  },
  {
    id: '4',
    companyName: 'Empresa Fiel Ltda',
    website: 'https://empresafiel.com',
    phone: '+55 31 77777-3333',
    logoUrl: 'https://picsum.photos/seed/4/100/100',
    status: 'Cliente Fiel',
    lastContactDate: '2024-01-12T11:00:00Z',
    nextContactDate: '2024-02-12T11:00:00Z',
    createdAt: '2022-03-15T08:30:00Z',
    contacts: [
      {
        id: '4-1',
        name: 'Roberto Lima',
        email: 'roberto@empresafiel.com',
        phone: '+55 31 77777-3333',
        role: 'Gerente'
      },
      {
        id: '4-2',
        name: 'Fernanda Alves',
        email: 'fernanda@empresafiel.com',
        role: 'Assistente'
      }
    ]
  }
];

// Dados simulados para interações
export const mockInteractions: Interaction[] = [
  {
    id: '1',
    clientId: '1',
    date: '2024-01-15T10:00:00Z',
    type: 'Reunião',
    notes: 'Reunião de acompanhamento do projeto. Cliente satisfeito com o progresso.'
  },
  {
    id: '2',
    clientId: '1',
    date: '2024-01-10T14:00:00Z',
    type: 'Email',
    notes: 'Envio de relatório mensal e agendamento da próxima reunião.'
  },
  {
    id: '3',
    clientId: '2',
    date: '2024-01-10T14:30:00Z',
    type: 'Chamada',
    notes: 'Primeira conversa sobre possibilidade de parceria. Interesse demonstrado.'
  },
  {
    id: '4',
    clientId: '3',
    date: '2023-11-20T16:00:00Z',
    type: 'Email',
    notes: 'Envio de proposta inicial. Aguardando retorno.'
  },
  {
    id: '5',
    clientId: '4',
    date: '2024-01-12T11:00:00Z',
    type: 'Reunião',
    notes: 'Reunião de renovação de contrato. Cliente muito satisfeito com os serviços.'
  }
];

// Função para simular delay de rede
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Funções para simular chamadas de API
export async function getClients(): Promise<Client[]> {
  await delay(300);
  return [...mockClients];
}

export async function getClientById(id: string): Promise<Client | null> {
  await delay(200);
  return mockClients.find(client => client.id === id) || null;
}

export async function getInteractionsByClientId(clientId: string): Promise<Interaction[]> {
  await delay(200);
  return mockInteractions
    .filter(interaction => interaction.clientId === clientId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getClientStats(): Promise<ClientStats> {
  await delay(150);
  const now = new Date();
  const totalClients = mockClients.length;
  
  const overdueContacts = mockClients.filter(client => 
    new Date(client.nextContactDate) < now
  ).length;
  
  const upcomingContacts = mockClients.filter(client => {
    const nextContact = new Date(client.nextContactDate);
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return nextContact >= now && nextContact <= sevenDaysFromNow;
  }).length;

  return {
    totalClients,
    overdueContacts,
    upcomingContacts
  };
}

export async function addClient(client: Omit<Client, 'id' | 'createdAt'>): Promise<Client> {
  await delay(400);
  const newClient: Client = {
    ...client,
    id: Date.now().toString(),
    createdAt: new Date().toISOString()
  };
  mockClients.push(newClient);
  return newClient;
}

export async function updateClient(id: string, updates: Partial<Client>): Promise<Client | null> {
  await delay(300);
  const index = mockClients.findIndex(client => client.id === id);
  if (index === -1) return null;
  
  mockClients[index] = { ...mockClients[index], ...updates };
  return mockClients[index];
}

export async function deleteClient(id: string): Promise<boolean> {
  await delay(300);
  const index = mockClients.findIndex(client => client.id === id);
  if (index === -1) return false;
  
  mockClients.splice(index, 1);
  // Remove related interactions
  const interactionIndexes = mockInteractions
    .map((interaction, idx) => interaction.clientId === id ? idx : -1)
    .filter(idx => idx !== -1)
    .reverse();
  
  interactionIndexes.forEach(idx => mockInteractions.splice(idx, 1));
  return true;
}

export async function addInteraction(interaction: Omit<Interaction, 'id'>): Promise<Interaction> {
  await delay(300);
  const newInteraction: Interaction = {
    ...interaction,
    id: Date.now().toString()
  };
  mockInteractions.push(newInteraction);
  return newInteraction;
}

export async function updateInteraction(id: string, updates: Partial<Interaction>): Promise<Interaction | null> {
  await delay(300);
  const index = mockInteractions.findIndex(interaction => interaction.id === id);
  if (index === -1) return null;
  
  mockInteractions[index] = { ...mockInteractions[index], ...updates };
  return mockInteractions[index];
}

export async function deleteInteraction(id: string): Promise<boolean> {
  await delay(300);
  const index = mockInteractions.findIndex(interaction => interaction.id === id);
  if (index === -1) return false;
  
  mockInteractions.splice(index, 1);
  return true;
}

export async function addContact(clientId: string, contact: Omit<Contact, 'id'>): Promise<Contact | null> {
  await delay(300);
  const client = mockClients.find(c => c.id === clientId);
  if (!client) return null;
  
  const newContact: Contact = {
    ...contact,
    id: `${clientId}-${Date.now()}`
  };
  client.contacts.push(newContact);
  return newContact;
}

export async function updateContact(clientId: string, contactId: string, updates: Partial<Contact>): Promise<Contact | null> {
  await delay(300);
  const client = mockClients.find(c => c.id === clientId);
  if (!client) return null;
  
  const contactIndex = client.contacts.findIndex(c => c.id === contactId);
  if (contactIndex === -1) return null;
  
  client.contacts[contactIndex] = { ...client.contacts[contactIndex], ...updates };
  return client.contacts[contactIndex];
}

export async function deleteContact(clientId: string, contactId: string): Promise<boolean> {
  await delay(300);
  const client = mockClients.find(c => c.id === clientId);
  if (!client) return false;
  
  const contactIndex = client.contacts.findIndex(c => c.id === contactId);
  if (contactIndex === -1) return false;
  
  client.contacts.splice(contactIndex, 1);
  return true;
}
