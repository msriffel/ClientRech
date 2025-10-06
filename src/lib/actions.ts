'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
  getClients,
  getClientById,
  getInteractionsByClientId,
  getClientStats,
  addClient,
  updateClient,
  deleteClient,
  addInteraction,
  updateInteraction,
  deleteInteraction,
  addContact,
  updateContact,
  deleteContact
} from './supabase-client';
import { Client, ClientStatus } from './types';

// ----------------------
// Fetch functions
// ----------------------
export async function fetchClients() {
  return getClients();
}

export async function fetchClientById(id: string) {
  return getClientById(id);
}

export async function fetchInteractionsByClientId(clientId: string) {
  return getInteractionsByClientId(clientId);
}

export async function fetchClientStats() {
  return getClientStats();
}

// ----------------------
// Client Actions
// ----------------------
export async function createClient(formData: FormData) {
  const companyName = formData.get('companyName') as string;
  const website = formData.get('website') as string;
  const phone = formData.get('phone') as string;
  const logoUrl = formData.get('logoUrl') as string;
  const status = formData.get('status') as ClientStatus;
  const nextContactDate = formData.get('nextContactDate') as string;

  // Contact data
  const contactName = formData.get('contactName') as string;
  const contactEmail = formData.get('contactEmail') as string;
  const contactPhone = formData.get('contactPhone') as string;
  const contactRole = formData.get('contactRole') as string;

  const now = new Date().toISOString();

  const newClient = await addClient({
    companyName,
    website: website || undefined,
    phone: phone || undefined,
    logoUrl: logoUrl || `https://picsum.photos/seed/${Date.now()}/100/100`,
    status,
    lastContactDate: now,
    nextContactDate,
    contacts: [{
      id: 'temp',
      name: contactName,
      email: contactEmail,
      phone: contactPhone || undefined,
      role: contactRole
    }]
  });

  if (!newClient) throw new Error('Failed to create client');

  revalidatePath('/');
  redirect(`/clients/${newClient.id}`);
}

export async function updateClientAction(id: string, formData: FormData) {
  const updates: Partial<Client> = {
    companyName: formData.get('companyName') as string,
    website: (formData.get('website') as string) || undefined,
    phone: (formData.get('phone') as string) || undefined,
    logoUrl: (formData.get('logoUrl') as string) || undefined,
    status: formData.get('status') as ClientStatus,
    nextContactDate: formData.get('nextContactDate') as string
  };

  await updateClient(id, updates);
  revalidatePath('/');
  revalidatePath(`/clients/${id}`);
}

export async function deleteClientAction(id: string) {
  const success = await deleteClient(id);
  if (success) {
    revalidatePath('/');
    redirect('/');
  }
  return success;
}

// ----------------------
// Interaction Actions
// ----------------------
export async function createInteraction(formData: FormData) {
  const client_id = formData.get('client_id') as string; // <-- alterado
  const type = formData.get('type') as string;
  const notes = formData.get('notes') as string;
  const nextContactDate = formData.get('nextContactDate') as string;
  const now = new Date().toISOString();

  // Inserir interação no banco
  await addInteraction({ client_id, date: now, type: type as any, notes });

  // Atualizar cliente com datas de contato
  await updateClient(client_id, { lastContactDate: now, nextContactDate });

  // Revalidar cache da página
  revalidatePath(`/clients/${client_id}`);
}

export async function updateInteractionAction(id: string, formData: FormData) {
  await updateInteraction(id, {
    type: formData.get('type') as any,
    notes: formData.get('notes') as string,
    date: formData.get('date') as string
  });
  revalidatePath('/');
}

export async function deleteInteractionAction(id: string, clientId: string) {
  const success = await deleteInteraction(id);
  if (success) revalidatePath(`/clients/${clientId}`);
  return success;
}


// ----------------------
// Contact Actions
// ----------------------
export async function createContact(clientId: string, formData: FormData) {
  await addContact({
    client_id: clientId,
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    phone: (formData.get('phone') as string) || undefined,
    role: formData.get('role') as string
  });
  revalidatePath(`/clients/${clientId}`);
}

export async function updateContactAction(clientId: string, contactId: string, formData: FormData) {
  await updateContact(contactId, {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    phone: (formData.get('phone') as string) || undefined,
    role: formData.get('role') as string
  });
  revalidatePath(`/clients/${clientId}`);
}

export async function deleteContactAction(clientId: string, contactId: string) {
  const success = await deleteContact(contactId);
  if (success) revalidatePath(`/clients/${clientId}`);
  return success;
}
