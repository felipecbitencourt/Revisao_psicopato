/* ------------------------------------------------------------------
   Configuração do Supabase — preencha com as chaves do SEU projeto.

   Onde achar: painel do Supabase → Project Settings → API
     • url     → "Project URL"     (ex.: https://abcdxyz.supabase.co)
     • anonKey → chave "anon public"

   A chave "anon" é segura para o navegador: quem protege os dados é o
   Row Level Security (RLS) do schema.sql. NUNCA coloque a chave
   "service_role" aqui.

   Enquanto estes valores forem os placeholders abaixo, o app roda em
   "modo demonstração" (sem login, dados ilustrativos), exatamente
   como antes — nada quebra.
   ------------------------------------------------------------------ */
window.SUPABASE_CONFIG = {
  url: 'https://hweszuthgoespqhlzgrw.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3ZXN6dXRoZ29lc3BxaGx6Z3J3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2ODMyMzIsImV4cCI6MjA5NzI1OTIzMn0.dH274FmU-wnCeQT71u1mbGfsGhZbSpxr5RwKy2D4vog',

  // Notificações push (Web Push / VAPID). Cole aqui a CHAVE PÚBLICA VAPID
  // gerada para a Edge Function "notify-follow" (a privada fica só nos
  // secrets do Supabase, NUNCA aqui). Veja docs/PUSH_SETUP.md.
  // Enquanto estiver vazia, o app simplesmente não oferece push.
  vapidPublicKey: 'BPFQL0hcu8bxVbkigSI8zb-Ur86zR_la7ZS3jvdCkRC9q11TaPykZnnKv54DZcadbbwXqYB7VwqR9FWvEEyXP-A'
};
