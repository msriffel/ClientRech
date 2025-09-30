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
} from './data';
import { Client, Interaction, Contact, ClientStatus } from './types';

// Client Actions
export async function fetchClients() {
  return await getClients();
}

export async function fetchClientById(id: string) {
  return await getClientById(id);
}

export async function fetchInteractionsByClientId(clientId: string) {
  return await getInteractionsByClientId(clientId);
}

export async function fetchClientStats() {
  return await getClientStats();
}

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
    createdAt: now,
    contacts: [{
      id: 'temp',
      name: contactName,
      email: contactEmail,
      phone: contactPhone || undefined,
      role: contactRole
    }]
  });

  revalidatePath('/');
  redirect(`/clients/${newClient.id}`);
}

export async function updateClientAction(id: string, formData: FormData) {
  const companyName = formData.get('companyName') as string;
  const website = formData.get('website') as string;
  const phone = formData.get('phone') as string;
  const logoUrl = formData.get('logoUrl') as string;
  const status = formData.get('status') as ClientStatus;
  const nextContactDate = formData.get('nextContactDate') as string;

  const updates: Partial<Client> = {
    companyName,
    website: website || undefined,
    phone: phone || undefined,
    logoUrl: logoUrl || undefined,
    status,
    nextContactDate
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

// Interaction Actions
export async function createInteraction(formData: FormData) {
  const clientId = formData.get('clientId') as string;
  const type = formData.get('type') as string;
  const notes = formData.get('notes') as string;
  const nextContactDate = formData.get('nextContactDate') as string;

  const now = new Date().toISOString();
  
  await addInteraction({
    clientId,
    date: now,
    type: type as any,
    notes
  });

  // Update client's last contact date and next contact date
  await updateClient(clientId, {
    lastContactDate: now,
    nextContactDate
  });

  revalidatePath(`/clients/${clientId}`);
}

export async function updateInteractionAction(id: string, formData: FormData) {
  const type = formData.get('type') as string;
  const notes = formData.get('notes') as string;
  const date = formData.get('date') as string;

  await updateInteraction(id, {
    type: type as any,
    notes,
    date
  });

  revalidatePath('/');
}

export async function deleteInteractionAction(id: string, clientId: string) {
  const success = await deleteInteraction(id);
  if (success) {
    revalidatePath(`/clients/${clientId}`);
  }
  return success;
}

// Contact Actions
export async function createContact(clientId: string, formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const role = formData.get('role') as string;

  await addContact(clientId, {
    name,
    email,
    phone: phone || undefined,
    role
  });

  revalidatePath(`/clients/${clientId}`);
}

export async function updateContactAction(clientId: string, contactId: string, formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const role = formData.get('role') as string;

  await updateContact(clientId, contactId, {
    name,
    email,
    phone: phone || undefined,
    role
  });

  revalidatePath(`/clients/${clientId}`);
}

export async function deleteContactAction(clientId: string, contactId: string) {
  const success = await deleteContact(clientId, contactId);
  if (success) {
    revalidatePath(`/clients/${clientId}`);
  }
  return success;
}
