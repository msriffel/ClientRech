import { Client, Contact } from './types';
import { supabase } from './supabase';

export async function addClient(client: Omit<Client, 'id' | 'createdAt'>): Promise<Client | null> {
  const { data, error } = await supabase
    .from('clients')
    .insert({
      company_name: client.companyName,
      website: client.website,
      phone: client.phone,
      logo_url: client.logoUrl,
      status: client.status,
      last_contact_date: client.lastContactDate,
      next_contact_date: client.nextContactDate
    })
    .select()
    .single();

  if (error || !data) {
    console.error('Error adding client:', error);
    return null;
  }

  // Adiciona contatos se houver
  if (client.contacts && client.contacts.length > 0) {
    const contactsToInsert = client.contacts.map(contact => ({
      client_id: data.id,
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      role: contact.role
    }));

    await supabase.from('contacts').insert(contactsToInsert);
  }

  return {
    id: data.id,
    companyName: data.company_name,
    website: data.website,
    phone: data.phone,
    logoUrl: data.logo_url,
    status: data.status as any,
    lastContactDate: data.last_contact_date,
    nextContactDate: data.next_contact_date,
    createdAt: data.created_at,
    contacts: client.contacts || []
  };
}

export async function getClientById(id: string): Promise<Client | null> {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    console.error('Error fetching client:', error);
    return null;
  }

  // Busca contatos relacionados
  const { data: contacts, error: contactsError } = await supabase
    .from('contacts')
    .select('*')
    .eq('client_id', id);

  if (contactsError) {
    console.error('Error fetching contacts:', contactsError);
  }

  return {
    id: data.id,
    companyName: data.company_name,
    website: data.website,
    phone: data.phone,
    logoUrl: data.logo_url,
    status: data.status,
    lastContactDate: data.last_contact_date,
    nextContactDate: data.next_contact_date,
    createdAt: data.created_at,
    contacts: contacts || []
  };
}


export async function getInteractionsByClientId(clientId: string) {
  const { data, error } = await supabase
    .from('interactions')
    .select('*')
    .eq('client_id', clientId)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching interactions:', error);
    return [];
  }

  return data || [];
}


export async function getClients(): Promise<Client[]> {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching clients:', error);
    return [];
  }

  // Para cada cliente, buscar contatos (opcional, pode ser otimizado)
  const clientsWithContacts = await Promise.all(
    (data || []).map(async (client) => {
      const { data: contacts } = await supabase
        .from('contacts')
        .select('*')
        .eq('client_id', client.id);

      return {
        id: client.id,
        companyName: client.company_name,
        website: client.website,
        phone: client.phone,
        logoUrl: client.logo_url,
        status: client.status,
        lastContactDate: client.last_contact_date,
        nextContactDate: client.next_contact_date,
        createdAt: client.created_at,
        contacts: contacts || []
      };
    })
  );

  return clientsWithContacts;
}

export async function getClientStats() {
  // Total de clientes
  const { count: total } = await supabase
    .from('clients')
    .select('*', { count: 'exact', head: true });

  // Clientes ativos
  const { count: active } = await supabase
    .from('clients')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'ativo');

  // Clientes inativos
  const { count: inactive } = await supabase
    .from('clients')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'inativo');

  return {
    total: total ?? 0,
    active: active ?? 0,
    inactive: inactive ?? 0
  };
}

export async function updateClient(id: string, updates: Partial<Client>) {
  const { error } = await supabase
    .from('clients')
    .update({
      company_name: updates.companyName,
      website: updates.website,
      phone: updates.phone,
      logo_url: updates.logoUrl,
      status: updates.status,
      last_contact_date: updates.lastContactDate,
      next_contact_date: updates.nextContactDate
    })
    .eq('id', id);

  return !error;
}

export async function deleteClient(id: string) {
  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', id);

  return !error;
}

export async function addInteraction(interaction: any) {
  const { error } = await supabase
    .from('interactions')
    .insert(interaction);

  return !error;
}

export async function updateInteraction(id: string, updates: any) {
  const { error } = await supabase
    .from('interactions')
    .update(updates)
    .eq('id', id);

  return !error;
}

export async function deleteInteraction(id: string) {
  const { error } = await supabase
    .from('interactions')
    .delete()
    .eq('id', id);

  return !error;
}

export async function addContact(contact: any) {
  const { error } = await supabase
    .from('contacts')
    .insert(contact);

  return !error;
}

export async function updateContact(id: string, updates: any) {
  const { error } = await supabase
    .from('contacts')
    .update(updates)
    .eq('id', id);

  return !error;
}

export async function deleteContact(id: string) {
  const { error } = await supabase
    .from('contacts')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting contact:', error);
    return false;
  }

  return true;
}

