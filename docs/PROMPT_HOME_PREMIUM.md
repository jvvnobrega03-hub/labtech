# Prompt mestre — refinamento premium da página principal Labtech

Atue como um Principal Software Engineer e Senior Product Designer especializado em Next.js, React, TypeScript, UI premium, acessibilidade, performance e experiências B2B para saúde, laboratório e ambiente hospitalar.

Trabalhe exclusivamente na página principal da Labtech e nos componentes compartilhados somente quando o comportamento novo puder ser isolado à Home. Preserve integralmente as outras rotas, o catálogo, o orçamento, os formulários, o SEO existente, a acessibilidade e a identidade visual institucional.

## Objetivo

Elevar o acabamento da Home para que todas as seções continuem o universo visual da Hero cinematográfica, com a mesma percepção de precisão, tecnologia e confiança, sem transformar a interface em um site genérico, futurista em excesso ou promocional demais.

## Implementação obrigatória

1. Integrar visualmente o cabeçalho à Hero:
   - sobrepor o cabeçalho à primeira dobra apenas na Home;
   - usar uma aparência translúcida, clara e legível enquanto a Hero estiver sob o cabeçalho;
   - transformar suavemente o cabeçalho em sua aparência sólida ao final da Hero;
   - preservar menu móvel, busca, orçamento, foco de teclado e todas as demais páginas.

2. Refinar as seções da Home:
   - criar continuidade de cor, profundidade e espaçamento;
   - usar fundos profundos derivados da Hero, combinando azul clínico, ciano e verde institucional;
   - criar degradês controlados entre todas as áreas, sem cortes bruscos ou blocos desconectados;
   - preservar contraste forte para títulos, textos, formulários, cards e CTAs;
   - padronizar bordas, sombras, raios e microinterações;
   - evitar excesso de vidro, neon, grid técnico ou decoração.

3. Reforçar catálogo e conversão:
   - tornar busca e categorias mais fáceis de localizar;
   - melhorar hierarquia dos cards de produtos em destaque;
   - manter o fluxo categoria → produto → orçamento;
   - não alterar links, funcionamento do orçamento ou dados dos produtos.

4. Aumentar confiança sem criar alegações:
   - usar somente informações já verificáveis no projeto;
   - preservar “Desde 1997”, atendimento institucional, cobertura nacional e suporte especializado;
   - não inventar clientes, certificações, números, registros, marcas ou avaliações.

5. Refinar a Hero sem descaracterizá-la:
   - manter o vídeo como fundo não interativo em 100% da primeira tela;
   - preservar introdução, crossfade e loop da centrífuga;
   - evitar competição de download desnecessária entre introdução e loop;
   - respeitar economia de dados, falhas de autoplay e `prefers-reduced-motion`;
   - não permitir controles, Picture-in-Picture ou reprodução remota.

## Restrições

- Não adicionar CRM, API externa, autenticação ou banco de dados.
- Não criar fotografias fictícias de produtos médicos ou laboratoriais.
- Não modificar textos ou comportamentos das páginas internas.
- Não adicionar bibliotecas sem necessidade.
- Não introduzir CLS, reflow constante, listeners de rolagem contínuos ou conteúdo invisível sem JavaScript.
- Usar `IntersectionObserver`, CSS, `transform` e `opacity` quando houver interação visual.
- Manter a Home plenamente responsiva em desktop, tablet e mobile.

## Validação

Antes de concluir, execute geração de tipos, TypeScript, lint, testes e build de produção. Verifique o servidor local, a semântica da Home, a ausência de regressões nas rotas e a preservação dos fallbacks do vídeo.
