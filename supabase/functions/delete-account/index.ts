// ============================================================
//  Edge Function: delete-account
//  Exclui a conta do usuário que chamou (direito de eliminação, LGPD).
//  Apaga o usuário de auth.users; como profiles/progress/events/follows/
//  push_subscriptions referenciam auth.users(id) ON DELETE CASCADE, todos
//  esses dados são removidos junto. (feedback usa ON DELETE SET NULL →
//  as mensagens permanecem anonimizadas.)
//
//  Secrets: usa SUPABASE_URL / SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY
//  (já existem nas Edge Functions). Deploy: supabase functions deploy delete-account
//  >>> O slug do endpoint precisa bater com o que o app chama (db.js). <<<
// ============================================================
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
}
function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  if (req.method !== 'POST') return json({ error: 'method not allowed' }, 405)
  try {
    const authHeader = req.headers.get('Authorization') ?? ''
    const asUser = createClient(SUPABASE_URL, ANON_KEY, { global: { headers: { Authorization: authHeader } } })
    const { data: { user } } = await asUser.auth.getUser()
    if (!user) return json({ error: 'unauthorized' }, 401)

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE)
    const { error } = await admin.auth.admin.deleteUser(user.id)   // cascata remove os dados ligados
    if (error) return json({ error: error.message }, 500)
    return json({ deleted: true })
  } catch (e) {
    return json({ error: String(e) }, 500)
  }
})
