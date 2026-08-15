export type Category = {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  initialEditable: true;
};

export type Product = {
  slug: string;
  name: string;
  category: Category["slug"];
  summary: string;
  description: string;
  applications: string[];
  image: string;
  featured?: boolean;
};

export const categories: Category[] = [
  { slug: "coleta-e-acondicionamento", name: "Coleta e acondicionamento", shortName: "Coleta", description: "Tubos, recipientes, itens de transferência e acessórios para organizar a rotina pré-analítica.", initialEditable: true },
  { slug: "equipamentos-laboratoriais", name: "Equipamentos laboratoriais", shortName: "Equipamentos", description: "Soluções de bancada, processamento, medição e apoio para diferentes ambientes técnicos.", initialEditable: true },
  { slug: "reagentes-e-kits", name: "Reagentes e kits", shortName: "Reagentes", description: "Linhas para rotinas analíticas, controles e investigação laboratorial, sempre sob confirmação técnica.", initialEditable: true },
  { slug: "diagnostico-in-vitro", name: "Diagnóstico in vitro", shortName: "Diagnóstico", description: "Referências de IVD e testes rápidos organizadas por finalidade e contexto de uso.", initialEditable: true },
  { slug: "microbiologia", name: "Microbiologia", shortName: "Microbiologia", description: "Meios, recipientes, materiais de inoculação e apoio a fluxos microbiológicos.", initialEditable: true },
  { slug: "hematologia-e-bioquimica", name: "Hematologia e bioquímica", shortName: "Hematologia", description: "Itens e linhas de trabalho para rotinas hematológicas, bioquímicas e de coagulação.", initialEditable: true },
  { slug: "vidrarias-e-plasticos", name: "Vidrarias e plásticos", shortName: "Vidrarias", description: "Materiais de uso recorrente para preparo, medição, transferência e armazenamento.", initialEditable: true },
  { slug: "microscopia-e-imagem", name: "Microscopia e imagem", shortName: "Microscopia", description: "Sistemas, acessórios e consumíveis para observação e documentação de rotina.", initialEditable: true },
  { slug: "armazenamento-e-organizacao", name: "Armazenamento e transporte", shortName: "Armazenamento", description: "Organização, identificação, conservação e transporte interno de materiais e amostras.", initialEditable: true },
  { slug: "biosseguranca-e-hospitalares", name: "Esterilização e biossegurança", shortName: "Biossegurança", description: "Itens de proteção, limpeza técnica, descarte e apoio a ambientes controlados.", initialEditable: true },
  { slug: "materiais-hospitalares", name: "Materiais hospitalares", shortName: "Hospitalares", description: "Consumíveis e materiais de apoio para clínicas, hospitais e serviços de saúde.", initialEditable: true },
];

