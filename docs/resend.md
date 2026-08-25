# Envio do formulário de contato com Resend

O formulário da rota `/contato` envia mensagens pelo Route Handler
`POST /api/contato`. A chave do provedor permanece somente no servidor e o
destinatário configurado para produção é `site@labtech.com.br`.

## 1. Criar e verificar o domínio

1. Acesse a [documentação oficial do Resend](https://resend.com/docs) e entre
   ou crie a conta da Labtech.
2. Em **Domains**, adicione `labtech.com.br`.
3. Cadastre no provedor de DNS todos os registros exibidos pelo Resend,
   incluindo SPF e DKIM.
4. Aguarde o domínio aparecer como **Verified**. Não use
   `site@labtech.com.br` como remetente antes dessa confirmação.

Referências oficiais:

- [Domínios no Resend](https://resend.com/domains)
- [Guia Resend para Next.js](https://resend.com/docs/send-with-nextjs)
- [Resend no Vercel Marketplace](https://vercel.com/marketplace/resend)

## 2. Criar a chave de envio

No painel do Resend, crie uma API key com permissão de envio para o domínio da
Labtech. Copie a chave no momento da criação. Ela não deve ser colocada em um
arquivo versionado e nunca deve usar o prefixo `NEXT_PUBLIC_`.

## 3. Configurar a Vercel manualmente

No projeto **labtech** da Vercel, abra **Settings → Environment Variables** e
adicione estas variáveis ao ambiente **Production**:

```text
RESEND_API_KEY=re_...
CONTACT_EMAIL_TO=site@labtech.com.br
CONTACT_EMAIL_FROM=Labtech <site@labtech.com.br>
```

- `RESEND_API_KEY` deve ser marcada como sensível/secret.
- `CONTACT_EMAIL_TO` controla o endereço que recebe as mensagens. Para trocar
  o destino futuramente, altere somente essa variável.
- `CONTACT_EMAIL_FROM` precisa usar um endereço pertencente ao domínio
  verificado no Resend.

Depois de salvar as variáveis, faça um novo deploy de produção. Variáveis
adicionadas depois de um deploy não entram automaticamente naquele build já
existente.

## 4. Configuração local opcional

Crie `.env.local` sem versioná-lo:

```text
RESEND_API_KEY=re_...
CONTACT_EMAIL_TO=site@labtech.com.br
CONTACT_EMAIL_FROM="Labtech <site@labtech.com.br>"
```

O arquivo `.env.example` contém apenas os nomes e valores não secretos de
referência.

## 5. Validar o funcionamento

1. Reabra `/contato` após o novo deploy.
2. Preencha todos os campos e clique em **Enviar mensagem**.
3. Confirme a tela **Mensagem enviada**.
4. Verifique o recebimento em `site@labtech.com.br` e a atividade no painel do
   Resend.
5. Responda à mensagem para confirmar que o `Reply-To` aponta para o e-mail
   informado pelo visitante.

O sistema só mostra sucesso quando o Resend aceita a mensagem e devolve um ID.
Se a chave estiver ausente, o domínio não estiver verificado ou o provedor
recusar a requisição, o formulário mantém os dados preenchidos e exibe uma
mensagem de indisponibilidade, sem afirmar falsamente que houve entrega.

## Solução de problemas

- **Erro de autenticação:** confirme `RESEND_API_KEY` e gere outra chave se
  necessário.
- **Remetente ou domínio rejeitado:** confirme que `labtech.com.br` está
  `Verified` e que `CONTACT_EMAIL_FROM` pertence a esse domínio.
- **Funciona localmente, mas não na Vercel:** confirme o escopo **Production** e
  faça um novo deploy depois de salvar a variável.
- **Destino incorreto:** ajuste `CONTACT_EMAIL_TO`; não altere o código-fonte.

