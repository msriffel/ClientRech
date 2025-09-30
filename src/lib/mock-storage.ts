import { Client, Contact, Interaction } from './types';

// In-memory storage for mock data
let mockClients: Client[] = [];
let mockContacts: Contact[] = [];
let mockInteractions: Interaction[] = [];

// Initialize with sample data
const initializeMockData = () => {
  if (mockClients.length === 0) {
    mockClients = [
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
      }
    ];

    mockInteractions = [
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
      }
    ];
  }
};

// Client operations
export function getMockClients(): Client[] {
  initializeMockData();
  return [...mockClients];
}

export function getMockClientById(id: string): Client | null {
  initializeMockData();
  return mockClients.find(client => client.id === id) || null;
}

export function addMockClient(client: Omit<Client, 'id' | 'createdAt'>): Client {
  initializeMockData();
  const newClient: Client = {
    ...client,
    id: Date.now().toString(),
    createdAt: new Date().toISOString()
  };
  mockClients.push(newClient);
  return newClient;
}

export function updateMockClient(id: string, updates: Partial<Client>): Client | null {
  initializeMockData();
  const index = mockClients.findIndex(client => client.id === id);
  if (index === -1) return null;
  
  mockClients[index] = { ...mockClients[index], ...updates };
  return mockClients[index];
}

export function deleteMockClient(id: string): boolean {
  initializeMockData();
  const index = mockClients.findIndex(client => client.id === id);
  if (index === -1) return false;
  
  mockClients.splice(index, 1);
  return true;
}

// Contact operations
export function addMockContact(clientId: string, contact: Omit<Contact, 'id'>): Contact | null {
  initializeMockData();
  const client = mockClients.find(c => c.id === clientId);
  if (!client) return null;
  
  const newContact: Contact = {
    ...contact,
    id: `${clientId}-${Date.now()}`
  };
  client.contacts.push(newContact);
  return newContact;
}

export function updateMockContact(clientId: string, contactId: string, updates: Partial<Contact>): Contact | null {
  initializeMockData();
  const client = mockClients.find(c => c.id === clientId);
  if (!client) return null;
  
  const contactIndex = client.contacts.findIndex(c => c.id === contactId);
  if (contactIndex === -1) return null;
  
  client.contacts[contactIndex] = { ...client.contacts[contactIndex], ...updates };
  return client.contacts[contactIndex];
}

export function deleteMockContact(clientId: string, contactId: string): boolean {
  initializeMockData();
  const client = mockClients.find(c => c.id === clientId);
  if (!client) return false;
  
  const contactIndex = client.contacts.findIndex(c => c.id === contactId);
  if (contactIndex === -1) return false;
  
  client.contacts.splice(contactIndex, 1);
  return true;
}

// Interaction operations
export function getMockInteractionsByClientId(clientId: string): Interaction[] {
  initializeMockData();
  return mockInteractions
    .filter(interaction => interaction.clientId === clientId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function addMockInteraction(interaction: Omit<Interaction, 'id'>): Interaction {
  initializeMockData();
  const newInteraction: Interaction = {
    ...interaction,
    id: Date.now().toString()
  };
  mockInteractions.push(newInteraction);
  return newInteraction;
}

export function updateMockInteraction(id: string, updates: Partial<Interaction>): Interaction | null {
  initializeMockData();
  const index = mockInteractions.findIndex(interaction => interaction.id === id);
  if (index === -1) return null;
  
  mockInteractions[index] = { ...mockInteractions[index], ...updates };
  return mockInteractions[index];
}

export function deleteMockInteraction(id: string): boolean {
  initializeMockData();
  const index = mockInteractions.findIndex(interaction => interaction.id === id);
  if (index === -1) return false;
  
  mockInteractions.splice(index, 1);
  return true;
}

// Stats
export function getMockClientStats(): { totalClients: number; overdueContacts: number; upcomingContacts: number } {
  initializeMockData();
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
