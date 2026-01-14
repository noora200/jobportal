import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Cache for Supabase clients based on token
const clientCache = new Map();

const supabaseClient = async (supabaseAccessToken) => {
  // Use a default key for unauthenticated requests
  const cacheKey = supabaseAccessToken || 'unauthenticated';
  
  // Return cached client if it exists
  if (clientCache.has(cacheKey)) {
    return clientCache.get(cacheKey);
  }
  
  // Create a new client instance with the specific access token
  const supabase = createClient(supabaseUrl, supabaseKey, {
    global: {
      headers: {
        Authorization: `Bearer ${supabaseAccessToken || ''}`,
      },
    },
  });
  
  // Cache the client
  clientCache.set(cacheKey, supabase);
  
  return supabase;
};

export default supabaseClient;