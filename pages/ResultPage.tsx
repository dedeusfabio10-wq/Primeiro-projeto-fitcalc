import React, { useMemo, useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Sex, ActivityLevel, activityLevelFactors, Goal, Medication, TakesSupplements, ExerciseFrequency, ActivityType, SmokingStatus, AlcoholFrequency, HealthCondition } from '../types';
import Card from '../components/Card';
import EmailCapture from '../components/EmailCapture';

const activityBurnKcal: Record<ActivityType, number> = {
    [ActivityType.WALKING]: 250,
    [ActivityType.RUNNING]: 500,
    [ActivityType.WEIGHT_TRAINING]: 300,
    [ActivityType.FUNCTIONAL]: 350,
    [ActivityType.CYCLING]: 400,
    [ActivityType.SWIMMING]: 450,
};

const sessionsPerWeek: Record<ExerciseFrequency, number> = {
    [ExerciseFrequency.NONE]: 0,
    [ExerciseFrequency.OCCASIONAL]: 1.5,
    [ExerciseFrequency.REGULAR]: 3.5,
    [ExerciseFrequency.INTENSE]: 5,
};

const ResultPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [targetCalories, setTargetCalories] = useState<number>(0);
  const [showEmailModal, setShowEmailModal] = useState(false);

  const { 
      results, 
      goal, 
      name, 
      medications, 
      takesSupplements, 
      weight, 
      targetWeight,
      exerciseFrequency,
      activityTypes,
      smokingStatus,
      alcoholFrequency,
      healthConditions,
  } = useMemo(() => {
    const name = searchParams.get('name');
    const weight = parseFloat(searchParams.get('weight') || '0');
    const height = parseFloat(searchParams.get('height') || '0');
    const age = parseInt(searchParams.get('age') || '0', 10);
    const sex = searchParams.get('sex') as Sex;
    const activityLevel = searchParams.get('activityLevel') as ActivityLevel;
    const currentGoal = searchParams.get('goal') as Goal || Goal.LOSE_WEIGHT;
    const currentExerciseFrequency = searchParams.get('exerciseFrequency') as ExerciseFrequency || ExerciseFrequency.NONE;
    const currentActivityTypes = searchParams.getAll('activityTypes') as ActivityType[];
    const currentTargetWeight = parseFloat(searchParams.get('targetWeight') || '0');
    const currentMedications = searchParams.getAll('medications') as Medication[];
    const currentTakesSupplements = searchParams.get('takesSupplements') as TakesSupplements;
    const currentSmokingStatus = searchParams.get('smokingStatus') as SmokingStatus;
    const currentAlcoholFrequency = searchParams.get('alcoholFrequency') as AlcoholFrequency;
    const currentHealthConditions = searchParams.getAll('healthConditions') as HealthCondition[];
    
    if (!name || !weight || !height || !age || !sex || !activityLevel) {
      return { results: null, goal: currentGoal, name: null, medications: [], takesSupplements: null, weight: 0, targetWeight: 0, exerciseFrequency: currentExerciseFrequency, activityTypes: [], smokingStatus: null, alcoholFrequency: null, healthConditions: [] };
    }

    let bmr: number;
    if (sex === Sex.MALE) {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }

    const tdee = bmr * activityLevelFactors[activityLevel];
    
    return {
      results: {
        bmr: Math.round(bmr),
        tdee: Math.round(tdee),
        lossLight: Math.round(tdee - 300),
        lossModerate: Math.round(tdee - 400),
        lossAggressive: Math.round(tdee - 500),
        deficitLow: Math.round(tdee - 500),
        deficitHigh: Math.round(tdee - 300),
        gainTarget: Math.round(tdee + 400),
        surplusLow: Math.round(tdee + 300),
        surplusHigh: Math.round(tdee + 500),
      },
      goal: currentGoal,
      name,
      medications: currentMedications,
      takesSupplements: currentTakesSupplements,
      weight,
      targetWeight: currentTargetWeight,
      exerciseFrequency: currentExerciseFrequency,
      activityTypes: currentActivityTypes,
      smokingStatus: currentSmokingStatus,
      alcoholFrequency: currentAlcoholFrequency,
      healthConditions: currentHealthConditions,
    };
  }, [searchParams]);
  
  const personalizedTips = useMemo(() => {
      const tips = [];
      
      if (smokingStatus === SmokingStatus.SMOKER) {
          tips.push({ icon: "🚭", title: "Impacto do Cigarro", text: "Fumar pode diminuir sua capacidade pulmonar e desempenho nos exercícios. Reduzir ou parar de fumar não só melhora sua saúde geral, mas também pode acelerar seus resultados na busca por uma vida mais saudável." });
      }

      if (alcoholFrequency === AlcoholFrequency.FREQUENTLY) {
           tips.push({ icon: "🍺", title: "Cuidado com o Álcool", text: "Bebidas alcoólicas são 'calorias vazias' que podem atrapalhar seu déficit calórico. O consumo frequente pode sabotar seu progresso. Tente reduzir a frequência e opte por drinks menos calóricos." });
      }

      if (healthConditions.includes(HealthCondition.DIABETES)) {
           tips.push({ icon: "🩺", title: "Atenção à Diabetes", text: "Consulte seu médico antes de iniciar qualquer plano. Focar em carboidratos complexos (integrais, batata doce) e monitorar a glicemia é crucial. Este plano é um exemplo e precisa de validação profissional." });
      }

       if (healthConditions.includes(HealthCondition.HIGH_BLOOD_PRESSURE)) {
           tips.push({ icon: "❤️", title: "Controle a Pressão Alta", text: "A redução de peso já é um grande passo! Combine isso com uma dieta baixa em sódio (evite industrializados, embutidos) e pratique atividades físicas regularmente, sempre com liberação do seu cardiologista." });
      }
      
      if (healthConditions.includes(HealthCondition.CHOLESTEROL)) {
           tips.push({ icon: "🍳", title: "Gerencie o Colesterol", text: "Priorize gorduras saudáveis (abacate, azeite, nozes), fibras (aveia, frutas) e evite gorduras trans. Atividade física regular é uma poderosa aliada para melhorar seus níveis de colesterol." });
      }
      
      if (healthConditions.includes(HealthCondition.THYROID)) {
         tips.push({ icon: "🦋", title: "Atenção à Tireoide", text: "Problemas de tireoide podem influenciar seu metabolismo. É fundamental que seu tratamento médico esteja em dia e seus hormônios regulados para que o plano alimentar tenha o efeito esperado." });
      }

      const hasGlp1 = medications.includes(Medication.LIRAGLUTIDA) || medications.includes(Medication.SEMAGLUTIDA);
      const hasSibutramina = medications.includes(Medication.SIBUTRAMINA);

      if (hasGlp1 || hasSibutramina) {
          tips.push({
              icon: "💧",
              title: "Hidratação é Chave",
              text: "Alguns medicamentos podem diminuir a sensação de sede. Beba água constantemente, mesmo sem sentir vontade, para manter o corpo hidratado, otimizar o metabolismo e evitar dores de cabeça."
          });
      }

      if (medications.includes(Medication.ORLISTAT)) {
          tips.push({
              icon: "🥑",
              title: "Foco em Gorduras Boas",
              text: "O Orlistat atua na absorção de gordura. Para melhores resultados e menos desconfortos, priorize gorduras saudáveis (abacate, azeite, nozes) e aumente o consumo de fibras (frutas, vegetais)."
          });
      }

      if (takesSupplements === TakesSupplements.YES) {
          tips.push({
              icon: "💊",
              title: "Suplementos com Estratégia",
              text: "Lembre-se que suplementos complementam a dieta, não a substituem. Converse com um profissional para garantir que você está usando o que é realmente necessário para seus objetivos, evitando desperdício de dinheiro."
          });
      }

      if (medications.length > 0 && !medications.includes(Medication.NONE)) {
            tips.push({
              icon: "🥦",
              title: "Nutrição em Primeiro Lugar",
              text: "Com a medicação ajudando no controle do apetite, foque em qualidade. Cada refeição é uma chance de nutrir seu corpo. Priorize proteínas, fibras e vegetais para se sentir bem e preservar massa magra."
            })
      }
      
      return tips;
  }, [medications, takesSupplements, healthConditions, smokingStatus, alcoholFrequency]);

  useEffect(() => {
    if (!results || !name) {
      navigate('/form');
    } else if (goal === Goal.LOSE_WEIGHT) {
      setTargetCalories(results.lossModerate);
    }
  }, [results, name, navigate, goal]);

  const handleEmailSuccess = () => {
    const params = new URLSearchParams(searchParams);
    params.set('calories', targetCalories.toString());
    navigate(`/pagamento?${params.toString()}`);
  };

  if (!results || !name) {
    return <div className="text-center py-10">Carregando ou redirecionando...</div>;
  }
  
  const getEstimatedTime = (weightDifference: number, dietaryWeeklyLossKg: number, exercisePlan: ExerciseFrequency, activities: ActivityType[]): string => {
      const avgBurnPerSession = activities.length > 0 
          ? activities.reduce((sum, act) => sum + (activityBurnKcal[act] || 300), 0) / activities.length
          : 300;
      
      const weeklyExerciseBurn = avgBurnPerSession * (sessionsPerWeek[exercisePlan] || 0);
      const weeklyExerciseLossKg = weeklyExerciseBurn / 7700;

      const totalWeeklyLossKg = dietaryWeeklyLossKg + weeklyExerciseLossKg;

      if (totalWeeklyLossKg <= 0) return "-";
      const weeks = Math.ceil(weightDifference / totalWeeklyLossKg);
      if (weeks <= 4) return `~${weeks} semana${weeks > 1 ? 's' : ''}`;
      const months = (weeks / 4).toFixed(1).replace('.0', '');
      return `~${months} mes${parseFloat(months) > 1 ? 'es' : ''}`;
  };

  const DeficitOption: React.FC<{ title: string; weeklyLoss: string; description: string; calories: number; isActive: boolean; onClick: () => void; timeframe: string; }> = ({ title, weeklyLoss, description, calories, isActive, onClick, timeframe }) => (
    <div onClick={onClick} className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 flex flex-col h-full ${isActive ? 'border-teal-500 bg-teal-100 shadow-lg scale-105' : 'border-gray-200 bg-white hover:border-teal-300'}`}>
        <div className="flex justify-between items-center">
            <h4 className="font-bold text-gray-800">{title}</h4>
            <div className="bg-teal-100 text-teal-800 text-xs font-bold py-1 px-2 rounded-full">
                {timeframe}
            </div>
        </div>
        <p className="text-2xl font-bold text-teal-600 my-1">{calories} <span className="text-lg">kcal</span></p>
        <div className="bg-gray-200 text-gray-700 text-sm font-medium py-1 px-2 rounded-full inline-block my-2 self-center">
            {weeklyLoss}
        </div>
        <p className="text-xs text-gray-500 mt-auto">{description}</p>
    </div>
  );

  const GoalSummaryCard: React.FC<{current: number; target: number; diff: number; unit: string;}> = ({ current, target, diff, unit }) => (
    <Card className="p-6">
        <h3 className="text-xl font-bold text-gray-800 text-center mb-4">Resumo da sua Meta</h3>
        <div className="flex justify-around items-center text-center">
            <div>
                <p className="text-sm text-gray-500">Peso Atual</p>
                <p className="text-2xl font-bold text-gray-800">{current} <span className="text-lg">{unit}</span></p>
            </div>
            <div className="text-teal-500 text-3xl font-bold">→</div>
            <div>
                <p className="text-sm text-gray-500">Peso Desejado</p>
                <p className="text-2xl font-bold text-teal-600">{target} <span className="text-lg">{unit}</span></p>
            </div>
        </div>
        <div className="mt-4 text-center bg-teal-50 border border-teal-200 rounded-lg p-3">
            <p className="font-semibold text-teal-800">Faltam <span className="text-2xl font-extrabold">{diff.toFixed(1)} {unit}</span> para seu objetivo!</p>
        </div>
    </Card>
  );

  if (goal === Goal.MAINTAIN_WEIGHT || goal === Goal.GAIN_WEIGHT) {
    return (
        <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">Olá, <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-cyan-600">{name}</span>!</h1>
            <p className="mt-2 text-lg text-gray-600">Seu objetivo é <span className="font-bold text-teal-600">{goal === Goal.MAINTAIN_WEIGHT ? 'manter o peso' : 'ganhar peso'}</span>. Aqui está sua meta calórica.</p>
            <div className="mt-12 space-y-8">
                {goal === Goal.GAIN_WEIGHT && targetWeight > 0 && <GoalSummaryCard current={weight} target={targetWeight} diff={targetWeight-weight} unit="kg" />}
                <Card className="p-8 bg-gradient-to-br from-teal-500 to-cyan-600 text-white shadow-2xl">
                    <h2 className="text-xl font-bold uppercase tracking-wider opacity-80">Calorias para {goal === Goal.MAINTAIN_WEIGHT ? 'Manutenção' : 'Ganho de Peso'}</h2>
                    <p className="text-6xl md:text-7xl font-extrabold my-2">{goal === Goal.MAINTAIN_WEIGHT ? results.tdee : results.gainTarget} <span className="text-4xl opacity-80">kcal</span></p>
                    {goal === Goal.GAIN_WEIGHT && <p className="font-medium">Sua faixa segura de superávit é entre <span className="font-bold">{results.surplusLow}</span> e <span className="font-bold">{results.surplusHigh}</span> kcal por dia.</p>}
                </Card>
                <Card className="p-6">
                    <p className="text-gray-700">O plano de 7 dias é focado em emagrecimento. Você pode usar a meta de calorias acima como guia para suas refeições diárias.</p>
                </Card>
            </div>
        </div>
    );
  }

  const weightToLose = weight - targetWeight;

  return (
    <>
      <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">Olá, <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-cyan-600">{name}</span>!</h1>
        <p className="mt-2 text-lg text-gray-600">Aqui está o seu plano calórico para um emagrecimento seguro e eficaz.</p>
        
        <div className="mt-12 space-y-8">
          {targetWeight > 0 && <GoalSummaryCard current={weight} target={targetWeight} diff={weightToLose} unit="kg" />}
          
          <Card className="p-8 bg-gradient-to-br from-teal-500 to-cyan-600 text-white shadow-2xl">
              <h2 className="text-xl font-bold uppercase tracking-wider opacity-80">Sua Meta de Calorias para Emagrecer</h2>
              <p className="text-6xl md:text-7xl font-extrabold my-2">{targetCalories} <span className="text-4xl opacity-80">kcal</span></p>
              <p className="font-medium">Sua faixa segura de déficit é entre <span className="font-bold">{results.deficitLow}</span> e <span className="font-bold">{results.deficitHigh}</span> kcal por dia.</p>
          </Card>
          
          <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Escolha seu ritmo de emagrecimento</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                  <DeficitOption 
                      title="Perda Leve"
                      weeklyLoss="~0.3 kg / semana (dieta)"
                      description="Ideal para quem busca um emagrecimento gradual, flexível e sem grandes restrições."
                      calories={results.lossLight}
                      isActive={targetCalories === results.lossLight}
                      onClick={() => setTargetCalories(results.lossLight)}
                      timeframe={getEstimatedTime(weightToLose, 0.3, exerciseFrequency, activityTypes)}
                  />
                  <DeficitOption 
                      title="Moderado (Recomendado)"
                      weeklyLoss="~0.4 kg / semana (dieta)"
                      description="O equilíbrio perfeito entre resultados consistentes e um plano fácil de seguir a longo prazo."
                      calories={results.lossModerate}
                      isActive={targetCalories === results.lossModerate}
                      onClick={() => setTargetCalories(results.lossModerate)}
                      timeframe={getEstimatedTime(weightToLose, 0.4, exerciseFrequency, activityTypes)}
                  />
                  <DeficitOption 
                      title="Agressivo"
                      weeklyLoss="~0.5 kg / semana (dieta)"
                      description="Para resultados mais rápidos. Exige maior disciplina e pode ser mais desafiador."
                      calories={results.lossAggressive}
                      isActive={targetCalories === results.lossAggressive}
                      onClick={() => setTargetCalories(results.lossAggressive)}
                      timeframe={getEstimatedTime(weightToLose, 0.5, exerciseFrequency, activityTypes)}
                  />
              </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 text-left">
              <Card className="p-6">
                  <h3 className="font-bold text-gray-800 text-lg">Taxa Metabólica Basal (TMB)</h3>
                  <p className="text-3xl font-bold text-teal-600 my-2">{results.bmr} <span className="text-xl">kcal</span></p>
                  <p className="text-sm text-gray-600">São as calorias que seu corpo queima em repouso total, apenas para manter as funções vitais.</p>
              </Card>
              <Card className="p-6">
                  <h3 className="font-bold text-gray-800 text-lg">Gasto Calórico Diário (TDEE)</h3>
                  <p className="text-3xl font-bold text-teal-600 my-2">{results.tdee} <span className="text-xl">kcal</span></p>
                  <p className="text-sm text-gray-600">É o total de calorias que você gasta por dia, incluindo sua TMB e todas as suas atividades.</p>
              </Card>
          </div>
          
          {personalizedTips.length > 0 && (
            <div className="text-left">
                <h3 className="text-xl text-center font-bold text-gray-800 mb-4">💡 Dicas Extras para Você</h3>
                <div className="space-y-4">
                    {personalizedTips.map((tip, index) => (
                        <Card key={index} className="p-4 flex items-start">
                            <span className="text-3xl mr-4">{tip.icon}</span>
                            <div>
                                <h4 className="font-bold text-gray-800">{tip.title}</h4>
                                <p className="text-sm text-gray-600">{tip.text}</p>
                            </div>
                        </Card>
                    ))}
                    <div className="text-center text-xs text-gray-500 pt-2">
                        <strong>Importante:</strong> Estas são dicas gerais e não substituem a orientação do seu médico. Siga sempre as recomendações do profissional que acompanha seu tratamento.
                    </div>
                </div>
            </div>
          )}

          <div className="pt-6">
              <button
                  onClick={() => setShowEmailModal(true)}
                  className="inline-block bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-lg rounded-full px-10 py-4 shadow-lg hover:scale-105 transform transition-transform duration-300"
              >
                  Gerar Plano Personalizado por R$ 7,90
              </button>
          </div>
        </div>
      </div>
      {showEmailModal && <EmailCapture onSuccess={handleEmailSuccess} onClose={() => setShowEmailModal(false)} />}
    </>
  );
};

export default ResultPage;