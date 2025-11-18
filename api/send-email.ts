export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { userEmail, userName, htmlPlan } = req.body;

  // Basic validation
  if (!userEmail || !userName || !htmlPlan) {
    return res.status(400).json({ error: 'Missing one or more required fields: userEmail, userName, htmlPlan.' });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  if (!RESEND_API_KEY) {
      console.error("Server configuration error: RESEND_API_KEY is not defined in environment variables.");
      return res.status(500).json({ error: 'Internal server configuration error.' });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'FitCalc Premium <onboarding@resend.dev>',
        to: [userEmail],
        subject: `Seu Plano Personalizado FitCalc está pronto, ${userName}!`,
        html: htmlPlan,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
        console.error('Resend API responded with an error:', data);
        return res.status(response.status).json({ error: 'Failed to send the email.', details: data });
    }
    
    return res.status(200).json({ message: 'Email sent successfully.', data });

  } catch (error) {
    console.error('An unexpected error occurred while trying to send email:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return res.status(500).json({ error: 'Internal server error.', details: errorMessage });
  }
}
