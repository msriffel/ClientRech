import { createClient } from '@supabase/supabase-js';
import { Client, ClientStatus, Contact, Interaction } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

// Cliente para front-end (anon)
export const supabase = createClient(
  supabaseUrl,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Cliente para Server Actions (Service Role)
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ----------------------
// Clients
// ----------------------
export async function addClient(client: Omit<Client, 'id' | 'createdAt'>): Promise<Client | null> {
  const { data, error } = await supabaseAdmin
    .from('clients')
    .insert({
      company_name: client.companyName,
      website: client.website,
      phone: client.phone,
      logo_url: client.logoUrl,
      status: client.status as ClientStatus,
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

    await supabaseAdmin.from('contacts').insert(contactsToInsert);
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

  const { data: contacts, error: contactsError } = await supabase
    .from('contacts')
    .select('*')
    .eq('client_id', id);

  if (contactsError) console.error('Error fetching contacts:', contactsError);

  return {
    id: data.id,
    companyName: data.company_name,
    website: data.website,
    phone: data.phone,
    logoUrl: data.logo_url,
    status: data.status as ClientStatus,
    lastContactDate: data.last_contact_date,
    nextContactDate: data.next_contact_date,
    createdAt: data.created_at,
    contacts: contacts || []
  };
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
        status: client.status as ClientStatus, // ✅ aqui
        lastContactDate: client.last_contact_date,
        nextContactDate: client.next_contact_date,
        createdAt: client.created_at,
        contacts: contacts || []
      };
    })
  );

  return clientsWithContacts;
}


export async function updateClient(id: string, updates: Partial<Client>) {
  const { error } = await supabaseAdmin
    .from('clients')
    .update({
      company_name: updates.companyName,
      website: updates.website,
      phone: updates.phone,
      logo_url: updates.logoUrl,
      status: updates.status as string, // ✅ converte literal para string
      last_contact_date: updates.lastContactDate,
      next_contact_date: updates.nextContactDate
    })
    .eq('id', id);

  return !error;
}

export async function deleteClient(id: string) {
  const { error } = await supabaseAdmin
    .from('clients')
    .delete()
    .eq('id', id);

  return !error;
}

// ----------------------
// Contacts
// ----------------------
export async function addContact(contact: any) {
  const { error } = await supabaseAdmin
    .from('contacts')
    .insert(contact);

  if (error) console.error('Error adding contact:', error);
  return !error;
}

export async function updateContact(id: string, updates: any) {
  const { error } = await supabaseAdmin
    .from('contacts')
    .update(updates)
    .eq('id', id);

  if (error) console.error('Error updating contact:', error);
  return !error;
}

export async function deleteContact(id: string) {
  const { error } = await supabaseAdmin
    .from('contacts')
    .delete()
    .eq('id', id);

  if (error) console.error('Error deleting contact:', error);
  return !error;
}

// ----------------------
// Interactions
// ----------------------
export async function addInteraction(interaction: any) {
  const { error } = await supabaseAdmin
    .from('interactions')
    .insert(interaction);

  if (error) console.error('Error adding interaction:', error);
  return !error;
}

export async function updateInteraction(id: string, updates: any) {
  const { error } = await supabaseAdmin
    .from('interactions')
    .update(updates)
    .eq('id', id);

  if (error) console.error('Error updating interaction:', error);
  return !error;
}

export async function deleteInteraction(id: string) {
  const { error } = await supabaseAdmin
    .from('interactions')
    .delete()
    .eq('id', id);

  if (error) console.error('Error deleting interaction:', error);
  return !error;
}

// ----------------------
// Client Stats
// ----------------------
export async function getClientStats(): Promise<{ total: number; active: number; inactive: number }> {
  const { count: total } = await supabase
    .from('clients')
    .select('*', { count: 'exact', head: true });

  const { count: active } = await supabase
    .from('clients')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'Cliente Ativo');

  const { count: inactive } = await supabase
    .from('clients')
    .select('*', { count: 'exact', head: true })
    .in('status', ['Cliente Inativo', 'Desativado']);

  return {
    total: total ?? 0,
    active: active ?? 0,
    inactive: inactive ?? 0
  };
}

// ----------------------
// Interactions
// ----------------------
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
