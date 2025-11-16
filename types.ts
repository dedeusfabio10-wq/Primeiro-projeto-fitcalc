import { z } from 'zod';

export enum Sex {
  MALE = 'male',
  FEMALE = 'female',
}

export enum ActivityLevel {
  SEDENTARY = 'sedentary',
  LIGHT = 'light',
  MODERATE = 'moderate',
  INTENSE = 'intense',
  ATHLETE = 'athlete',
}

export enum EconomicProfile {
  ECONOMICAL = 'economical',
  STANDARD = 'standard',
  FLEXIBLE = 'flexible',
}

export enum Goal {
  LOSE_WEIGHT = 'lose_weight',
  MAINTAIN_WEIGHT = 'maintain_weight',
  GAIN_WEIGHT = 'gain_weight',
}

export enum DietaryPreference {
  OMNIVORE = 'omnivore',
  VEGETARIAN = 'vegetarian',
}

export enum DietaryRestriction {
    NONE = 'none',
    GLUTEN_INTOLERANCE = 'gluten_intolerance',
    LACTOSE_INTOLERANCE = 'lactose_intolerance',
}

export enum MainChallenge {
    LACK_OF_TIME = 'lack_of_time',
    CRAVINGS = 'cravings',
    SOCIAL_EVENTS = 'social_events',
    LACK_OF_MOTIVATION = 'lack_of_motivation',
}

export enum SleepQuality {
    GOOD = 'good',
    REGULAR = 'regular',
    POOR = 'poor',
}

export enum ExerciseFrequency {
    NONE = 'none',
    OCCASIONAL = 'occasional', // 1-2x
    REGULAR = 'regular', // 3-4x
    INTENSE = 'intense', // 5x+
}

export enum ActivityType {
    WALKING = 'walking',
    RUNNING = 'running',
    WEIGHT_TRAINING = 'weight_training',
    FUNCTIONAL = 'functional',
    CYCLING = 'cycling',
    SWIMMING = 'swimming',
}

export enum Medication {
    NONE = 'none',
    SIBUTRAMINA = 'sibutramina',
    ORLISTAT = 'orlistat',
    LIRAGLUTIDA = 'liraglutida', // Saxenda
    SEMAGLUTIDA = 'semaglutida', // Ozempic, Wegovy
    OTHER = 'other',
}

export enum TakesSupplements {
    NO = 'no',
    YES = 'yes',
}

export enum SmokingStatus {
    SMOKER = 'smoker',
    NON_SMOKER = 'non_smoker',
}

export enum AlcoholFrequency {
    NONE = 'none',
    SOCIALLY = 'socially', // Fim de semana/eventos
    FREQUENTLY = 'frequently', // 3x ou mais na semana
}

export enum HealthCondition {
    NONE = 'none',
    DIABETES = 'diabetes',
    HIGH_BLOOD_PRESSURE = 'high_blood_pressure',
    CHOLESTEROL = 'cholesterol',
    THYROID = 'thyroid', // Hipotireoidismo/Hipertireoidismo
}


export const activityLevelOptions: Record<ActivityLevel, string> = {
  [ActivityLevel.SEDENTARY]: 'Sedentário (escritório, pouco ou nenhum exercício)',
  [ActivityLevel.LIGHT]: 'Leve (exercício 1-3 dias/semana)',
  [ActivityLevel.MODERATE]: 'Moderado (exercício 3-5 dias/semana)',
  [ActivityLevel.INTENSE]: 'Intenso (exercício 6-7 dias/semana)',
  [ActivityLevel.ATHLETE]: 'Atleta (exercício pesado diário ou 2x por dia)',
};

export const economicProfileOptions: Record<EconomicProfile, string> = {
    [EconomicProfile.ECONOMICAL]: 'Econômico (busco opções mais baratas)',
    [EconomicProfile.STANDARD]: 'Padrão (equilíbrio entre custo e variedade)',
    [EconomicProfile.FLEXIBLE]: 'Flexível (ingredientes mais variados/nobres)',
};

export const goalOptions: Record<Goal, string> = {
    [Goal.LOSE_WEIGHT]: 'Emagrecer (déficit calórico)',
    [Goal.MAINTAIN_WEIGHT]: 'Manter meu peso atual',
    [Goal.GAIN_WEIGHT]: 'Ganhar peso (superávit calórico)',
};

