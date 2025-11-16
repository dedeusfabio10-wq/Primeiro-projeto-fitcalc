// --- Início do código da API /api/payment/createPreference.ts ---

// Este arquivo DEVE ser colocado na pasta /api/payment/ do seu projeto.
// Para funcionar, você precisará instalar o SDK do Mercado Pago no seu ambiente Vercel.
// Execute no seu terminal: npm install mercadopago

import { MercadoPagoConfig, Preference } from 'mercadopago';

// Esta é a função principal que a Vercel executará como uma Serverless Function.
export default async function handler(req, res) {
  // 1. Validação do Método da Requisição
  // Garante que apenas requisições POST sejam processadas.
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // ========================================================================
  // VARIÁVEIS DE AMBIENTE - CONFIGURE NA VERCEL
  // ========================================================================
  // Para segurança, seu Access Token NUNCA deve estar no código.
  // 1. Acesse seu projeto na Vercel.
  // 2. Vá para Settings -> Environment Variables.
  // 3. Crie a variável 'MERCADO_PAGO_ACCESS_TOKEN' com seu token.
  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
  
  // 4. Crie a variável 'NEXT_PUBLIC_BASE_URL' com a URL do seu site.
  //    Ex: https://meu-fitcalc.vercel.app
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  // ========================================================================

  if (!accessToken) {
    console.error("MERCADO_PAGO_ACCESS_TOKEN não configurado.");
    return res.status(500).json({ error: 'O servidor não está configurado para processar pagamentos.' });
  }

  // 2. Inicialização do Cliente do Mercado Pago
  const client = new MercadoPagoConfig({ accessToken });
  const preference = new Preference(client);

  try {
    // 3. Extração dos Dados do Frontend
    // Pega o nome e o e-mail enviados do formulário de pagamento.
    const { name, email } = req.body;
    
    if (!name || !email) {
        return res.status(400).json({ error: 'Nome e e-mail são obrigatórios.' });
    }

    // 4. Criação do Objeto da Preferência
    const preferenceData = {
      body: {
        items: [
          {
            id: 'fitcalc-premium-01',
            title: 'Plano Personalizado de 7 Dias',
            description: 'Acesso vitalício ao plano de emagrecimento e PDF.',
            quantity: 1,
            unit_price: 7.90,
            currency_id: 'BRL',
          },
        ],
        payer: {
          name: name,
          email: email,
        },
        // URLs para onde o Mercado Pago redirecionará o usuário.
        // O `/#/` é crucial por causa do HashRouter usado no frontend.
        back_urls: {
          success: `${baseUrl}/#/payment/success`,
          failure: `${baseUrl}/#/payment/failure`,
          pending: `${baseUrl}/#/payment/failure`,
        },
        // Redireciona automaticamente após o pagamento ser aprovado.
        auto_return: 'approved',
      },
    };

    // 5. Criação da Preferência na API do Mercado Pago
    const result = await preference.create(preferenceData);

    // 6. Retorno do Link de Checkout para o Frontend
    // O `init_point` é a URL de checkout para onde o usuário deve ser enviado.
    res.status(200).json({ init_point: result.init_point });

  } catch (error) {
    console.error('Erro ao criar preferência no Mercado Pago:', error);
    res.status(500).json({ error: 'Falha ao iniciar o processo de pagamento.' });
  }
}

// --- Fim do código da API ---
