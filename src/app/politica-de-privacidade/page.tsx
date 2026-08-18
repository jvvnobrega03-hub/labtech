import { PageHero } from "@/components/ui";
import { companyConfig } from "@/lib/config";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Política de privacidade", "Entenda como os formulários e a cotação local da Labtech tratam informações.", "/politica-de-privacidade");

export default function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="Privacidade" title="Transparência no tratamento de informações." description="Esta política descreve o comportamento atual dos formulários e da seleção local de produtos." />
      <article className="prose-lab shell max-w-3xl py-20">
        <p>O site valida os dados informados nos formulários antes de direcionar o usuário aos canais comerciais. A validação não persiste nem encaminha automaticamente o conteúdo e não comprova recebimento pela Labtech.</p>
        <h2>Controlador e contato</h2>
        <p>{companyConfig.legalName}, CNPJ {companyConfig.cnpj}. Dúvidas relacionadas a privacidade podem ser encaminhadas para <a href={`mailto:${companyConfig.email}`}>{companyConfig.email}</a>.</p>
        <h2>Dados solicitados</h2>
        <p>Os formulários podem solicitar nome, e-mail, telefone, instituição, contexto da mensagem e itens selecionados. Não envie dados pessoais sensíveis, dados clínicos, informações de pacientes, credenciais ou segredos industriais.</p>
        <h2>Finalidade e envio</h2>
        <p>Os dados são processados transitoriamente para validar formato, tamanho, consentimento e integridade básica. O envio somente ocorre quando o usuário confirma a mensagem no WhatsApp, no e-mail ou em outro canal escolhido.</p>
        <h2>Armazenamento local</h2>
        <p>A seleção de itens para cotação é mantida no armazenamento local do navegador. Ela pode ser removida pelo botão de limpar, ao concluir o envio pelo WhatsApp ou ao apagar os dados do navegador.</p>
        <h2>Cookies e medição</h2>
        <p>O projeto atual não instala plataforma de analytics, publicidade ou rastreamento de terceiros. Por isso, não é exibido um banner genérico de cookies.</p>
        <h2>Proteção e limites</h2>
        <p>A limitação de frequência da API opera em memória e reduz abuso simples. Antes de habilitar entrega ou persistência automática, será necessário adotar proteção distribuída, política de retenção e infraestrutura aprovadas.</p>
        <h2>Direitos e revisão</h2>
        <p>Solicitações sobre acesso, correção ou eliminação de dados efetivamente recebidos por canais comerciais devem ser encaminhadas ao contato acima. Esta política deve ser revisada quando houver nova integração, analytics, persistência ou mudança no tratamento.</p>
      </article>
    </>
  );
}
