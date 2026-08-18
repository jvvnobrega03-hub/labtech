# Redirects de migração

| URL antiga | URL atual | Motivo |
| --- | --- | --- |
| `/categoria-produto/:slug` | `/catalogo/:slug` | Preserva o slug da categoria na nova arquitetura. |
| `/produto/:slug` | `/produtos/:slug` | Migra a rota singular quando o slug já é conhecido. |
| `/nossa-essencia` | `/missao-visao-valores` | Consolida a página institucional existente. |

Não foi criado redirect para `/produto/:id` porque o repositório não contém uma tabela histórica confiável entre IDs e slugs. Essa migração requer dados reais antes de ser publicada.
