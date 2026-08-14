# Labtech

Site institucional B2B demonstrativo para apresentação de soluções laboratoriais, construído com Next.js 16 (App Router), React 19, TypeScript e Tailwind CSS 4. Todo o conteúdo público está em pt-BR.

## Comportamento atual

- Catálogo local com pesquisa e filtros por categoria.
- Seleção de itens e quantidades persistida somente no `localStorage` do navegador.
- Fluxos de contato e orçamento validados pelo servidor, sem envio, persistência, CRM ou integração externa.
- O protocolo de orçamento é demonstrativo, gerado no navegador e não comprova recebimento.
- Conteúdo de produtos em `src/data/products.ts`; não há CMS ou painel administrativo.

## Arquitetura

- `src/app`: páginas, metadados, sitemap, robots e Route Handler.
- `src/components`: componentes de servidor e ilhas interativas de catálogo, formulários e orçamento.
- `src/data`: catálogo estático.
- `src/lib`: configuração de ambiente, metadados e núcleo tipado de validação.
- `tests`: testes unitários do contrato de validação.

Componentes estáticos, como rodapé, navegação desktop e estrutura dos cards, são renderizados no servidor. Somente controles que dependem de estado, navegador ou eventos são Client Components.

## Requisitos e execução

Use Node.js 22.18 ou mais recente. A versão mínima aqui também permite executar testes TypeScript com o test runner nativo, sem dependência adicional.

```bash
npm ci
npm run dev
```

Abra `http://localhost:3000`. O servidor de desenvolvimento atualiza a página conforme os arquivos são editados.

## Ambiente e SEO

Copie `.env.example` para `.env.local` apenas quando houver valores verificados. `NEXT_PUBLIC_SITE_URL` deve conter a origem pública HTTPS sem barra final, por exemplo `https://site.exemplo`.

Enquanto essa variável estiver ausente, inválida ou apontar para uma origem local:

- URLs canônicas absolutas são omitidas;
- o sitemap fica vazio;
- `robots.txt` bloqueia rastreamento;
- os metadados usam `noindex, nofollow`.

Isso evita publicar referências acidentais a `localhost`. E-mail e WhatsApp são opcionais e só devem ser configurados com dados comerciais confirmados.

O cartão social está disponível em `public/og.png` e é incluído nos metadados Open Graph e X somente quando a URL pública HTTPS estiver configurada.

## Scripts

```bash
npm run dev        # desenvolvimento
npm run typegen    # gera os tipos de rotas do Next.js
npm run typecheck  # executa typegen e TypeScript estrito
npm run lint       # ESLint
npm test           # testes unitários nativos
npm run build      # build de produção
npm run build:cloudflare # build do adaptador OpenNext
npm run build:sites # prepara dist/server e dist/assets para o Sites
npm run verify     # typecheck, lint, testes e build
```

## Rota demonstrativa

`POST /api/contato` aceita somente `application/json`, limita o corpo a 32 KiB, sanitiza e valida os campos e responde sempre com `Cache-Control: no-store`. Uma resposta válida declara explicitamente `persisted: false` e `delivered: false`.

O limitador de tentativas em memória é apenas uma proteção de melhor esforço para esta demonstração. Em uma implantação distribuída ele não substitui um controle centralizado na borda ou em armazenamento compartilhado.

## Publicação

Antes de publicar:

1. Configure `NEXT_PUBLIC_SITE_URL` com o domínio HTTPS definitivo.
2. Execute `npm ci` e `npm run verify` no mesmo ambiente da publicação.
3. Confira `/robots.txt`, `/sitemap.xml`, canonical e cabeçalhos de segurança na URL publicada.
4. Mantenha os textos de ambiente demonstrativo até existir um canal real de entrega aprovado.

Nenhum segredo, banco de dados, analytics, CRM, CMS ou serviço externo é necessário para executar o projeto atual.
