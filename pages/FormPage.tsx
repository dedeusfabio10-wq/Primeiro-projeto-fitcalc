import React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { 
    formSchema, 
    FormData, 
    Sex, 
    activityLevelOptions, 
    economicProfileOptions,
    goalOptions,
    dietaryPreferenceOptions,
    dietaryRestrictionOptions,
    mainChallengeOptions,
    sleepQualityOptions,
    exerciseFrequencyOptions,
    ExerciseFrequency,
    activityTypeOptions,
    ActivityType,
    medicationOptions,
    Medication,
    TakesSupplements,
    Goal,
    SmokingStatus,
    smokingStatusOptions,
    AlcoholFrequency,
    alcoholFrequencyOptions,
    HealthCondition,
    healthConditionOptions,
} from '../types';

const FormPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, control, setValue, getValues } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      economicProfile: 'standard',
      goal: 'lose_weight',
      dietaryPreference: 'omnivore',
      dietaryRestriction: 'none',
      sleepQuality: 'regular',
      exerciseFrequency: ExerciseFrequency.OCCASIONAL,
      activityTypes: [ActivityType.WEIGHT_TRAINING],
      mainChallenge: 'cravings',
      medications: [Medication.NONE],
      takesSupplements: TakesSupplements.NO,
      smokingStatus: SmokingStatus.NON_SMOKER,
      alcoholFrequency: AlcoholFrequency.SOCIALLY,
      healthConditions: [HealthCondition.NONE],
    }
  });
  
  const sexValue = useWatch({ control, name: 'sex' });
  const goalValue = useWatch({ control, name: 'goal' });
  const exerciseFrequencyValue = useWatch({ control, name: 'exerciseFrequency' });
  const watchedMedications = useWatch({ control, name: 'medications' });
  const watchedActivityTypes = useWatch({ control, name: 'activityTypes' });
  const takesSupplementsValue = useWatch({ control, name: 'takesSupplements' });
  const smokingStatusValue = useWatch({ control, name: 'smokingStatus' });
  const alcoholFrequencyValue = useWatch({ control, name: 'alcoholFrequency' });
  const watchedHealthConditions = useWatch({ control, name: 'healthConditions' });

  const onSubmit = (data: FormData) => {
    const params = new URLSearchParams(data as any);
    navigate(`/resultado?${params.toString()}`);
  };
  
  const InputField: React.FC<{ name: keyof FormData, label: string, type?: string, placeholder?: string }> = ({ name, label, type = 'number', placeholder }) => (
    <div>
        {/* FIX: Cast `name` to string for `id` and `htmlFor` props as `keyof FormData` is being inferred as a wider type. */}
        <label htmlFor={name as string} className="block text-sm font-medium text-gray-700">{label}</label>
        <input
            id={name as string}
            type={type}
            placeholder={placeholder}
            {...register(name)}
            className={`mt-1 block w-full px-4 py-3 bg-white border ${errors[name] ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm`}
        />
        {errors[name] && <p className="mt-1 text-xs text-red-600">{errors[name]?.message}</p>}
    </div>
  );

  const SelectField: React.FC<{ name: keyof FormData, label: string, options: Record<string, string> }> = ({ name, label, options }) => (
    <div>
        {/* FIX: Cast `name` to string for `id` and `htmlFor` props as `keyof FormData` is being inferred as a wider type. */}
        <label htmlFor={name as string} className="block text-sm font-medium text-gray-700">{label}</label>
        <select
            id={name as string}
            {...register(name)}
            className={`mt-1 block w-full px-3 py-3 bg-white border ${errors[name] ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm`}
        >
            {Object.entries(options).map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
            ))}
        </select>
        {errors[name] && <p className="mt-1 text-xs text-red-600">{errors[name]?.message}</p>}
    </div>
  );

  const FormSection: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <fieldset className="space-y-6 border-t border-gray-200 pt-6">
      <legend className="text-lg font-semibold text-gray-900">{title}</legend>
      {children}
    </fieldset>
  );


  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">Anamnese Premium</h1>
        <p className="mt-2 text-lg text-gray-600">Responda com atenção para um resultado 100% personalizado.</p>
      </div>
      
      <div className="mt-12 bg-white p-8 rounded-2xl shadow-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          
          <FormSection title="1. Dados Básicos">
            <InputField name="name" label="Seu Nome Completo" type="text" placeholder="Ex: Maria da Silva" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField name="weight" label="Peso Atual (kg)" placeholder="Ex: 75" />
              <InputField name="height" label="Altura (cm)" placeholder="Ex: 180" />
            </div>
            <InputField name="age" label="Idade" placeholder="Ex: 30" />
            <div>
              <label className="block text-sm font-medium text-gray-700">Gênero</label>
              <div className="mt-2 grid grid-cols-2 gap-3">
                <label className={`relative flex items-center justify-center p-3 border rounded-md cursor-pointer text-sm font-medium transition-colors duration-200 ${
                  sexValue === Sex.MALE 
                  ? 'bg-teal-500 text-white border-teal-500 shadow-sm' 
                  : 'bg-white text-gray-800 hover:bg-teal-50'
                }`}>
                  <input type="radio" {...register('sex')} value={Sex.MALE} className="sr-only" />
                  Masculino
                </label>
                <label className={`relative flex items-center justify-center p-3 border rounded-md cursor-pointer text-sm font-medium transition-colors duration-200 ${
                  sexValue === Sex.FEMALE
                  ? 'bg-teal-500 text-white border-teal-500 shadow-sm'
                  : 'bg-white text-gray-800 hover:bg-teal-50'
                }`}>
                  <input type="radio" {...register('sex')} value={Sex.FEMALE} className="sr-only" />
                  Feminino
                </label>
              </div>
              {errors.sex && <p className="mt-1 text-xs text-red-600">{errors.sex.message}</p>}
            </div>
            <SelectField name="activityLevel" label="Nível de Atividade Física ATUAL" options={activityLevelOptions} />
          </FormSection>

          <FormSection title="2. Estilo de Vida e Hábitos">
            <SelectField name="sleepQuality" label="Como você avalia a qualidade do seu sono?" options={sleepQualityOptions} />
          </FormSection>

          <FormSection title="3. Estratégia de Emagrecimento">
             <div>
                <label className="block text-sm font-medium text-gray-700">Qual será sua frequência de atividade física?</label>
                <p className="text-xs text-gray-500 mb-3">Isso ajustará a estimativa de tempo para atingir sua meta.</p>
                <div className="mt-2 space-y-3">
                    {Object.entries(exerciseFrequencyOptions).map(([key, value]) => (
                        <label key={key} className={`relative flex items-center p-3 border rounded-md cursor-pointer text-sm font-medium transition-colors duration-200 ${
                            exerciseFrequencyValue === key
                            ? 'bg-teal-500 text-white border-teal-500 shadow-sm'
                            : 'bg-white text-gray-800 hover:bg-teal-50'
                        }`}>
                            <input type="radio" {...register('exerciseFrequency')} value={key} className="sr-only" />
                            {value}
                        </label>
                    ))}
                </div>
                {errors.exerciseFrequency && <p className="mt-1 text-xs text-red-600">{errors.exerciseFrequency.message}</p>}
            </div>

            {exerciseFrequencyValue !== ExerciseFrequency.NONE && (
                <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700">Quais tipos de atividade você pretende fazer?</label>
                    <p className="text-xs text-gray-500 mb-3">Pode marcar mais de uma. Isso deixará a estimativa ainda mais precisa.</p>
                    <div className="space-y-2">
                        {Object.entries(activityTypeOptions).map(([key, value]) => (
                            <label key={key} className={`flex items-center p-3 border rounded-md cursor-pointer text-sm font-medium transition-colors duration-200 ${
                                watchedActivityTypes?.includes(key as ActivityType)
                                ? 'bg-teal-50 border-teal-500 ring-1 ring-teal-500' 
                                : 'bg-white text-gray-800 hover:bg-teal-50'
                            }`}>
                                <input 
                                    type="checkbox" 
                                    value={key}
                                    className="h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500 mr-3"
                                    checked={watchedActivityTypes?.includes(key as ActivityType)}
                                    onChange={(e) => {
                                        const { value, checked } = e.target;
                                        const currentValues = getValues('activityTypes') || [];
                                        
                                        if (checked) {
                                            setValue('activityTypes', [...currentValues, value as ActivityType], { shouldValidate: true });
                                        } else {
                                            setValue('activityTypes', currentValues.filter(v => v !== value), { shouldValidate: true });
                                        }
                                    }}
                                />
                                {value}
                            </label>
                        ))}
                    </div>
                    {errors.activityTypes && <p className="mt-1 text-xs text-red-600">{errors.activityTypes.message}</p>}
                </div>
            )}
          </FormSection>

          <FormSection title="4. Objetivos e Preferências">
            <SelectField name="goal" label="Qual seu objetivo principal?" options={goalOptions} />
             {(goalValue === Goal.LOSE_WEIGHT || goalValue === Goal.GAIN_WEIGHT) && (
                 <div className="transition-all duration-300">
                    <InputField name="targetWeight" label="Qual seu Peso Desejado (kg)?" placeholder="Ex: 65" />
                 </div>
             )}
            <SelectField name="economicProfile" label="Orçamento para Alimentação" options={economicProfileOptions} />
            <SelectField name="dietaryPreference" label="Preferência Alimentar" options={dietaryPreferenceOptions} />
            <SelectField name="dietaryRestriction" label="Possui alguma restrição alimentar?" options={dietaryRestrictionOptions} />
            <SelectField name="mainChallenge" label="Qual seu maior desafio no emagrecimento?" options={mainChallengeOptions} />
          </FormSection>

           <FormSection title="5. Saúde e Histórico">
            <div>
              <label className="block text-sm font-medium text-gray-700">Você é fumante?</label>
              <div className="mt-2 grid grid-cols-2 gap-3">
                {Object.entries(smokingStatusOptions).map(([key, value]) => (
                    <label key={key} className={`relative flex items-center justify-center p-3 border rounded-md cursor-pointer text-sm font-medium transition-colors duration-200 ${
                        smokingStatusValue === key
                        ? 'bg-teal-500 text-white border-teal-500 shadow-sm' 
                        : 'bg-white text-gray-800 hover:bg-teal-50'
                    }`}>
                        <input type="radio" {...register('smokingStatus')} value={key} className="sr-only" />
                        {value}
                    </label>
                ))}
              </div>
              {errors.smokingStatus && <p className="mt-1 text-xs text-red-600">{errors.smokingStatus.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Com que frequência você consome bebidas alcoólicas?</label>
              <div className="mt-2 space-y-3">
                  {Object.entries(alcoholFrequencyOptions).map(([key, value]) => (
                      <label key={key} className={`relative flex items-center p-3 border rounded-md cursor-pointer text-sm font-medium transition-colors duration-200 ${
                          alcoholFrequencyValue === key
                          ? 'bg-teal-500 text-white border-teal-500 shadow-sm'
                          : 'bg-white text-gray-800 hover:bg-teal-50'
                      }`}>
                          <input type="radio" {...register('alcoholFrequency')} value={key} className="sr-only" />
                          {value}
                      </label>
                  ))}
              </div>
              {errors.alcoholFrequency && <p className="mt-1 text-xs text-red-600">{errors.alcoholFrequency.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Você possui alguma destas condições de saúde?</label>
              <p className="text-xs text-gray-500 mb-3">Pode marcar mais de uma. Se não tiver, deixe a primeira opção marcada.</p>
              <div className="space-y-2">
                {Object.entries(healthConditionOptions).map(([key, value]) => (
                  <label key={key} className={`flex items-center p-3 border rounded-md cursor-pointer text-sm font-medium transition-colors duration-200 ${
                      watchedHealthConditions?.includes(key as HealthCondition)
                      ? 'bg-teal-50 border-teal-500 ring-1 ring-teal-500' 
                      : 'bg-white text-gray-800 hover:bg-teal-50'
                  }`}>
                    <input 
                      type="checkbox" 
                      value={key}
                      className="h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500 mr-3"
                      checked={watchedHealthConditions?.includes(key as HealthCondition)}
                      onChange={(e) => {
                          const { value, checked } = e.target;
                          const currentValues = getValues('healthConditions') || [];
                          
                          if (value === HealthCondition.NONE) {
                              setValue('healthConditions', [HealthCondition.NONE], { shouldValidate: true });
                              return;
                          }

                          if (checked) {
                              const newValues = [...currentValues.filter(v => v !== HealthCondition.NONE), value as HealthCondition];
                              setValue('healthConditions', newValues, { shouldValidate: true });
                          } else {
                              let newValues = currentValues.filter(v => v !== value);
                              if (newValues.length === 0) {
                                  newValues = [HealthCondition.NONE];
                              }
                              setValue('healthConditions', newValues, { shouldValidate: true });
                          }
                      }}
                     />
                    {value}
                  </label>
                ))}
              </div>
              {errors.healthConditions && <p className="mt-1 text-xs text-red-600">{errors.healthConditions.message}</p>}
            </div>
          </FormSection>

          <FormSection title="6. Medicação e Suplementos">
            <div>
              <label className="block text-sm font-medium text-gray-700">Você toma alguma medicação para emagrecer?</label>
              <p className="text-xs text-gray-500 mb-3">Pode marcar mais de uma. Se não tomar, deixe a primeira opção marcada.</p>
              <div className="space-y-2">
                {Object.entries(medicationOptions).map(([key, value]) => (
                  <label key={key} className={`flex items-center p-3 border rounded-md cursor-pointer text-sm font-medium transition-colors duration-200 ${
                      watchedMedications?.includes(key as Medication)
                      ? 'bg-teal-50 border-teal-500 ring-1 ring-teal-500' 
                      : 'bg-white text-gray-800 hover:bg-teal-50'
                  }`}>
                    <input 
                      type="checkbox" 
                      value={key}
                      className="h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500 mr-3"
                      checked={watchedMedications?.includes(key as Medication)}
                      onChange={(e) => {
                          const { value, checked } = e.target;
                          const currentValues = getValues('medications');
                          
                          if (value === Medication.NONE) {
                              setValue('medications', [Medication.NONE], { shouldValidate: true });
                              return;
                          }

                          if (checked) {
                              const newValues = [...currentValues.filter(v => v !== Medication.NONE), value];
                              setValue('medications', newValues, { shouldValidate: true });
                          } else {
                              let newValues = currentValues.filter(v => v !== value);
                              if (newValues.length === 0) {
                                  newValues = [Medication.NONE];
                              }
                              setValue('medications', newValues, { shouldValidate: true });
                          }
                      }}
                     />
                    {value}
                  </label>
                ))}
              </div>
              {errors.medications && <p className="mt-1 text-xs text-red-600">{errors.medications.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Você toma algum suplemento (ex: Whey, Creatina)?</label>
              <div className="mt-2 grid grid-cols-2 gap-3">
                <label className={`relative flex items-center justify-center p-3 border rounded-md cursor-pointer text-sm font-medium transition-colors duration-200 ${
                  takesSupplementsValue === TakesSupplements.YES
                  ? 'bg-teal-500 text-white border-teal-500 shadow-sm' 
                  : 'bg-white text-gray-800 hover:bg-teal-50'
                }`}>
                  <input type="radio" {...register('takesSupplements')} value={TakesSupplements.YES} className="sr-only" />
                  Sim
                </label>
                <label className={`relative flex items-center justify-center p-3 border rounded-md cursor-pointer text-sm font-medium transition-colors duration-200 ${
                  takesSupplementsValue === TakesSupplements.NO
                  ? 'bg-teal-500 text-white border-teal-500 shadow-sm'
                  : 'bg-white text-gray-800 hover:bg-teal-50'
                }`}>
                  <input type="radio" {...register('takesSupplements')} value={TakesSupplements.NO} className="sr-only" />
                  Não
                </label>
              </div>
              {errors.takesSupplements && <p className="mt-1 text-xs text-red-600">{errors.takesSupplements.message}</p>}
            </div>
          </FormSection>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-4 px-4 border border-transparent rounded-full shadow-lg text-lg font-bold text-white bg-gradient-to-r from-teal-500 to-cyan-600 hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
            >
              Gerar Meu Resultado Premium
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormPage;