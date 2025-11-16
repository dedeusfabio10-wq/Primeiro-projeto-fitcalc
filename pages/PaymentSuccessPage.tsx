import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getPlanData } from '../services/planGenerator';
import { generatePlanHTML } from '../lib/planService';
import { sendPlanEmail } from '../lib/emailService';

const PaymentSuccessPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const processSuccess = async () => {
            try {
                // Define o status de pagamento como aprovado para liberar o acesso à página do plano.
                localStorage.setItem('payment_status', 'approved');

                // Envia o e-mail em segundo plano
                const email = localStorage.getItem('user_email');
                const name = searchParams.get('name');
                if (email && name) {
                    console.log("Payment success detected. Preparing to send email...");
                    // 1. Gera os dados estruturados do plano
                    const planData = getPlanData(searchParams);
                    // 2. Gera o HTML do plano para o e-mail
                    const generatedHtmlPlan = generatePlanHTML(planData);
                    // 3. Envia o e-mail com o Resend
                    await sendPlanEmail(email, name, generatedHtmlPlan, searchParams.toString());
                } else {
                     console.warn("E-mail ou nome não encontrado para envio do plano.");
                }

            } catch (e) {
                console.error("Falha ao processar sucesso do pagamento ou enviar e-mail:", e);
            } finally {
                // Redireciona o usuário para a página do plano, independentemente do sucesso do e-mail.
                console.log("Redirecting to plan page...");
                navigate(`/plano?${searchParams.toString()}`, { replace: true });
            }
        };

        processSuccess();
        
    }, [navigate, searchParams]);

    return (
        <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center p-4">
                <svg className="animate-spin mx-auto h-12 w-12 text-teal-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <h1 className="text-xl font-bold mt-4">Pagamento Aprovado!</h1>
                <p className="text-gray-600 mt-2">Aguarde, estamos preparando seu plano personalizado...</p>
            </div>
        </div>
    );
};

export default PaymentSuccessPage;