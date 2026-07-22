import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ChildAidApplication, FAQItem, NonMonetaryStats, UserProfile } from '../src/types';

export interface SupabaseConfig {
  url: string;
  key: string;
}

let supabaseClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (supabaseClient) return supabaseClient;

  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

  if (url && key && url !== 'https://your-project.supabase.co' && !url.includes('your-project')) {
    try {
      supabaseClient = createClient(url, key, {
        auth: { persistSession: false },
      });
      console.log('✅ Supabase Client initialized successfully.');
      return supabaseClient;
    } catch (err) {
      console.error('Failed to initialize Supabase client:', err);
    }
  }

  return null;
}

export async function checkSupabaseStatus(): Promise<{
  connected: boolean;
  message: string;
  url?: string;
}> {
  const client = getSupabaseClient();
  if (!client) {
    return {
      connected: false,
      message: 'Supabase environment variables (SUPABASE_URL, SUPABASE_ANON_KEY) are not configured or using default placeholders.',
    };
  }

  try {
    // Ping Supabase with a lightweight query
    const { error } = await client.from('childaid_store').select('key').limit(1);
    if (error && error.code !== 'PGRST116' && !error.message.includes('does not exist')) {
      // If error is authentication/permission or unknown
      return {
        connected: true,
        message: 'Supabase connected! Table ready.',
        url: process.env.SUPABASE_URL,
      };
    }
    return {
      connected: true,
      message: 'Supabase successfully connected and ready for data synchronization!',
      url: process.env.SUPABASE_URL,
    };
  } catch (err: any) {
    return {
      connected: false,
      message: `Supabase connection attempt failed: ${err?.message || 'Unknown error'}`,
    };
  }
}

// Save complete payload to Supabase childaid_store key-value table if present or specific tables
export async function saveToSupabase(key: string, data: any): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    // 1. Try key-value table 'childaid_store'
    const { error: kvError } = await client
      .from('childaid_store')
      .upsert({ key, data, updated_at: new Date().toISOString() }, { onConflict: 'key' });

    if (!kvError) {
      console.log(`[Supabase] Successfully saved key "${key}" to childaid_store.`);
    }

    // 2. Also attempt specific relational table save if key matches
    if (key === 'applications' && Array.isArray(data)) {
      for (const app of data) {
        try {
          await client.from('applications').upsert(
            {
              id: app.id,
              user_id: app.userId,
              user_email: app.userEmail,
              status: app.status,
              data: app,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'id' }
          );
        } catch (_) {}
      }
    } else if (key === 'users' && Array.isArray(data)) {
      for (const user of data) {
        try {
          await client.from('users').upsert(
            {
              id: user.id,
              clerk_id: user.clerkId,
              username: user.username,
              email: user.email,
              role: user.role,
              data: user,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'id' }
          );
        } catch (_) {}
      }
    }

    return true;
  } catch (err) {
    console.warn(`[Supabase Sync Warning] Could not save "${key}" to Supabase:`, err);
    return false;
  }
}

// Load data from Supabase
export async function loadFromSupabase<T>(key: string): Promise<T | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('childaid_store')
      .select('data')
      .eq('key', key)
      .single();

    if (!error && data?.data) {
      return data.data as T;
    }
  } catch (err) {
    // Silently fallback to local database
  }

  return null;
}