export const products: Product[] = [
  { slug: "linha-de-coleta-e-acondicionamento", name: "Linha de coleta e acondicionamento", category: "coleta-e-acondicionamento", summary: "Tubos, recipientes e acessórios para estruturar etapas de coleta e identificação.", description: "Linha para consulta técnica. Material, volume, aditivo, esterilidade e compatibilidade devem ser confirmados conforme a finalidade indicada e o protocolo da instituição.", applications: ["Coleta de amostras", "Identificação", "Acondicionamento"], image: "/images/recipientes.svg", featured: true },
  { slug: "itens-para-transferencia", name: "Itens para transferência", category: "coleta-e-acondicionamento", summary: "Soluções para manipulação e transferência controlada de líquidos e materiais.", description: "Grupo de produtos sob consulta. Capacidade, graduação, material e uso pretendido variam conforme a configuração selecionada.", applications: ["Transferência", "Preparo", "Rotina pré-analítica"], image: "/images/transferencia.svg" },
  { slug: "equipamentos-de-bancada", name: "Equipamentos de bancada", category: "equipamentos-laboratoriais", summary: "Agitadores, homogeneizadores e equipamentos de apoio para rotinas técnicas.", description: "Linha demonstrativa para levantamento de necessidade. Capacidade, faixa de operação, alimentação e demais especificações são confirmadas na consulta.", applications: ["Preparo de amostras", "Homogeneização", "Apoio de bancada"], image: "/images/homogeneizacao.svg", featured: true },
  { slug: "centrifugacao-e-processamento", name: "Centrifugação e processamento", category: "equipamentos-laboratoriais", summary: "Equipamentos e acessórios para etapas de separação e processamento de rotina.", description: "A escolha depende de rotor, recipiente, capacidade, velocidade e finalidade de uso. A adequação é confirmada tecnicamente antes do fornecimento.", applications: ["Separação", "Processamento", "Rotinas clínicas e de pesquisa"], image: "/images/processo.svg" },
  { slug: "reagentes-kits-e-controles", name: "Reagentes, kits e controles", category: "reagentes-e-kits", summary: "Linhas para diferentes metodologias, controles e necessidades analíticas.", description: "Produtos e configurações sob consulta. Metodologia, apresentação, armazenamento, validade e finalidade indicada pelo fabricante devem ser confirmados por item.", applications: ["Rotina analítica", "Controle", "Preparo de ensaios"], image: "/images/medicao.svg", featured: true },
  { slug: "linha-de-diagnostico-in-vitro", name: "Linha de diagnóstico in vitro", category: "diagnostico-in-vitro", summary: "Referências de IVD e testes rápidos organizadas para consulta institucional.", description: "A indicação, o desempenho, a classe de risco e a regularização aplicável variam por produto e são confirmados a partir da documentação do fabricante.", applications: ["Triagem", "Apoio ao diagnóstico", "Rotinas institucionais"], image: "/images/medicao.svg" },
  { slug: "microbiologia-e-cultura", name: "Microbiologia e cultura", category: "microbiologia", summary: "Meios, placas, recipientes e consumíveis para fluxos microbiológicos.", description: "A seleção considera o tipo de rotina, a finalidade pretendida e os requisitos de armazenamento e processamento informados pela instituição.", applications: ["Microbiologia", "Cultura", "Preparo e inoculação"], image: "/images/recipientes.svg" },
  { slug: "hematologia-bioquimica-e-coagulacao", name: "Hematologia, bioquímica e coagulação", category: "hematologia-e-bioquimica", summary: "Linhas de apoio para diferentes metodologias e equipamentos de análise.", description: "Compatibilidade com equipamento, metodologia, apresentação e finalidade são avaliadas individualmente durante o atendimento técnico-comercial.", applications: ["Hematologia", "Bioquímica", "Coagulação"], image: "/images/medicao.svg" },
  { slug: "vidrarias-e-plasticos-de-laboratorio", name: "Vidrarias e plásticos de laboratório", category: "vidrarias-e-plasticos", summary: "Recipientes e utensílios para preparo, medição, transferência e armazenamento.", description: "Material, capacidade, graduação, tolerância e resistência devem ser definidos de acordo com a aplicação e o procedimento adotado.", applications: ["Medição", "Preparo", "Armazenamento"], image: "/images/transferencia.svg" },
  { slug: "microscopia-e-observacao", name: "Microscopia e observação", category: "microscopia-e-imagem", summary: "Sistemas e acessórios para observação, registro e documentação de rotina.", description: "A configuração adequada depende do tipo de amostra, técnica de observação, ampliação e recursos de documentação necessários.", applications: ["Observação", "Microscopia", "Documentação"], image: "/images/observacao.svg" },
  { slug: "armazenamento-organizacao-e-transporte", name: "Armazenamento, organização e transporte", category: "armazenamento-e-organizacao", summary: "Soluções para identificar, organizar, conservar e movimentar materiais.", description: "Temperatura, capacidade, material, vedação e compatibilidade são definidos conforme o conteúdo e as condições reais de uso.", applications: ["Organização", "Conservação", "Transporte interno"], image: "/images/armazenamento.svg" },
  { slug: "esterilizacao-e-biosseguranca", name: "Esterilização e biossegurança", category: "biosseguranca-e-hospitalares", summary: "Itens de proteção, limpeza técnica, descarte e controle de ambiente.", description: "O enquadramento e o uso correto dependem da finalidade indicada pelo fabricante, do ambiente e do protocolo de biossegurança da instituição.", applications: ["Biossegurança", "Descarte", "Ambientes controlados"], image: "/images/preparo.svg" },
  { slug: "consumiveis-hospitalares", name: "Consumíveis hospitalares", category: "materiais-hospitalares", summary: "Materiais de apoio para hospitais, clínicas, ambulatórios e serviços de saúde.", description: "Linha ampla sob consulta. Tamanho, material, esterilidade, embalagem, finalidade de uso e regularização aplicável são confirmados por produto.", applications: ["Rotina assistencial", "Apoio clínico", "Suprimentos institucionais"], image: "/images/organizador.svg" },
];

export function getCategory(slug: string) {
  return categories.find((category) => category.slug === slug);
}

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}
