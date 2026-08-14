# Prompt de execução — melhorias Labtech

Atue como Principal Software Engineer responsável por modernizar incrementalmente o projeto Labtech. Leia e siga integralmente o `AGENTS.md` e a documentação da versão instalada do Next.js antes de editar. Preserve o trabalho atual e não reverta alterações existentes.

## Objetivo

Elevar o site a um nível mais seguro, acessível, performático, SEO-friendly, testável e preparado para produção, preservando integralmente a identidade visual, o conteúdo em pt-BR, as rotas, o catálogo, o fluxo de orçamento e o comportamento demonstrativo atual.

## Escopo autorizado

- Corrigir ambiente e SEO para nunca publicar canonical ou sitemap apontando para `localhost`. Sem URL pública verificada, omitir canonical absoluto e impedir indexação; documentar as variáveis em `.env.example`.
- Adicionar metadados sociais coerentes, sem inventar informações comerciais.
- Tornar JSON-LD consistente e seguro, usando URLs absolutas somente quando configuradas.
- Adicionar cabeçalhos de segurança compatíveis com Next.js, desenvolvimento e produção.
- Melhorar `POST /api/contato` mantendo-o apenas como validação demonstrativa: contratos tipados, validação centralizada, limite de tamanho, verificação de `Content-Type`, respostas `no-store`, erros previsíveis e testes unitários.
- Manter explícito que nenhuma mensagem é enviada, persistida ou recebida.
- Reduzir JavaScript cliente separando conteúdo estático de controles interativos, sem regressão visual ou funcional.
- Melhorar foco, teclado, Escape, ARIA e restauração de foco no menu móvel, filtros e gaveta de orçamento.
- Consolidar tokens visuais sem alterar paleta, tipografia, espaçamento, responsividade ou animações.
- Remover somente assets comprovadamente não utilizados.
- Atualizar o README com arquitetura, configuração, scripts e comportamento demonstrativo.
- Adicionar testes leves e configurar `typegen`, `typecheck`, lint, testes e build de produção.

## Fora de escopo

- Não instalar nem integrar CRM.
- Não integrar APIs externas de e-mail, WhatsApp, analytics, marketing, CMS ou autenticação.
- Não criar banco de dados, painel administrativo ou persistência.
- Não inventar telefone, e-mail, endereço, domínio, certificações, marcas, preços, disponibilidade, depoimentos ou outras informações empresariais.
- Não alterar URLs, branding, design ou conteúdo comercial sem necessidade técnica.
- Não simular entrega de formulários.

## Critérios de aceite

1. Todas as rotas e o fluxo de seleção e orçamento permanecem funcionais.
2. Sem URL pública, o site não aponta SEO para `localhost` e permanece `noindex`.
3. A API valida os dados, mas jamais simula entrega.
4. O JavaScript cliente é reduzido onde possível.
5. Diálogos e menu têm gerenciamento de foco robusto.
6. Typecheck, lint, testes e build passam.
7. Nenhum segredo ou integração externa é adicionado.

Implemente de forma incremental, mantenha o projeto executável e reporte arquivos alterados, decisões importantes, verificações e dívida técnica restante.
