import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Card from '../components/Card';

const PaymentPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const name = searchParams.get('name');
  const calories = searchParams.get('calories');
  const email = localStorage.getItem('user_email');

  const handlePayment = async () => {
    setIsProcessing(true);
    setError(null);
    console.log("Iniciando processo de pagamento real com Mercado Pago...");

    try {
      // 1. Chama a API backend para criar a preferência de pagamento.
      const response = await fetch('/api/payment/createPreference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao criar preferência de pagamento');
      }

      const data = await response.json();
      const { init_point } = data;

      // 2. Redireciona o usuário para o Checkout do Mercado Pago.
      if (init_point) {
        window.location.href = init_point;
      } else {
        throw new Error('URL de checkout não recebida do servidor');
      }

    } catch (err: any) {
      console.error("Erro no processo de pagamento:", err);
      setError(err.message || 'Ocorreu um erro. Por favor, tente novamente.');
      setIsProcessing(false);
    }
  };

  if (!name || !calories || !email) {
      return (
        <div className="max-w-md mx-auto py-12 px-4 text-center">
            <h1 className="text-2xl font-bold text-red-600">Erro: Dados Incompletos</h1>
            <p className="text-gray-600 mt-2">Não foi possível encontrar seu e-mail ou dados do plano. Por favor, volte e calcule novamente.</p>
        </div>
      )
  }

  return (
    <div className="max-w-md mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">Quase lá, {name}!</h1>
        <p className="mt-2 text-lg text-gray-600">Complete o pagamento para desbloquear seu plano personalizado.</p>
      </div>
      
      <Card className="mt-10 p-8 shadow-2xl">
        <h2 className="text-xl font-bold text-center text-gray-800">Resumo do Pedido</h2>
        <div className="mt-6 border-t border-b border-gray-200 py-6 space-y-4">
            <div className="flex justify-between items-center text-gray-700">
                <span>FitCalc Premium - Plano Personalizado</span>
                <span className="font-semibold">R$ 7,90</span>
            </div>
            <div className="flex justify-between items-center text-gray-700">
                <span className="text-sm">Acesso vitalício ao plano e PDF</span>
            </div>
        </div>
        <div className="flex justify-between items-center text-xl font-bold mt-6">
            <span>Total</span>
            <span>R$ 7,90</span>
        </div>

        <div className="mt-8">
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full flex justify-center py-4 px-4 border border-transparent rounded-full shadow-lg text-lg font-bold text-white bg-gradient-to-r from-teal-500 to-cyan-600 hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
                <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processando...
                </>
            ) : 'Pagar com Mercado Pago'}
          </button>
          {error && <p className="mt-2 text-xs text-center text-red-600">{error}</p>}
        </div>
        <div className="mt-6 text-center text-xs text-gray-500">
            <p>🔒 Pagamento seguro via Mercado Pago.</p>
        </div>
      </Card>
    </div>
  );
};

export default PaymentPage;