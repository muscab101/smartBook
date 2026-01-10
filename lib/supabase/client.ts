import { createBrowserClient } from '@supabase/ssr'

// Waxaan abuureynaa hal instance oo ah supabase client
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)