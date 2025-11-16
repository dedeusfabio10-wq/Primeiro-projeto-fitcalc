// Este arquivo é um EXEMPLO de como sua API (Função Serverless da Vercel)
// para enviar e-mails deve ser. Crie um arquivo chamado `send-email.ts`
// dentro da pasta `/api` na raiz do seu projeto quando for fazer o deploy.
//
// ESTE CÓDIGO NÃO SERÁ EXECUTADO DIRETAMENTE PELO APP ATUAL.
// Ele serve como um guia para o seu backend.

/*
// --- INÍCIO DO CÓDIGO DE EXEMPLO PARA /api/send-email.ts ---

import { Resend } from 'resend';

// Esta é a função principal que a Vercel executará.
export default async function handler(req, res) {
  // Permite apenas requisições do tipo POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // ========================================================================
  // VARIÁVEL DE AMBIENTE: RESEND_API_KEY
  // ========================================================================
  // Configure sua Chave de API do Resend nas "Environment Variables" 
  // do seu projeto na Vercel. NUNCA exponha esta chave no código do frontend.
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    console.error("Resend API Key não encontrada.");
    return res.status(500).json({ error: 'Credenciais de e-mail não configuradas no servidor.' });
  }

  const resend = new Resend(resendApiKey);

  try {
    // Extrai os dados do corpo da requisição enviada pelo frontend.
    const { userEmail, userName, htmlPlan, searchParamsString } = req.body;

    if (!userEmail || !userName || !htmlPlan || !searchParamsString) {
      return res.status(400).json({ error: 'Dados incompletos para envio do e-mail.' });
    }
    
    // ========================================================================
    // VARIÁVEL DE AMBIENTE: NEXT_PUBLIC_BASE_URL
    // ========================================================================
    // Configure a URL base do seu site também como uma variável de ambiente.
    // Ex: NEXT_PUBLIC_BASE_URL=https://seusite.vercel.app
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const planUrl = `${baseUrl}/#/plano?${searchParamsString}`;

    const { data, error } = await resend.emails.send({
      // Em produção, substitua por um domínio verificado no Resend para melhor entrega (ex: 'FitCalc <contato@fitcalc.app>')
      from: 'FitCalc <onboarding@resend.dev>',
      to: [userEmail],
      subject: 'Seu Plano Personalizado • FitCalc',
      html: `
        <div style="font-family: 'Poppins', Arial, sans-serif; color: #334155; line-height: 1.6;">
            <p>Olá, ${userName}! 👋</p>
            <p>Seu pagamento foi aprovado com sucesso! 🎉</p>
            <p>Conforme prometido, aqui está o seu <strong>Plano Personalizado de Emagrecimento de 7 Dias</strong>. Ele foi gerado com base nas informações que você forneceu.</p>
            <p>Você pode consultá-lo sempre que quiser aqui neste e-mail. Também recomendamos que visite a página do plano em nosso site para <strong>baixar a versão em PDF</strong>.</p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
            ${htmlPlan}
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
            <p style="text-align: center; font-size: 14px;">
                <strong>Deseja fazer o download do PDF?</strong><br>
                Acesse a <a href="${planUrl}" target="_blank" style="color: #0d9488; text-decoration: none; font-weight: bold;">sua página do plano</a> para baixar o arquivo.
            </p>
            <p style="margin-top: 20px;">Estamos com você na sua jornada!</p>
            <p><strong>Equipe FitCalc 💛</strong></p>
        </div>
      `,
    });

    if (error) {
      console.error("Erro do Resend:", error);
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json({ message: 'E-mail enviado com sucesso!', data });

  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    res.status(500).json({ error: 'Falha ao enviar o e-mail.' });
  }
}

// --- FIM DO CÓDIGO DE EXEMPLO ---
*/