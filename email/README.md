# E-mails do Psico·Pato (Supabase)

Templates de e-mail brandeados em PT-BR para substituir os e-mails genéricos em inglês
que o Supabase envia por padrão. **Tudo aqui é configurado no painel do Supabase** — não há
código no app que controle esses e-mails.

## Arquivos

| Arquivo | Template do Supabase | Quando é enviado |
|---|---|---|
| [`confirmar-cadastro.html`](confirmar-cadastro.html) | **Confirm signup** | ao criar conta por e-mail/senha |
| [`recuperar-senha.html`](recuperar-senha.html) | **Reset Password** | ao pedir redefinição de senha |

## Como aplicar

1. No painel do **Supabase**, vá em **Authentication → Emails → Templates** (ou *Email Templates*).
2. Selecione o template (ex.: **Confirm signup**).
3. No campo **Subject (assunto)**, troque o texto em inglês por um em PT-BR (sugestões abaixo).
4. No corpo (HTML), apague o conteúdo padrão e **cole** o HTML do arquivo correspondente.
5. Salve. Repita para os outros templates.

### Assuntos sugeridos
- **Confirm signup:** `Confirme seu e-mail no Psico·Pato`
- **Reset Password:** `Redefinir sua senha — Psico·Pato`

## Variáveis usadas
Os templates usam apenas `{{ .ConfirmationURL }}` (o link de ação que o Supabase injeta).
Outras disponíveis, se quiser: `{{ .Email }}`, `{{ .SiteURL }}`, `{{ .Token }}`, `{{ .TokenHash }}`, `{{ .RedirectTo }}`.

## ⚠️ Pré-requisito: SMTP customizado é OBRIGATÓRIO para editar templates
O Supabase **só libera a edição de assunto/corpo dos e-mails depois que você configura
um SMTP próprio**. Com o serviço de e-mail padrão dele aparece o aviso:
*"Set up custom SMTP to edit templates"* — e os templates ficam travados no padrão (inglês).

Ou seja: **sem SMTP customizado, estes templates não entram em uso.**

### Como configurar o SMTP (resumo)
1. Escolha um provedor de envio (vários têm plano grátis): **Resend**, **Brevo**, **SendGrid**,
   **Mailgun**, **Postmark** ou **Amazon SES**.
2. No provedor, **verifique um remetente** — idealmente um **domínio próprio** (adicionando os
   registros DNS de SPF/DKIM que ele indicar). Alguns permitem testar com um domínio de sandbox.
3. Pegue as credenciais **SMTP** (host, porta, usuário, senha).
4. No Supabase: **Authentication → Emails → SMTP Settings** → ative *Custom SMTP* e preencha
   host/porta/usuário/senha + **Sender name** (`Psico·Pato`) e **Sender email**
   (`nao-responda@seudominio.com`).
5. Salve. Agora a aba **Email Templates** fica editável → aplique os HTMLs desta pasta.
6. Confira também a **URL de redirecionamento** pós-confirmação em
   **Authentication → URL Configuration** (deve apontar para o app).

> O SMTP padrão do Supabase também tem **limite baixo de envios/hora** e só serve para testes —
> para produção, SMTP próprio é necessário de qualquer forma.

### Alternativa, se não quiser SMTP agora
Em **Authentication → Providers → Email**, dá para **desligar a confirmação por e-mail**
(*Confirm email* off): o usuário entra na hora, sem receber e-mail nenhum. É mais simples,
mas qualquer pessoa pode cadastrar com um e-mail que não é dela. Avalie o trade-off.

## Observações
- Estilos são **inline + tabelas** de propósito: clientes de e-mail (Gmail, Outlook) ignoram
  `<style>`/CSS externo e quebram layouts com flexbox/grid.
- Sem imagens externas (logo é texto) para evitar bloqueio de imagens e problemas de hospedagem.
- Confira também a **URL de redirecionamento** pós-confirmação em
  **Authentication → URL Configuration** (deve apontar para o app).
