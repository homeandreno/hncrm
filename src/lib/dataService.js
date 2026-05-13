// Local Bridge Database Service
// This service connects the CRM to your personal SQLite database running on port 3001.

const BRIDGE_URL = 'http://127.0.0.1:3001/crm';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper for Bridge Requests
const bridgeFetch = async (endpoint, options = {}) => {
  try {
    const res = await fetch(`${BRIDGE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
    return await res.json();
  } catch (e) {
    console.error(`Bridge Connection Failed: ${endpoint}`, e);
    return null;
  }
};

// --- Contacts ---

const initialContacts = [
  { id: '1', name: 'Alice Freeman', company: 'TechNova', role: 'CEO', email: 'alice@technova.io', status: 'Active', enriched: true },
  { id: '2', name: 'Robert Chen', company: 'BuildRight', role: 'Director', email: 'robert@buildright.com', status: 'Lead', enriched: true },
  { id: '3', name: 'Sarah Jenkins', company: 'DesignCo', role: 'Founder', email: 'sarah.j@designco.net', status: 'Active', enriched: false },
  { id: '4', name: 'Michael Ross', company: 'LegalTech', role: 'Partner', email: 'mross@legaltech.io', status: 'Churned', enriched: true },
];

import { analyzeLeadWebsite } from './enrichmentService';

export const getContacts = async () => {
  await delay(200);
  const data = await bridgeFetch('/contacts');
  
  // Seed if empty
  if (!data || data.length === 0) {
    for (const c of initialContacts) {
      await bridgeFetch('/contacts', { method: 'POST', body: JSON.stringify(c) });
    }
    return initialContacts;
  }
  return data;
};

export const addContact = async (contact, autoEnrich = false) => {
  let enrichedData = { enriched: false };
  
  if (autoEnrich) {
    const enrichment = await analyzeLeadWebsite(contact.email.split('@')[1], contact.company);
    enrichedData = { 
      enriched: true, 
      aiHook: enrichment.hook, 
      aiScore: enrichment.aiScore 
    };
  }

  const newContact = { 
    ...contact, 
    id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
    ...enrichedData
  };
  
  await bridgeFetch('/contacts', { method: 'POST', body: JSON.stringify(newContact) });
  return newContact;
};

export const updateContact = async (id, updates) => {
  const contacts = await getContacts();
  const existing = contacts.find(c => c.id === id);
  const updated = { ...existing, ...updates };
  
  await bridgeFetch('/contacts', { method: 'POST', body: JSON.stringify(updated) });
  return updated;
};


// --- Opportunities ---

const initialDeals = [
  { id: '1', title: 'Website Redesign', company: 'TechNova', value: 15000, col: 'lead', days: 2 },
  { id: '2', title: 'SEO Retainer', company: 'BuildRight', value: 2500, col: 'contacted', days: 5 },
  { id: '3', title: 'CRM Implementation', company: 'LegalTech', value: 8000, col: 'proposal', days: 1 },
  { id: '4', title: 'Brand Identity', company: 'DesignCo', value: 5000, col: 'won', days: 0 },
  { id: '5', title: 'Ad Campaign', company: 'MarketPro', value: 10000, col: 'lead', days: 8 },
];

export const getDeals = async () => {
  await delay(200);
  const data = await bridgeFetch('/deals');
  
  if (!data || data.length === 0) {
    for (const d of initialDeals) {
      await bridgeFetch('/deals', { method: 'POST', body: JSON.stringify(d) });
    }
    return initialDeals;
  }
  return data;
};

export const updateDealColumn = async (dealId, newCol) => {
  const deals = await getDeals();
  const deal = deals.find(d => d.id === dealId);
  const updated = { ...deal, col: newCol, days: 0 };
  
  await bridgeFetch('/deals', { method: 'POST', body: JSON.stringify(updated) });
  return await getDeals();
};

export const addDeal = async (deal) => {
  const newDeal = { ...deal, id: Date.now().toString(), days: 0 };
  await bridgeFetch('/deals', { method: 'POST', body: JSON.stringify(newDeal) });
  return newDeal;
};
