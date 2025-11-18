/**
 * Envia os dados do plano para a API backend para que o e-mail seja disparado.
 * Em produção, esta função fará uma chamada `fetch` para a API Serverless na Vercel.
 * 
 * @param userEmail O e-mail do destinatário.
 * @param userName O nome do destinatário.
 * @param htmlPlan O conteúdo HTML do plano alimentar.
 * @param searchParamsString A string de parâmetros para gerar o link do plano.
 * @returns Um objeto indicando o sucesso ou falha da operação.
 */
export async function sendPlanEmail(userEmail: string, userName: string, htmlPlan: string, searchParamsString: string) {
    console.log(`Requesting email dispatch for ${userEmail}...`);

    const apiEndpoint = '/api/send-email';

    try {
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userEmail, userName, htmlPlan, searchParamsString }),
        });

        const result = await response.json();

        if (!response.ok) {
            console.error("API error during email dispatch:", result.error);
            return { success: false, error: result.error || 'Failed to communicate with the email API.' };
        }

        console.log("API confirmed email dispatch:", result.message);
        return { success: true, data: result.data };
    } catch (e) {
        console.error("Failed to communicate with the email API:", e);
        const error = e as Error;
        return { success: false, error: error.message };
    }
}
