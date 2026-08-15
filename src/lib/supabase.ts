import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 'https://amkjrwahdbuolggozwgd.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFta2pyd2FoZGJ1b2xnZ296d2dkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYzMzQ3MDksImV4cCI6MjEwMTkxMDcwOX0.7DPwkA6qOZ_X7WCAXW0pMD3y-GO53mWknwBmpYeUggQ';

let supabaseClient: SupabaseClient | null = null;

export function getSupabaseClient() {
  if (!supabaseClient) {
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return supabaseClient;
}

/* ─── typed helpers ─────────────────────────────────────────── */

export async function insertFreeSampleLead(data: {
  first_name: string;
  email: string;
  source: 'homepage_cta' | 'free_sample_page';
  country?: string;
  city_region?: string;
  referral_source?: string;
}) {
  const apiUrl = `${SUPABASE_URL}/functions/v1/send-free-sample`;
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`);
  }
  const result = await response.json();
  if (result.error) {
    throw new Error(result.error);
  }
}

export async function insertNewsletterSubscriber(data: {
  name: string;
  email: string;
  country?: string;
  city_region?: string;
}) {
  const { error } = await getSupabaseClient().from('newsletter_subscribers').insert({
    ...data,
    status: 'subscribed',
    subscribed_at: new Date().toISOString(),
  });
  if (error) {
    if (error.code === '23505') return;
    throw error;
  }
}

export async function insertPrayerPartner(data: {
  name: string;
  email: string;
  country?: string;
  city_region?: string;
}) {
  const { error } = await getSupabaseClient().from('prayer_partners').insert({
    ...data,
    status: 'active',
  });
  if (error) {
    if (error.code === '23505') return;
    throw error;
  }
}

export async function insertPrayerRequest(data: {
  name: string;
  email?: string;
  request: string;
  country?: string;
  city_region?: string;
}) {
  const { error } = await getSupabaseClient().from('prayer_requests').insert({
    name:    data.name,
    email:   data.email || null,
    request: data.request,
    country: data.country || null,
    city_region: data.city_region || null,
  });
  if (error) throw error;
}

export async function insertContactMessage(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
  country?: string;
  city_region?: string;
}) {
  const { error } = await getSupabaseClient().from('contact_messages').insert(data);
  if (error) throw error;
}

export async function insertDonation(data: {
  name: string;
  email: string;
  country?: string;
  city_region?: string;
  amount?: number;
  prayer_request?: string;
  message?: string;
}) {
  const { error } = await getSupabaseClient().from('donations').insert(data);
  if (error) throw error;
}