export const dietaryPreferenceOptions: Record<DietaryPreference, string> = {
    [DietaryPreference.OMNIVORE]: 'Onívoro (como de tudo)',
    [DietaryPreference.VEGETARIAN]: 'Vegetariano (não como carnes)',
};

export const dietaryRestrictionOptions: Record<DietaryRestriction, string> = {
    [DietaryRestriction.NONE]: 'Nenhuma',
    [DietaryRestriction.GLUTEN_INTOLERANCE]: 'Intolerância a Glúten',
    [DietaryRestriction.LACTOSE_INTOLERANCE]: 'Intolerância a Lactose',
};

export const mainChallengeOptions: Record<MainChallenge, string> = {
    [MainChallenge.LACK_OF_TIME]: 'Falta de tempo para cozinhar',
    [MainChallenge.CRAVINGS]: 'Vontade de comer doces / besteiras',
    [MainChallenge.SOCIAL_EVENTS]: 'Comer fora e eventos sociais',
    [MainChallenge.LACK_OF_MOTIVATION]: 'Falta de motivação e consistência',
};

export const sleepQualityOptions: Record<SleepQuality, string> = {
    [SleepQuality.GOOD]: 'Boa (7-9 horas, sinto-me descansado)',
    [SleepQuality.REGULAR]: 'Regular (5-7 horas, às vezes cansado)',
    [SleepQuality.POOR]: 'Ruim (menos de 5 horas, sempre cansado)',
};

export const exerciseFrequencyOptions: Record<ExerciseFrequency, string> = {
    [ExerciseFrequency.NONE]: 'Apenas com alimentação por enquanto',
    [ExerciseFrequency.OCCASIONAL]: 'Atividade física 1-2x por semana',
    [ExerciseFrequency.REGULAR]: 'Atividade física 3-4x por semana',
    [ExerciseFrequency.INTENSE]: 'Atividade física 5x ou mais por semana',
};

export const activityTypeOptions: Record<ActivityType, string> = {
    [ActivityType.WALKING]: 'Caminhada / Corrida Leve',
    [ActivityType.RUNNING]: 'Corrida Intensa',
    [ActivityType.WEIGHT_TRAINING]: 'Musculação / Academia',
    [ActivityType.FUNCTIONAL]: 'Funcional / CrossFit',
    [ActivityType.CYCLING]: 'Bicicleta (Ciclismo)',
    [ActivityType.SWIMMING]: 'Natação',
};

export const medicationOptions: Record<Medication, string> = {
    [Medication.NONE]: 'Não tomo nenhuma medicação',
    [Medication.SIBUTRAMINA]: 'Sibutramina',
    [Medication.ORLISTAT]: 'Orlistat (Xenical)',
    [Medication.LIRAGLUTIDA]: 'Liraglutida (Saxenda, Victoza)',
    [Medication.SEMAGLUTIDA]: 'Semaglutida (Ozempic, Wegovy, Rybelsus)',
    [Medication.OTHER]: 'Outra',
};

export const takesSupplementsOptions: Record<TakesSupplements, string> = {
    [TakesSupplements.NO]: 'Não',
    [TakesSupplements.YES]: 'Sim',
};

export const smokingStatusOptions: Record<SmokingStatus, string> = {
    [SmokingStatus.SMOKER]: 'Sim',
    [SmokingStatus.NON_SMOKER]: 'Não',
};

export const alcoholFrequencyOptions: Record<AlcoholFrequency, string> = {
    [AlcoholFrequency.NONE]: 'Não consumo álcool',
    [AlcoholFrequency.SOCIALLY]: 'Socialmente (Fins de semana/eventos)',
    [AlcoholFrequency.FREQUENTLY]: 'Com frequência (3x ou mais na semana)',
};

export const healthConditionOptions: Record<HealthCondition, string> = {
    [HealthCondition.NONE]: 'Nenhuma condição',
    [HealthCondition.DIABETES]: 'Diabetes (Tipo 1 ou 2)',
    [HealthCondition.HIGH_BLOOD_PRESSURE]: 'Pressão Alta (Hipertensão)',
    [HealthCondition.CHOLESTEROL]: 'Colesterol Alto',
    [HealthCondition.THYROID]: 'Problemas de Tireoide (Hipo/Hipertireoidismo)',
};


