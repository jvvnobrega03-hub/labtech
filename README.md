# Labtech

Site institucional e catálogo B2B para produtos e soluções laboratoriais, hospitalares e de diagnóstico. A aplicação usa Next.js 16 App Router, React 19, TypeScript estrito e Tailwind CSS 4, com interface pública em pt-BR.

## Arquitetura

- `src/app`: rotas, páginas estáticas, metadados, sitemap, robots, manifesto e Route Handler.
- `src/components`: componentes de servidor e ilhas interativas para menu, vídeo, catálogo, formulários e cotação.
- `src/data`: catálogo estático e tipos de domínio.
- `src/lib`: configuração institucional, busca, cotação, analytics preparado, metadata e validação.
- `tests`: testes nativos de busca, cotação e contrato de validação.
- `docs/redirects.md`: tabela de URLs antigas e destinos atuais.

O catálogo é estático e não depende de CMS ou banco. A cotação é um mini-carrinho B2B, persistido no `localStorage` com versão de schema, sem checkout ou pagamento.

## Contato e orçamento

`POST /api/contato` aceita somente JSON, limita o corpo a 32 KiB, sanitiza os campos, valida consentimento e honeypot, limita tentativas em memória e confere produtos da cotação contra o catálogo.

Mensagens da página de contato são enviadas no servidor pelo Resend. A interface só confirma o envio quando o provedor aceita a mensagem; a chave privada nunca é exposta ao navegador. A configuração manual do domínio, da chave e do destinatário está em [`docs/resend.md`](docs/resend.md).

O fluxo de cotação continua separado e não declara entrega ou persistência sem uma integração comercial aprovada.

## Dados institucionais

A fonte única está em `src/lib/config.ts`. Telefone, WhatsApp, e-mail, CNPJ, nome legal e ano de fundação não devem ser repetidos em componentes.

Dados ainda ausentes e deliberadamente não inventados:

- endereço oficial;
- horário de atendimento;
- perfis sociais;
- marcas e fabricantes parceiros;
- SKU, marca, fabricante e documentação de cada produto;
- tabela histórica de IDs antigos para redirects `/produto/:id`;
- canal definitivo para processamento das solicitações de cotação.

## Ambiente

```bash
npm ci
npm run dev
```

Abra `http://localhost:3000`.

Variáveis aceitas em `.env.local`:

```bash
NEXT_PUBLIC_SITE_URL=https://dominio-oficial.example
NEXT_PUBLIC_CONTACT_EMAIL=contato@example.com
NEXT_PUBLIC_WHATSAPP_URL=https://wa.me/5511000000000
RESEND_API_KEY=re_...
CONTACT_EMAIL_TO=site@labtech.com.br
CONTACT_EMAIL_FROM="Labtech <site@labtech.com.br>"
```

`NEXT_PUBLIC_SITE_URL` só é aceita quando for HTTPS pública. Sem ela, canonical absoluto e sitemap são omitidos e o site usa `noindex`, evitando indexação acidental de ambientes locais.

`RESEND_API_KEY` é exclusivamente server-side e nunca deve ser versionada ou receber o prefixo `NEXT_PUBLIC_`.

## Qualidade

```bash
npm run typecheck
npm run lint
npm test
npm run build
npm run verify
```

O projeto também possui builds compatíveis com OpenNext/Cloudflare em `build:cloudflare` e `build:sites`, preservados para o ambiente de hospedagem existente.

## Privacidade, segurança e analytics

- seleção da cotação fica apenas no navegador;
- não há analytics ou publicidade de terceiros instalados;
- eventos B2B são emitidos por uma camada neutra (`labtech:analytics`) e só chegam a `dataLayer` quando uma ferramenta aprovada já estiver presente;
- não são enviados dados pessoais nos eventos;
- headers de segurança, CSP, proteção contra framing e `no-store` na API estão configurados;
- o limitador em memória é de melhor esforço e deve ser substituído antes de entrega automática distribuída.
