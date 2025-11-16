import React, { useRef, useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Card from '../components/Card';
import { 
    EconomicProfile, 
    economicProfileOptions, 
    DietaryPreference, 
    DietaryRestriction, 
    MainChallenge, 
    SleepQuality,
    ExerciseFrequency,
    ActivityType,
    HealthCondition,
} from '../types';

// Declare external libraries loaded from CDN
declare const html2canvas: any;
declare const jsPDF: any;

interface MealPlan {
  day: string;
  meals: {
    breakfast: string;
    lunch: string;
    dinner: string;
    snack: string;
  };
}

// OMNIVORE MEAL PLANS
const economicalMealPlans: MealPlan[] = [
  { day: "Dia 1", meals: { breakfast: "2 ovos mexidos e 1 banana.", lunch: "120g de frango desfiado, arroz, feijão e salada de alface e tomate.", dinner: "Sopa de legumes com batata e cenoura.", snack: "1 maçã." } },
  { day: "Dia 2", meals: { breakfast: "Mingau de aveia com água e canela.", lunch: "120g de carne moída (patinho) com purê de batata.", dinner: "Omelete de 2 ovos com queijo e tomate.", snack: "1 laranja." } },
  { day: "Dia 3", meals: { breakfast: "1 pão francês com ovo na chapa.", lunch: "1 lata de atum em água com salada de batata, cenoura e vagem.", dinner: "Caldo de feijão.", snack: "1 banana." } },
  { day: "Dia 4", meals: { breakfast: "Cuscuz com ovo e queijo coalho.", lunch: "120g de filé de frango grelhado, macarrão e salada.", dinner: "Ovos cozidos (2 unidades) com salada verde.", snack: "1 fatia de melancia." } },
  { day: "Dia 5", meals: { breakfast: "1 iogurte natural e 1/2 mamão.", lunch: "Arroz, feijão, 1 bife de fígado acebolado e couve refogada.", dinner: "Sopa de abóbora.", snack: "1 pêra." } },
  { day: "Dia 6", meals: { breakfast: "2 fatias de pão de forma integral com requeijão.", lunch: "120g de sobrecoxa de frango assada com batatas.", dinner: "Sanduíche com pão integral, patê de frango e alface.", snack: "1 cacho de uvas pequeno." } },
  { day: "Dia 7", meals: { breakfast: "Vitamina de banana com leite.", lunch: "Refeição livre, com moderação. Coma algo que goste sem gastar muito.", dinner: "Crepioca (1 ovo, 2 col. de goma) com queijo.", snack: "Gelatina." } },
];
const standardMealPlans: MealPlan[] = [
  { day: "Dia 1", meals: { breakfast: "2 ovos mexidos com tomate e 1 fatia de pão integral.", lunch: "120g de filé de frango grelhado, salada de folhas à vontade e 4 colheres de sopa de arroz integral.", dinner: "Sopa de legumes com 100g de frango desfiado.", snack: "1 iogurte natural desnatado com frutas vermelhas." } },
  { day: "Dia 2", meals: { breakfast: "Vitamina de banana (1 banana, 200ml de leite desnatado, 1 col. de aveia).", lunch: "120g de patinho moído refogado, purê de batata doce e salada de brócolis.", dinner: "Omelete com 2 ovos, queijo branco e espinafre.", snack: "1 maçã e um punhado de amêndoas." } },
  { day: "Dia 3", meals: { breakfast: "1 pote de iogurte grego zero com granola sem açúcar.", lunch: "1 posta de tilápia assada, arroz de couve-flor e aspargos no vapor.", dinner: "Salada completa com folhas, tomate, pepino, cenoura e 1 lata de atum em água.", snack: "2 fatias de melão." } },
  { day: "Dia 4", meals: { breakfast: "Panqueca de aveia (1 ovo, 2 col. de aveia) com mel.", lunch: "120g de tiras de alcatra, mix de legumes refogados e 4 colheres de sopa de batata baroa.", dinner: "Creme de abóbora com gengibre.", snack: "1 pera." } },
  { day: "Dia 5", meals: { breakfast: "2 torradas integrais com queijo cottage e geleia sem açúcar.", lunch: "Strogonoff de frango fit (com creme de ricota), arroz integral.", dinner: "1 filé de pescada grelhado com purê de mandioquinha.", snack: "1 banana com canela." } },
  { day: "Dia 6", meals: { breakfast: "Mingau de aveia com whey protein (opcional) e frutas.", lunch: "Feijoada magra (feijão preto, carne seca, lombo) com couve refogada e 1/2 laranja.", dinner: "Sanduíche natural com pão integral, frango desfiado, cenoura ralada e alface.", snack: "Mix de castanhas." } },
  { day: "Dia 7", meals: { breakfast: "Crepioca (1 ovo, 2 col. de goma de tapioca) com recheio de frango.", lunch: "Refeição livre, com moderação. Aproveite para comer algo que gosta sem exagerar.", dinner: "Salada Caesar com frango grelhado e molho light.", snack: "Gelatina diet." } },
];
const flexibleMealPlans: MealPlan[] = [
  { day: "Dia 1", meals: { breakfast: "Iogurte grego com frutas vermelhas, nozes e fio de mel.", lunch: "150g de salmão grelhado com aspargos na manteiga e quinoa.", dinner: "Salada caprese com queijo de búfala e pesto.", snack: "Shake de whey protein com pasta de amendoim." } },
  { day: "Dia 2", meals: { breakfast: "Pão de fermentação natural com abacate amassado e ovo pochê.", lunch: "150g de filé mignon em tiras com risoto de cogumelos.", dinner: "Ceviche de tilápia com chips de batata doce.", snack: "Um punhado de pistaches." } },
  { day: "Dia 3", meals: { breakfast: "Bowl de açaí puro com granola artesanal, banana e morangos.", lunch: "150g de camarão ao alho e óleo com purê de mandioquinha.", dinner: "Sopa cremosa de abóbora com camarões e queijo gorgonzola.", snack: "Tâmaras com nozes." } },
  { day: "Dia 4", meals: { breakfast: "Ovos beneditinos em pão integral.", lunch: "150g de lombo de porco com molho de maçã e cuscuz marroquino.", dinner: "Wrap integral com rosbife, rúcula e mostarda dijon.", snack: "Mix de frutas secas (damasco, ameixa)." } },
  { day: "Dia 5", meals: { breakfast: "Smoothie verde (couve, abacaxi, whey, água de coco).", lunch: "Bacalhau à Brás (versão fit).", dinner: "Carpaccio de carne com alcaparras, parmesão e rúcula.", snack: "Queijo brie com geleia de pimenta." } },
  { day: "Dia 6", meals: { breakfast: "Panquecas americanas com mirtilos e maple syrup.", lunch: "Paella de frutos do mar (versão simplificada).", dinner: "Hambúrguer gourmet caseiro no prato com salada.", snack: "Chocolate 70% cacau." } },
  { day: "Dia 7", meals: { breakfast: "Bruschettas em pão integral com tomate cereja e manjericão.", lunch: "Refeição livre premium. Desfrute de um bom restaurante.", dinner: "Sashimi e temaki (com moderação no arroz).", snack: "Morangos com creme de ricota." } },
];

// VEGETARIAN MEAL PLANS
const economicalVegetarianMealPlans: MealPlan[] = [
    { day: "Dia 1", meals: { breakfast: "2 ovos mexidos e 1 banana.", lunch: "120g de grão de bico cozido, arroz, feijão e salada de alface e tomate.", dinner: "Sopa de legumes com lentilha.", snack: "1 maçã." } },
    { day: "Dia 2", meals: { breakfast: "Mingau de aveia com água e canela.", lunch: "Hambúrguer de lentilha (caseiro) com purê de batata.", dinner: "Omelete de 2 ovos com queijo e tomate.", snack: "1 laranja." } },
    { day: "Dia 3", meals: { breakfast: "1 pão francês com ovo na chapa.", lunch: "Tofu mexido (120g) com salada de batata, cenoura e vagem.", dinner: "Caldo de feijão.", snack: "1 banana." } },
    { day: "Dia 4", meals: { breakfast: "Cuscuz com ovo e queijo coalho.", lunch: "Macarrão ao sugo com proteína de soja texturizada.", dinner: "Ovos cozidos (2 unidades) com salada verde.", snack: "1 fatia de melancia." } },
    { day: "Dia 5", meals: { breakfast: "1 iogurte natural e 1/2 mamão.", lunch: "Arroz, feijão, 1 bife de berinjela e couve refogada.", dinner: "Sopa de abóbora.", snack: "1 pêra." } },
    { day: "Dia 6", meals: { breakfast: "2 fatias de pão de forma integral com requeijão.", lunch: "Escondidinho de batata com recheio de proteína de soja.", dinner: "Sanduíche com pão integral, pasta de grão de bico (homus) e alface.", snack: "1 cacho de uvas pequeno." } },
    { day: "Dia 7", meals: { breakfast: "Vitamina de banana com leite.", lunch: "Refeição livre, com moderação. Coma algo que goste sem gastar muito.", dinner: "Crepioca (1 ovo, 2 col. de goma) com queijo.", snack: "Gelatina." } },
];
const standardVegetarianMealPlans: MealPlan[] = [
    { day: "Dia 1", meals: { breakfast: "2 ovos mexidos com tomate e 1 fatia de pão integral.", lunch: "120g de tofu grelhado, salada de folhas à vontade e 4 colheres de sopa de arroz integral.", dinner: "Sopa de legumes com 100g de lentilha.", snack: "1 iogurte natural desnatado com frutas vermelhas." } },
    { day: "Dia 2", meals: { breakfast: "Vitamina de banana (1 banana, 200ml de leite desnatado, 1 col. de aveia).", lunch: "Quibe de abóbora com quinoa, purê de batata doce e salada de brócolis.", dinner: "Omelete com 2 ovos, queijo branco e espinafre.", snack: "1 maçã e um punhado de amêndoas." } },
    { day: "Dia 3", meals: { breakfast: "1 pote de iogurte grego zero com granola sem açúcar.", lunch: "Moqueca de banana da terra com arroz e farofa de dendê.", dinner: "Salada completa com folhas, tomate, pepino, cenoura e 120g de grão de bico.", snack: "2 fatias de melão." } },
    { day: "Dia 4", meals: { breakfast: "Panqueca de aveia (1 ovo, 2 col. de aveia) com mel.", lunch: "Strogonoff de palmito, mix de legumes refogados e arroz integral.", dinner: "Creme de abóbora com gengibre.", snack: "1 pera." } },
    { day: "Dia 5", meals: { breakfast: "2 torradas integrais com queijo cottage e geleia sem açúcar.", lunch: "Lasanha de berinjela com recheio de ricota e espinafre.", dinner: "Falafel assado (4 unidades) com salada de pepino e tomate.", snack: "1 banana com canela." } },
    { day: "Dia 6", meals: { breakfast: "Mingau de aveia com whey protein (opcional) e frutas.", lunch: "Feijoada vegetariana (com legumes e tofu defumado) e couve refogada.", dinner: "Sanduíche natural com pão integral, pasta de abacate, tomate e rúcula.", snack: "Mix de castanhas." } },
    { day: "Dia 7", meals: { breakfast: "Crepioca (1 ovo, 2 col. de goma de tapioca) com recheio de queijo.", lunch: "Refeição livre, com moderação. Aproveite para comer algo que gosta sem exagerar.", dinner: "Salada Caesar com tiras de tofu crocante e molho light.", snack: "Gelatina diet." } },
];
const flexibleVegetarianMealPlans: MealPlan[] = [
    { day: "Dia 1", meals: { breakfast: "Iogurte grego com frutas vermelhas, nozes e fio de mel.", lunch: "Risoto de cogumelos frescos (shitake, shimeji) com parmesão.", dinner: "Salada caprese com queijo de búfala e pesto.", snack: "Shake de whey protein (ou de ervilha) com pasta de amendoim." } },
    { day: "Dia 2", meals: { breakfast: "Pão de fermentação natural com abacate amassado e ovo pochê.", lunch: "Bobó de palmito pupunha com arroz de coco.", dinner: "Ceviche de manga com chips de batata doce.", snack: "Um punhado de pistaches." } },
    { day: "Dia 3", meals: { breakfast: "Bowl de açaí puro com granola artesanal, banana e morangos.", lunch: "Hambúrguer gourmet de cogumelos em pão brioche com queijo brie.", dinner: "Sopa cremosa de aspargos com croutons de pão integral.", snack: "Tâmaras com nozes." } },
    { day: "Dia 4", meals: { breakfast: "Ovos beneditinos em pão integral com molho holandês vegano.", lunch: "Curry de legumes com leite de coco e arroz jasmim.", dinner: "Wrap integral com homus, falafel, e vegetais grelhados.", snack: "Mix de frutas secas (damasco, ameixa)." } },
    { day: "Dia 5", meals: { breakfast: "Smoothie verde (couve, abacaxi, whey, água de coco).", lunch: "Gnocchi de mandioquinha ao molho de sálvia e manteiga.", dinner: "Carpaccio de beterraba com alcaparras, parmesão e rúcula.", snack: "Queijo brie com geleia de pimenta." } },
    { day: "Dia 6", meals: { breakfast: "Panquecas americanas com mirtilos e maple syrup.", lunch: "Paella vegetariana com açafrão, pimentões e ervilhas.", dinner: "Pizza de fermentação natural com abobrinha e queijo de cabra.", snack: "Chocolate 70% cacau." } },
    { day: "Dia 7", meals: { breakfast: "Bruschettas em pão integral com tomate cereja e manjericão.", lunch: "Refeição livre premium. Desfrute de um bom restaurante.", dinner: "Combinado de sushi vegetariano.", snack: "Morangos com creme de ricota." } },
];


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

const getPersonalizedTips = (challenge: MainChallenge, sleep: SleepQuality, exercise: ExerciseFrequency, activityTypes: ActivityType[], healthConditions: HealthCondition[]) => {
    const tips = [];

    // Base tips for everyone
    tips.push({ icon: "💧", title: "Beba Muita Água", text: "Hidratação é chave. Beba pelo menos 2 litros de água por dia. Muitas vezes, confundimos sede com fome." });
    tips.push({ icon: "🍗", title: "Proteína é Essencial", text: "Inclua uma fonte de proteína em todas as refeições. Ela aumenta a saciedade e ajuda a preservar sua massa muscular." });

    // Challenge-based tip
    switch (challenge) {
        case MainChallenge.LACK_OF_TIME:
            tips.push({ icon: "⏱️", title: "Otimize seu Tempo", text: "Dedique 1-2 horas no fim de semana para o 'meal prep'. Deixe saladas pré-lavadas e grãos cozidos. Isso economiza muito tempo e evita más escolhas na correria." });
            break;
        case MainChallenge.CRAVINGS:
            tips.push({ icon: "🍩", title: "Controle a Vontade de Doces", text: "Tenha sempre opções saudáveis e doces à mão, como frutas, iogurte com mel ou um chocolate 70%. Não espere a vontade chegar para pensar no que comer." });
            break;
        case MainChallenge.SOCIAL_EVENTS:
            tips.push({ icon: "🎉", title: "Estratégia para Eventos", text: "Antes de sair, faça um lanche rico em proteínas. No evento, comece pela salada, beba água entre os drinks e escolha uma ou duas coisas que você realmente quer comer, sem exagerar." });
            break;
        case MainChallenge.LACK_OF_MOTIVATION:
            tips.push({ icon: "🔥", title: "Mantenha a Motivação", text: "Defina metas pequenas e realistas. Tire fotos semanais para ver o progresso além da balança. Encontre um parceiro de jornada para se manter responsável." });
            break;
    }

    // Sleep-based tip
    switch (sleep) {
        case SleepQuality.POOR:
             tips.push({ icon: "😴", title: "Melhore seu Sono URGENTE", text: "Seu sono ruim está sabotando seus resultados. Crie uma rotina: desligue telas 1h antes de deitar, deixe o quarto escuro e evite cafeína à noite. É fundamental para regular seus hormônios." });
            break;
        case SleepQuality.REGULAR:
             tips.push({ icon: "🛌", title: "Ajuste seu Sono", text: "Tente melhorar a consistência dos seus horários de dormir e acordar, mesmo nos fins de semana. Um sono de maior qualidade otimiza a queima de gordura e o controle do apetite." });
            break;
        default:
             break; // No tip for good sleep, it's the baseline
    }

    // Exercise-based tip
    if (exercise === ExerciseFrequency.NONE) {
        tips.push({ icon: "🚶‍♀️", title: "Comece com o Básico", text: "Já que seu foco inicial é a dieta, que tal adicionar caminhadas leves de 20-30 minutos ao seu dia? Isso ajuda na digestão, melhora o humor e acelera os resultados sem grande esforço." });
    } else if (activityTypes && activityTypes.length > 0) {
         if (activityTypes.includes(ActivityType.WEIGHT_TRAINING) || activityTypes.includes(ActivityType.FUNCTIONAL)) {
            tips.push({ icon: "🏋️", title: "Foco na Recuperação Muscular", text: "Para musculação e funcional, uma boa ingestão de proteína pós-treino é crucial. Isso ajuda a reparar e construir músculos, o que acelera seu metabolismo." });
        }
        if (activityTypes.includes(ActivityType.RUNNING) || activityTypes.includes(ActivityType.WALKING)) {
            tips.push({ icon: "👟", title: "Cuide das Articulações", text: "Para atividades de impacto como corrida, invista em um tênis com bom amortecimento e não se esqueça de aquecer bem antes e alongar depois para proteger joelhos e tornozelos." });
        }
        if (activityTypes.includes(ActivityType.SWIMMING)) {
             tips.push({ icon: "🏊", title: "Cuidado com a Fome Pós-Natação", text: "É comum sentir mais fome depois de nadar. Tenha um lanche saudável e rico em proteínas preparado para não atacar a geladeira sem pensar." });
        }
    } else {
        // Generic exercise tip if types are not available for some reason
        tips.push({ icon: "💪", title: "Consistência nos Treinos", text: "Ótimo que você se exercita! Para potencializar, tente manter a regularidade. Mesmo treinos curtos são melhores que nenhum treino. Foque na qualidade do movimento." });
    }
    
    if (healthConditions && !healthConditions.includes(HealthCondition.NONE) && healthConditions.length > 0) {
        tips.push({ icon: "🧑‍⚕️", title: "Acompanhamento é Essencial", text: "Lembre-se: por ter uma condição de saúde, é ainda mais importante que você tenha o acompanhamento de um médico. Este plano é um guia, mas o profissional de saúde poderá ajustá-lo perfeitamente para você." });
    }

    tips.push({ icon: "⚖️", title: "Consistência > Perfeição", text: "Não precisa ser perfeito todos os dias. O importante é manter a consistência na maior parte do tempo. Um deslize não estraga o processo." });

    return tips;
}

const PlanPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const name = searchParams.get('name');
    const calories = searchParams.get('calories');
    const targetWeight = searchParams.get('targetWeight');
    const economicProfile = searchParams.get('economicProfile') as EconomicProfile || EconomicProfile.STANDARD;
    const dietaryPreference = searchParams.get('dietaryPreference') as DietaryPreference || DietaryPreference.OMNIVORE;
    const dietaryRestriction = searchParams.get('dietaryRestriction') as DietaryRestriction || DietaryRestriction.NONE;
    const mainChallenge = searchParams.get('mainChallenge') as MainChallenge || MainChallenge.CRAVINGS;
    const sleepQuality = searchParams.get('sleepQuality') as SleepQuality || SleepQuality.REGULAR;
    const exerciseFrequency = searchParams.get('exerciseFrequency') as ExerciseFrequency || ExerciseFrequency.OCCASIONAL;
    const activityTypes = searchParams.getAll('activityTypes') as ActivityType[];
    const healthConditions = searchParams.getAll('healthConditions') as HealthCondition[];
    
    const planRef = useRef<HTMLDivElement>(null);
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
    
    const mealPlans = useMemo(() => {
        if (dietaryPreference === DietaryPreference.VEGETARIAN) {
            switch (economicProfile) {
                case EconomicProfile.ECONOMICAL: return economicalVegetarianMealPlans;
                case EconomicProfile.FLEXIBLE: return flexibleVegetarianMealPlans;
                default: return standardVegetarianMealPlans;
            }
        }
        // Omnivore plans
        switch (economicProfile) {
            case EconomicProfile.ECONOMICAL: return economicalMealPlans;
            case EconomicProfile.FLEXIBLE: return flexibleMealPlans;
            default: return standardMealPlans;
        }
    }, [economicProfile, dietaryPreference]);

    const personalizedTips = useMemo(() => getPersonalizedTips(mainChallenge, sleepQuality, exerciseFrequency, activityTypes, healthConditions), [mainChallenge, sleepQuality, exerciseFrequency, activityTypes, healthConditions]);

    const handleDownloadPdf = async () => {
        const input = planRef.current;
        if (!input) return;

        setIsGeneratingPdf(true);
        try {
            const canvas = await html2canvas(input, { scale: 2, backgroundColor: '#ffffff', useCORS: true });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF.jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
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
            const fileName = `FitCalc_Plano_${name ? name.replace(/\s+/g, '_') : 'Personalizado'}.pdf`;
            pdf.save(fileName);
        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Ocorreu um erro ao gerar o PDF. Tente novamente.");
        } finally {
            setIsGeneratingPdf(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div ref={planRef} className="bg-white p-4 sm:p-8 rounded-2xl shadow-lg">
                <div className="text-center">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">{name ? `${name}, seu Plano Personalizado` : 'Seu Plano Personalizado'}</h1>
                    <p className="mt-2 text-lg text-gray-600">
                        Este é um plano <strong className="font-semibold text-teal-600">exemplo</strong> para sua meta de <strong className="font-semibold text-teal-600">{calories} kcal</strong>
                        {targetWeight && ` e objetivo de ${targetWeight} kg`}.
                    </p>
                     <p className="mt-1 text-sm text-gray-500 bg-teal-50 border border-teal-200 rounded-full inline-block px-4 py-1">
                        Plano {dietaryPreference === 'vegetarian' ? 'Vegetariano' : 'Onívoro'} / Orçamento: <strong className="font-semibold">{economicProfileOptions[economicProfile].split(' (')[0]}</strong>
                    </p>
                </div>

                {healthConditions && !healthConditions.includes(HealthCondition.NONE) && healthConditions.length > 0 && (
                    <div className="mt-8 bg-red-100 border-l-4 border-red-500 text-red-800 p-4 rounded-md" role="alert">
                      <p className="font-bold">Aviso de Saúde Importante!</p>
                      <p className="text-sm">Identificamos que você possui uma condição de saúde pré-existente. Este plano alimentar é um exemplo e <strong className="underline">NÃO SUBSTITUI a orientação de um médico</strong> ou nutricionista. Leve este plano para seu profissional de saúde antes de iniciar.</p>
                    </div>
                )}

                {(dietaryRestriction === DietaryRestriction.GLUTEN_INTOLERANCE || dietaryRestriction === DietaryRestriction.LACTOSE_INTOLERANCE) && (
                    <div className="mt-8 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-md" role="alert">
                      <p className="font-bold">Atenção à sua restrição!</p>
                      <p className="text-sm">Este é um plano exemplo. Lembre-se de sempre optar por versões sem {dietaryRestriction === DietaryRestriction.GLUTEN_INTOLERANCE ? 'glúten' : 'lactose'} dos alimentos sugeridos (pães, laticínios, etc.) e sempre verifique os rótulos.</p>
                    </div>
                )}


                <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mealPlans.map(plan => <DayPlanCard key={plan.day} plan={plan} />)}
                </div>

                <div className="mt-20">
                  <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-8">Dicas de Ouro para sua Jornada</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {personalizedTips.map(tip => <TipCard key={tip.title} icon={tip.icon} title={tip.title}>{tip.text}</TipCard>)}
                  </div>
                </div>
            </div>
             <div className="text-center mt-12">
                 <button 
                    onClick={handleDownloadPdf}
                    disabled={isGeneratingPdf}
                    className="inline-block bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-bold text-lg rounded-full px-10 py-4 shadow-lg hover:scale-105 transform transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                    {isGeneratingPdf ? 'Gerando PDF...' : 'Baixar Plano em PDF'}
                 </button>
                 <Link to="/form" className="block mt-6 text-teal-600 font-semibold hover:underline">
                    &larr; Voltar e calcular novamente
                </Link>
            </div>
        </div>
    );
};

export default PlanPage;