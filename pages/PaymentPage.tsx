
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Card from '../components/Card';

interface PixData {
    paymentId: string;
    qrCodeBase64: string;
    qrCodeCopyPaste: string;
}

const PaymentPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pixData, setPixData] = useState<PixData | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  // Refs para controle do Polling
  const pollingInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const name = searchParams.get('name');
  const calories = searchParams.get('calories');
  const email = localStorage.getItem('user_email');

  // Função para verificar o status do pagamento (Polling)
  const checkPaymentStatus = async (paymentId: string) => {
      try {
          const res = await fetch(`/api/check-payment?id=${paymentId}`);
          const data = await res.json();

          console.log("Status do pagamento:", data.status);

          if (data.status === 'approved') {
              // Para o polling
              if (pollingInterval.current) clearInterval(pollingInterval.current);
              // Redireciona para sucesso
              navigate(`/payment/success?${searchParams.toString()}`);
          }
      } catch (err) {
          console.error("Erro ao verificar status:", err);
      }
  };

  // Efeito para iniciar o Polling quando tivermos o PixData
  useEffect(() => {
      if (pixData?.paymentId) {
          // Verifica imediatamente
          checkPaymentStatus(pixData.paymentId);

          // Configura intervalo de 5 segundos
          pollingInterval.current = setInterval(() => {
              checkPaymentStatus(pixData.paymentId);
          }, 5000);

          // Limpeza ao desmontar
          return () => {
              if (pollingInterval.current) clearInterval(pollingInterval.current);
          };
      }
  }, [pixData, navigate, searchParams]);

  const handleGeneratePix = async () => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'FitCalc Premium - Plano Personalizado',
          price: 7.90,
          name, 
          email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Exibe erro detalhado se disponível
        const msg = data.details ? `${data.error} (${data.details})` : (data.error || 'Falha ao gerar PIX');
        throw new Error(msg);
      }

      if (data.success && data.qrCodeBase64) {
          setPixData(data);
      } else {
          throw new Error('Dados do PIX inválidos retornados pela API');
      }

    } catch (err: any) {
      console.error("Erro no processo de pagamento:", err);
      setError(err.message || 'Ocorreu um erro. Por favor, tente novamente.');
    } finally {
        setIsProcessing(false);
    }
  };

  const copyToClipboard = () => {
      if (pixData?.qrCodeCopyPaste) {
          navigator.clipboard.writeText(pixData.qrCodeCopyPaste);
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 3000);
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
        <p className="mt-2 text-lg text-gray-600">
            {pixData ? 'Escaneie o QR Code abaixo para liberar seu plano.' : 'Gere seu PIX para liberar seu plano personalizado.'}
        </p>
      </div>
      
      <Card className="mt-10 p-8 shadow-2xl border-t-4 border-teal-500">
        {!pixData ? (
            <>
                <h2 className="text-xl font-bold text-center text-gray-800">Resumo do Pedido</h2>
                <div className="mt-6 border-t border-b border-gray-200 py-6 space-y-4">
                    <div className="flex justify-between items-center text-gray-700">
                        <span>FitCalc Premium</span>
                        <span className="font-semibold">R$ 7,90</span>
                    </div>
                </div>
                <div className="flex justify-between items-center text-xl font-bold mt-6 mb-8">
                    <span>Total</span>
                    <span className="text-teal-600">R$ 7,90</span>
                </div>

                <button
                    onClick={handleGeneratePix}
                    disabled={isProcessing}
                    className="w-full flex justify-center py-4 px-4 border border-transparent rounded-full shadow-lg text-lg font-bold text-white bg-gradient-to-r from-teal-500 to-cyan-600 hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isProcessing ? 'Gerando PIX...' : 'Gerar PIX e Pagar'}
                </button>
                {error && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-sm text-center text-red-600 font-medium">{error}</p>
                        <p className="text-xs text-center text-red-400 mt-1">Se o erro persistir, verifique se as chaves do Mercado Pago estão corretas na Vercel.</p>
                    </div>
                )}
                
                <div className="mt-6 text-center flex items-center justify-center gap-2 text-gray-500 text-sm">
                     <svg className="w-5 h-5 text-teal-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                     Ambiente seguro
                </div>
            </>
        ) : (
            <div className="flex flex-col items-center animate-fade-in">
                <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-bold mb-6">
                    Aguardando Pagamento...
                </div>
                
                <div className="p-4 bg-white border-2 border-gray-200 rounded-xl shadow-inner mb-6">
                    {/* Exibe a imagem Base64 do QR Code */}
                    <img 
                        src={`data:image/png;base64,${pixData.qrCodeBase64}`} 
                        alt="QR Code PIX" 
                        className="w-64 h-64 object-contain"
                    />
                </div>

                <p className="text-sm text-gray-500 text-center mb-4">
                    Abra o app do seu banco, escolha <strong>PIX &gt; Ler QR Code</strong> e aponte a câmera.
                </p>

                <div className="w-full relative mb-6">
                     <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Ou use o Copia e Cola</span>
                    </div>
                </div>

                <button
                    onClick={copyToClipboard}
                    className={`w-full flex items-center justify-center py-3 px-4 border rounded-lg shadow-sm text-sm font-bold transition-all duration-200 ${
                        copySuccess 
                        ? 'bg-green-500 text-white border-green-500' 
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                >
                    {copySuccess ? (
                        <>
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            Copiado com sucesso!
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                            Copiar Código PIX
                        </>
                    )}
                </button>

                <div className="mt-8 flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s'}}></div>
                    <span className="text-xs text-gray-500 ml-2">Verificando automaticamente...</span>
                </div>
            </div>
        )}
      </Card>
      
      <style>{`
        @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
            animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default PaymentPage;