export const activityLevelFactors: Record<ActivityLevel, number> = {
  [ActivityLevel.SEDENTARY]: 1.2,
  [ActivityLevel.LIGHT]: 1.375,
  [ActivityLevel.MODERATE]: 1.55,
  [ActivityLevel.INTENSE]: 1.725,
  [ActivityLevel.ATHLETE]: 1.9,
};

export const formSchema = z.object({
  // Personal Info
  name: z.string().min(2, { message: 'Nome muito curto' }).max(50, { message: 'Nome muito longo' }),
  
  // Basic
  weight: z.coerce.number().min(30, { message: 'Peso inválido' }).max(300, { message: 'Peso inválido' }),
  height: z.coerce.number().min(100, { message: 'Altura inválida' }).max(250, { message: 'Altura inválida' }),
  age: z.coerce.number().min(16, { message: 'Idade mínima: 16 anos' }).max(100, { message: 'Idade inválida' }),
  sex: z.nativeEnum(Sex, { errorMap: () => ({ message: 'Selecione o gênero' }) }),
  activityLevel: z.nativeEnum(ActivityLevel, { errorMap: () => ({ message: 'Selecione seu nível de atividade' }) }),
  
  // Lifestyle
  sleepQuality: z.nativeEnum(SleepQuality, { errorMap: () => ({ message: 'Selecione a qualidade do seu sono' }) }),
  exerciseFrequency: z.nativeEnum(ExerciseFrequency, { errorMap: () => ({ message: 'Selecione sua estratégia de exercícios' }) }),
  activityTypes: z.array(z.nativeEnum(ActivityType)).optional(),

  // Goals & Preferences
  goal: z.nativeEnum(Goal, { errorMap: () => ({ message: 'Selecione seu objetivo' }) }),
  targetWeight: z.coerce.number().optional(),
  economicProfile: z.nativeEnum(EconomicProfile, { errorMap: () => ({ message: 'Selecione seu orçamento' }) }),
  dietaryPreference: z.nativeEnum(DietaryPreference, { errorMap: () => ({ message: 'Selecione sua preferência' }) }),
  dietaryRestriction: z.nativeEnum(DietaryRestriction, { errorMap: () => ({ message: 'Selecione uma opção' }) }),
  mainChallenge: z.nativeEnum(MainChallenge, { errorMap: () => ({ message: 'Selecione seu maior desafio' }) }),
  
  // Health & History
  smokingStatus: z.nativeEnum(SmokingStatus, { errorMap: () => ({ message: 'Selecione uma opção' }) }),
  alcoholFrequency: z.nativeEnum(AlcoholFrequency, { errorMap: () => ({ message: 'Selecione uma opção' }) }),
  healthConditions: z.array(z.nativeEnum(HealthCondition)).min(1, { message: 'Selecione pelo menos uma opção' }),

  // Medication & Supplements
  medications: z.array(z.nativeEnum(Medication)).min(1, { message: 'Selecione pelo menos uma opção' }),
  takesSupplements: z.nativeEnum(TakesSupplements, { errorMap: () => ({ message: 'Selecione uma opção' }) }),
})
.refine(data => {
    if (data.goal === Goal.LOSE_WEIGHT || data.goal === Goal.GAIN_WEIGHT) {
        return data.targetWeight !== undefined && data.targetWeight > 0;
    }
    return true;
}, {
    message: 'Informe seu peso desejado.',
    path: ['targetWeight'],
})
.refine(data => {
    if (data.goal === Goal.LOSE_WEIGHT && data.targetWeight) {
        return data.targetWeight < data.weight;
    }
    return true;
}, {
    message: 'O peso desejado deve ser menor que o peso atual.',
    path: ['targetWeight'],
})
.refine(data => {
    if (data.goal === Goal.GAIN_WEIGHT && data.targetWeight) {
        return data.targetWeight > data.weight;
    }
    return true;
}, {
    message: 'O peso desejado deve ser maior que o peso atual.',
    path: ['targetWeight'],
})
.refine(data => {
    if (data.exerciseFrequency !== ExerciseFrequency.NONE) {
        return data.activityTypes && data.activityTypes.length > 0;
    }
    return true;
}, {
    message: 'Selecione pelo menos um tipo de atividade.',
    path: ['activityTypes'],
});

export type FormData = z.infer<typeof formSchema>;