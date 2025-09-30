import { Client, Contact, Interaction, ClientStats } from './types';
import { supabase } from './supabase';

// Client operations
export async function getClients(): Promise<Client[]> {
  const { data: clients, error } = await supabase
    .from('clients')
    .select(`
      *,
      contacts (*)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching clients:', error);
    return [];
  }

  return clients?.map(client => ({
    id: client.id,
    companyName: client.company_name,
    website: client.website,
    phone: client.phone,
    logoUrl: client.logo_url,
    status: client.status as any,
    lastContactDate: client.last_contact_date,
    nextContactDate: client.next_contact_date,
    createdAt: client.created_at,
    contacts: client.contacts || []
  })) || [];
}

export async function getClientById(id: string): Promise<Client | null> {
  const { data: client, error } = await supabase
    .from('clients')
    .select(`
      *,
      contacts (*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching client:', error);
    return null;
  }

  return {
    id: client.id,
    companyName: client.company_name,
    website: client.website,
    phone: client.phone,
    logoUrl: client.logo_url,
    status: client.status as any,
    lastContactDate: client.last_contact_date,
    nextContactDate: client.next_contact_date,
    createdAt: client.created_at,
    contacts: client.contacts || []
  };
}

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

  if (error) {
    console.error('Error adding client:', error);
    return null;
  }

  // Add contacts if any
  if (client.contacts && client.contacts.length > 0) {
    const contactsToInsert = client.contacts.map(contact => ({
      client_id: data.id,
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      role: contact.role
    }));

    await supabase
      .from('contacts')
      .insert(contactsToInsert);
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

export async function updateClient(id: string, updates: Partial<Client>): Promise<Client | null> {
  const updateData: any = {};
  
  if (updates.companyName) updateData.company_name = updates.companyName;
  if (updates.website !== undefined) updateData.website = updates.website;
  if (updates.phone !== undefined) updateData.phone = updates.phone;
  if (updates.logoUrl) updateData.logo_url = updates.logoUrl;
  if (updates.status) updateData.status = updates.status;
  if (updates.lastContactDate) updateData.last_contact_date = updates.lastContactDate;
  if (updates.nextContactDate) updateData.next_contact_date = updates.nextContactDate;

  const { data, error } = await supabase
    .from('clients')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating client:', error);
    return null;
  }

  return getClientById(id);
}

export async function deleteClient(id: string): Promise<boolean> {
  // Delete related contacts first
  await supabase
    .from('contacts')
    .delete()
    .eq('client_id', id);

  // Delete related interactions
  await supabase
    .from('interactions')
    .delete()
    .eq('client_id', id);

  // Delete client
  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting client:', error);
    return false;
  }

  return true;
}

// Contact operations
export async function addContact(clientId: string, contact: Omit<Contact, 'id'>): Promise<Contact | null> {
  const { data, error } = await supabase
    .from('contacts')
    .insert({
      client_id: clientId,
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      role: contact.role
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding contact:', error);
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    email: data.email,
    phone: data.phone,
    role: data.role
  };
}

export async function updateContact(clientId: string, contactId: string, updates: Partial<Contact>): Promise<Contact | null> {
  const updateData: any = {};
  
  if (updates.name) updateData.name = updates.name;
  if (updates.email) updateData.email = updates.email;
  if (updates.phone !== undefined) updateData.phone = updates.phone;
  if (updates.role) updateData.role = updates.role;

  const { data, error } = await supabase
    .from('contacts')
    .update(updateData)
    .eq('id', contactId)
    .eq('client_id', clientId)
    .select()
    .single();

  if (error) {
    console.error('Error updating contact:', error);
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    email: data.email,
    phone: data.phone,
    role: data.role
  };
}

export async function deleteContact(clientId: string, contactId: string): Promise<boolean> {
  const { error } = await supabase
    .from('contacts')
    .delete()
    .eq('id', contactId)
    .eq('client_id', clientId);

  if (error) {
    console.error('Error deleting contact:', error);
    return false;
  }

  return true;
}

// Interaction operations
export async function getInteractionsByClientId(clientId: string): Promise<Interaction[]> {
  const { data, error } = await supabase
    .from('interactions')
    .select('*')
    .eq('client_id', clientId)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching interactions:', error);
    return [];
  }

  return data?.map(interaction => ({
    id: interaction.id,
    clientId: interaction.client_id,
    date: interaction.date,
    type: interaction.type as any,
    notes: interaction.notes
  })) || [];
}

export async function addInteraction(interaction: Omit<Interaction, 'id'>): Promise<Interaction | null> {
  const { data, error } = await supabase
    .from('interactions')
    .insert({
      client_id: interaction.clientId,
      date: interaction.date,
      type: interaction.type,
      notes: interaction.notes
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding interaction:', error);
    return null;
  }

  return {
    id: data.id,
    clientId: data.client_id,
    date: data.date,
    type: data.type as any,
    notes: data.notes
  };
}

export async function updateInteraction(id: string, updates: Partial<Interaction>): Promise<Interaction | null> {
  const updateData: any = {};
  
  if (updates.clientId) updateData.client_id = updates.clientId;
  if (updates.date) updateData.date = updates.date;
  if (updates.type) updateData.type = updates.type;
  if (updates.notes) updateData.notes = updates.notes;

  const { data, error } = await supabase
    .from('interactions')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating interaction:', error);
    return null;
  }

  return {
    id: data.id,
    clientId: data.client_id,
    date: data.date,
    type: data.type as any,
    notes: data.notes
  };
}

export async function deleteInteraction(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('interactions')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting interaction:', error);
    return false;
  }

  return true;
}

// Stats
export async function getClientStats(): Promise<ClientStats> {
  const { data: clients, error } = await supabase
    .from('clients')
    .select('next_contact_date');

  if (error) {
    console.error('Error fetching client stats:', error);
    return { totalClients: 0, overdueContacts: 0, upcomingContacts: 0 };
  }

  const now = new Date();
  const totalClients = clients?.length || 0;
  
  const overdueContacts = clients?.filter(client => 
    new Date(client.next_contact_date) < now
  ).length || 0;
  
  const upcomingContacts = clients?.filter(client => {
    const nextContact = new Date(client.next_contact_date);
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return nextContact >= now && nextContact <= sevenDaysFromNow;
  }).length || 0;

  return {
    totalClients,
    overdueContacts,
    upcomingContacts
  };
}
