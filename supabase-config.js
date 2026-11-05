
// SOMAHUB SUPABASE CONFIGURATION

const SUPABASE_URL = "https://hwhgmzxwekrlctupzjli.supabase.co";

const SUPABASE_PUBLISHABLE_KEY = "YOUR_EXISTING_PUBLISHABLE_KEY";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);
