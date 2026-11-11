// ===== Supabase connection (publishable key frontend ke liye safe hai) =====
// Kabhi bhi "secret" ya "service_role" key yahan na likhein.
const SUPABASE_URL='https://hgbiidtfbgqdqblnpgaa.supabase.co';
const SUPABASE_KEY='sb_publishable_TyKp8EPKpi-VRnjLlmgttA_JVNVsoDr';
const db=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
