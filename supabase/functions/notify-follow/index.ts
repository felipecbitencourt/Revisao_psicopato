// ============================================================
//  Edge Function: notify-follow
//  Envia um push "Novo seguidor" para o usuário-alvo.
//
//  Fluxo: o cliente (quem segue) chama esta função logo após seguir,
//  passando { target: <uuid do seguido> }. A função identifica quem
//  chamou pelo JWT, pega o nome dele, lê as inscrições de push do
//  alvo (com a service role) e dispara o Web Push para cada uma.
//
//  Secrets necessários (supabase secrets set ...):
//    VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT (ex.: mailto:voce@email.com)
//  (SUPABASE_URL / SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY já existem.)
//
//  Deploy:  supabase functions deploy notify-follow
//  Ver docs/PUSH_SETUP.md.
// ============================================================
import webpush from 'npm:web-push@3.6.7'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const VAPID_PUBLIC = Deno.env.get('VAPID_PUBLIC_KEY') ?? ''
const VAPID_PRIVATE = Deno.env.get('VAPID_PRIVATE_KEY') ?? ''
const VAPID_SUBJECT = Deno.env.get('VAPID_SUBJECT') ?? 'mailto:admin@example.com'

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
  if (!VAPID_PUBLIC || !VAPID_PRIVATE) return json({ error: 'VAPID keys not configured' }, 500)

  try {
    const { target } = await req.json().catch(() => ({}))
    if (!target) return json({ error: 'target required' }, 400)

    const authHeader = req.headers.get('Authorization') ?? ''
    const admin = createClient(SUPABASE_URL, SERVICE_ROLE)
    const asUser = createClient(SUPABASE_URL, ANON_KEY, { global: { headers: { Authorization: authHeader } } })

    // quem chamou (o seguidor)
    const { data: { user } } = await asUser.auth.getUser()
    if (!user) return json({ error: 'unauthorized' }, 401)
    if (target === user.id) return json({ sent: 0 }) // não notifica a si mesmo

    // nome de quem seguiu
    const { data: prof } = await admin.from('profiles').select('apelido,nome').eq('id', user.id).maybeSingle()
    const nome = (prof?.apelido?.trim() || prof?.nome?.trim() || 'Alguém')

    // inscrições do alvo
    const { data: subs } = await admin.from('push_subscriptions').select('*').eq('user_id', target)
    if (!subs || !subs.length) return json({ sent: 0 })

    webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC, VAPID_PRIVATE)
    const payload = JSON.stringify({
      title: 'Novo seguidor',
      body: `${nome} começou a seguir você.`,
      url: '/?n=follow',
      tag: 'follow'
    })

    let sent = 0
    for (const s of subs) {
      try {
        await webpush.sendNotification(
          { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
          payload
        )
        sent++
      } catch (err) {
        const code = (err && (err as { statusCode?: number }).statusCode) || 0
        // inscrição morta → remove
        if (code === 404 || code === 410) {
          await admin.from('push_subscriptions').delete().eq('endpoint', s.endpoint)
        }
      }
    }
    return json({ sent })
  } catch (e) {
    return json({ error: String(e) }, 500)
  }
})
