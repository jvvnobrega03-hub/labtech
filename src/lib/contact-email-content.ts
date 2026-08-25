export type ContactEmailInput = {
  name: string;
  email: string;
  organization: string;
  context: string;
  phone: string;
};

export type ContactEmailContent = {
  from: string;
  to: string;
  replyTo: string;
  subject: string;
  text: string;
  html: string;
};

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function subjectFromContext(context: string): string {
  const [subject] = context.split(":", 1);
  return subject?.trim().slice(0, 90) || "Nova mensagem";
}

export function buildContactEmail(
  data: ContactEmailInput,
  options: { recipient: string; sender: string },
): ContactEmailContent {
  const subject = `[Site Labtech] ${subjectFromContext(data.context)}`;
  const organization = data.organization || "Não informada";
  const phone = data.phone || "Não informado";
  const safe = {
    name: escapeHtml(data.name),
    email: escapeHtml(data.email),
    organization: escapeHtml(organization),
    phone: escapeHtml(phone),
    context: escapeHtml(data.context),
  };

  return {
    from: options.sender,
    to: options.recipient,
    replyTo: data.email,
    subject,
    text: [
      "Nova mensagem enviada pelo site da Labtech",
      "",
      `Nome: ${data.name}`,
      `Empresa: ${organization}`,
      `E-mail: ${data.email}`,
      `Telefone: ${phone}`,
      "",
      "Mensagem:",
      data.context,
    ].join("\n"),
    html: `
      <div style="background:#f4fbfd;padding:32px 16px;font-family:Arial,sans-serif;color:#102833">
        <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #d8eef5;padding:32px">
          <p style="margin:0 0 10px;color:#087a9f;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase">Contato pelo site</p>
          <h1 style="margin:0 0 28px;font-size:26px;line-height:1.2">Nova mensagem para a Labtech</h1>
          <table role="presentation" style="width:100%;border-collapse:collapse;font-size:15px;line-height:1.6">
            <tr><td style="width:110px;padding:7px 0;color:#526b75">Nome</td><td style="padding:7px 0;font-weight:700">${safe.name}</td></tr>
            <tr><td style="padding:7px 0;color:#526b75">Empresa</td><td style="padding:7px 0">${safe.organization}</td></tr>
            <tr><td style="padding:7px 0;color:#526b75">E-mail</td><td style="padding:7px 0"><a href="mailto:${safe.email}" style="color:#087a9f">${safe.email}</a></td></tr>
            <tr><td style="padding:7px 0;color:#526b75">Telefone</td><td style="padding:7px 0">${safe.phone}</td></tr>
          </table>
          <div style="margin-top:24px;border-top:1px solid #d8eef5;padding-top:24px">
            <p style="margin:0 0 8px;color:#526b75;font-size:13px;font-weight:700;text-transform:uppercase">Mensagem</p>
            <p style="margin:0;white-space:pre-wrap;font-size:15px;line-height:1.7">${safe.context}</p>
          </div>
          <p style="margin:28px 0 0;color:#6f8790;font-size:12px">Responda diretamente a este e-mail para falar com ${safe.name}.</p>
        </div>
      </div>
    `.trim(),
  };
}
