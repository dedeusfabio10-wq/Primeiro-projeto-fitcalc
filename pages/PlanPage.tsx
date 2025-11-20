
import React, { useRef, useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import { 
    DietaryRestriction, 
    HealthCondition,
    economicProfileOptions,
} from '../types';
import { getPlanData, PlanData } from '../services/planGenerator';

interface MealPlan {
  day: string;
  meals: {
    breakfast: string;
    lunch: string;
    dinner: string;
    snack: string;
  };
}

const DayPlanCard: React.FC<{ plan: MealPlan }> = ({ plan }) => (
    <Card className="p-6">
        <h3 className="font-bold text-xl text-teal-600 mb-4">{plan.day}</h3>
        <div className="space-y-3 text-sm text-gray-700">
            <p><strong className="font-semibold">☕ Café da Manhã:</strong> {plan.meals.breakfast}</p>
            <p><strong className="font-semibold">☀️ Almoço:</strong> {plan.meals.lunch}</p>
            <p><strong className="font-semibold">🌙 Jantar:</strong> {plan.meals.dinner}</p>
            <p><strong className="font-semibold">🍎 Lanche:</strong> {plan.meals.snack}</p>
        </div>
    </Card>
);

const TipCard: React.FC<{ icon: string, title: string, children: React.ReactNode }> = ({ icon, title, children }) => (
  <div className="bg-white rounded-lg p-6 shadow-md">
    <div className="flex items-center mb-3">
        <span className="text-2xl mr-3">{icon}</span>
        <h4 className="font-bold text-gray-800">{title}</h4>
    </div>
    <p className="text-sm text-gray-600">{children}</p>
  </div>
);


const PlanPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [isAuthorized, setIsAuthorized] = useState(false);
    
    const planData: PlanData = useMemo(() => getPlanData(searchParams), [searchParams]);
    
    const planRef = useRef<HTMLDivElement>(null);
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
    
    useEffect(() => {
        try {
            const paymentStatus = localStorage.getItem('payment_status');
            if (paymentStatus === 'approved') {
                setIsAuthorized(true);
            } else {
                console.log("Payment not approved. Redirecting to payment page.");
                navigate(`/pagamento?${searchParams.toString()}`, { replace: true });
            }
        } catch (e) {
            console.error("Error accessing localStorage. Redirecting.", e);
            navigate(`/pagamento?${searchParams.toString()}`, { replace: true });
        }
    }, [navigate, searchParams]);

    const handleDownloadPdf = async () => {
        const input = planRef.current;
        if (!input) return;

        setIsGeneratingPdf(true);

        // Acessa as bibliotecas globais carregadas via CDN
        const w = window as any;
        const html2canvas = w.html2canvas;
        const jspdfLib = w.jspdf;

        if (!html2canvas || !jspdfLib) {
            alert("As bibliotecas de PDF ainda estão carregando ou falharam. Por favor, recarregue a página e tente novamente.");
            setIsGeneratingPdf(false);
            return;
        }

        try {
            // Detecta se é mobile para reduzir a qualidade e evitar crash de memória
            const isMobile = window.innerWidth < 768;
            
            const canvas = await html2canvas(input, { 
                scale: isMobile ? 1.5 : 2, // Reduz escala no mobile
                backgroundColor: '#ffffff', 
                useCORS: true,
                logging: false 
            });

            const imgData = canvas.toDataURL('image/png');
            
            // Acessa o construtor corretamente (jspdf.jsPDF na versão UMD)
            const { jsPDF } = jspdfLib;
            const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
            
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            
            let heightLeft = pdfHeight;
            let position = 0;
            const pageHeight = pdf.internal.pageSize.getHeight();
            
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
            heightLeft -= pageHeight;
            
            while (heightLeft > 0) {
              position = heightLeft - pdfHeight;
              pdf.addPage();
              pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
              heightLeft -= pageHeight;
            }
            
            const fileName = `FitCalc_Plano_${planData.name ? planData.name.replace(/\s+/g, '_') : 'Personalizado'}.pdf`;
            pdf.save(fileName);
        } catch (error: any) {
            console.error("Error generating PDF:", error);
            // Mostra o erro real para o usuário
            alert(`Não foi possível gerar o PDF: ${error.message || error}. Tente recarregar a página.`);
        } finally {
            setIsGeneratingPdf(false);
        }
    };

    if (!isAuthorized) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="text-center">
                    <svg className="animate-spin mx-auto h-12 w-12 text-teal-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <h1 className="text-xl font-bold mt-4">Verificando autorização...</h1>
                    <p className="text-gray-600 mt-2">Aguarde um momento.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div ref={planRef} className="bg-white p-4 sm:p-8 rounded-2xl shadow-lg">
                <div className="text-center">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">{planData.name ? `${planData.name}, seu Plano Personalizado` : 'Seu Plano Personalizado'}</h1>
                    <p className="mt-2 text-lg text-gray-600">
                        Este é um plano <strong className="font-semibold text-teal-600">exemplo</strong> para sua meta de <strong className="font-semibold text-teal-600">{planData.calories} kcal</strong>
                        {planData.targetWeight && ` e objetivo de ${planData.targetWeight} kg`}.
                    </p>
                     <p className="mt-1 text-sm text-gray-500 bg-teal-50 border border-teal-200 rounded-full inline-block px-4 py-1">
                        Plano {planData.dietaryPreference === 'vegetarian' ? 'Vegetariano' : 'Onívoro'} / Orçamento: <strong className="font-semibold">{economicProfileOptions[planData.economicProfile].split(' (')[0]}</strong>
                    </p>
                </div>

                {planData.healthConditions && !planData.healthConditions.includes(HealthCondition.NONE) && planData.healthConditions.length > 0 && (
                    <div className="mt-8 bg-red-100 border-l-4 border-red-500 text-red-800 p-4 rounded-md" role="alert">
                      <p className="font-bold">Aviso de Saúde Importante!</p>
                      <p className="text-sm">Identificamos que você possui uma condição de saúde pré-existente. Este plano alimentar é um exemplo e <strong className="underline">NÃO SUBSTITUI a orientação de um médico</strong> ou nutricionista. Leve este plano para seu profissional de saúde antes de iniciar.</p>
                    </div>
                )}

                {(planData.dietaryRestriction === DietaryRestriction.GLUTEN_INTOLERANCE || planData.dietaryRestriction === DietaryRestriction.LACTOSE_INTOLERANCE) && (
                    <div className="mt-8 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-md" role="alert">
                      <p className="font-bold">Atenção à sua restrição!</p>
                      <p className="text-sm">Este é um plano exemplo. Lembre-se de sempre optar por versões sem {planData.dietaryRestriction === DietaryRestriction.GLUTEN_INTOLERANCE ? 'glúten' : 'lactose'} dos alimentos sugeridos (pães, laticínios, etc.) e sempre verifique os rótulos.</p>
                    </div>
                )}


                <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {planData.mealPlans.map(plan => <DayPlanCard key={plan.day} plan={plan} />)}
                </div>

                <div className="mt-20">
                  <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-8">Dicas de Ouro para sua Jornada</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {planData.personalizedTips.map(tip => <TipCard key={tip.title} icon={tip.icon} title={tip.title}>{tip.text}</TipCard>)}
                  </div>
                </div>
            </div>
             <div className="text-center mt-12 pb-12">
                 <button 
                    onClick={handleDownloadPdf}
                    disabled={isGeneratingPdf}
                    className="inline-block bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-bold text-lg rounded-full px-10 py-4 shadow-lg hover:scale-105 transform transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                    {isGeneratingPdf ? 'Gerando PDF (aguarde)...' : 'Baixar Plano em PDF'}
                 </button>
                 <p className="text-xs text-gray-400 mt-2">Se o download não iniciar, tire prints da tela para salvar seu plano.</p>
                 <Link to="/form" className="block mt-6 text-teal-600 font-semibold hover:underline">
                    &larr; Voltar e calcular novamente
                </Link>
            </div>
        </div>
    );
};

export default PlanPage;
