import { PlanData } from '../services/planGenerator';
import { economicProfileOptions } from '../types';

// This function generates an HTML string representation of the plan,
// suitable for sending in an email. It uses inline styles for compatibility.
export function generatePlanHTML(planData: PlanData): string {
    const mealPlanHtml = planData.mealPlans.map(plan => `
        <div style="margin-bottom: 16px; padding: 16px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff;">
            <h3 style="margin: 0 0 12px 0; color: #0d9488; font-size: 20px; font-weight: bold;">${plan.day}</h3>
            <p style="margin: 8px 0; font-size: 15px; color: #334155;"><strong>☕ Café da Manhã:</strong> ${plan.meals.breakfast}</p>
            <p style="margin: 8px 0; font-size: 15px; color: #334155;"><strong>☀️ Almoço:</strong> ${plan.meals.lunch}</p>
            <p style="margin: 8px 0; font-size: 15px; color: #334155;"><strong>🌙 Jantar:</strong> ${plan.meals.dinner}</p>
            <p style="margin: 8px 0; font-size: 15px; color: #334155;"><strong>🍎 Lanche:</strong> ${plan.meals.snack}</p>
        </div>
    `).join('');

    const tipsHtml = planData.personalizedTips.map(tip => `
        <div style="margin-bottom: 12px; padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff; display: flex; align-items: flex-start;">
            <span style="font-size: 24px; margin-right: 12px; line-height: 1.5;">${tip.icon}</span>
            <div>
                <h4 style="margin: 0 0 4px 0; font-size: 16px; font-weight: bold; color: #1e293b;">${tip.title}</h4>
                <p style="margin: 0; font-size: 14px; color: #475569;">${tip.text}</p>
            </div>
        </div>
    `).join('');

    return `
      <div style="font-family: 'Poppins', Arial, sans-serif; color: #334155; background-color: #f8fafc; padding: 20px; line-height: 1.6;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden;">
            <div style="padding: 24px; text-align: center; background-color: #f0fdfa; border-bottom: 1px solid #e2e8f0;">
                <h1 style="margin: 0; font-size: 28px; font-weight: 800; color: #1e293b;">${planData.name ? `${planData.name}, seu Plano!` : 'Seu Plano Personalizado'}</h1>
                <p style="margin: 8px 0 0 0; font-size: 16px; color: #475569;">
                    Este é um plano <strong>exemplo</strong> para sua meta de <strong style="color: #0d9488;">${planData.calories} kcal</strong>.
                </p>
                <p style="margin: 4px 0 0 0; font-size: 14px; color: #475569; background-color: #ccfbf1; border: 1px solid #99f6e4; border-radius: 9999px; display: inline-block; padding: 4px 12px;">
                    Plano ${planData.dietaryPreference === 'vegetarian' ? 'Vegetariano' : 'Onívoro'} / Orçamento: <strong>${economicProfileOptions[planData.economicProfile].split(' (')[0]}</strong>
                </p>
            </div>
            
            <div style="padding: 24px;">
                <h2 style="font-size: 22px; font-weight: bold; color: #1e293b; text-align: center; margin-top: 0; margin-bottom: 20px;">Cardápio Sugerido de 7 Dias</h2>
                ${mealPlanHtml}
            </div>

            <div style="padding: 24px; background-color: #f0fdfa;">
                <h2 style="font-size: 22px; font-weight: bold; color: #1e293b; text-align: center; margin-top: 0; margin-bottom: 20px;">Dicas de Ouro para sua Jornada</h2>
                ${tipsHtml}
            </div>
             <div style="padding: 24px; text-align: center; border-top: 1px solid #e2e8f0;">
                 <p style="margin: 0; font-size: 12px; color: #64748b;">Este plano é uma sugestão. Para um acompanhamento detalhado, consulte um nutricionista. &copy; FitCalc Premium</p>
            </div>
        </div>
      </div>
    `;
}
