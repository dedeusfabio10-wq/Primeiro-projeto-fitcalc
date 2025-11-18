export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, name } = req.body;
  const WEB3FORMS_ACCESS_KEY = process.env.WEB3FORMS_ACCESS_KEY;

  if (!WEB3FORMS_ACCESS_KEY) {
    console.error("Server configuration error: WEB3FORMS_ACCESS_KEY is not set.");
    // Proceed without submitting the form, as the original code did.
    // The main flow is payment, not lead capture.
    return res.status(200).json({ success: true, message: "Skipped form submission due to server config." });
  }

  if (!email) {
    return res.status(400).json({ error: "Email is required." });
  }

  try {
    const formData = new FormData();
    formData.append("access_key", WEB3FORMS_ACCESS_KEY);
    formData.append("email", email);
    formData.append("name", name || "Não informado");
    formData.append("subject", "Novo lead - Plano 7 Dias FitCalc");
    formData.append("message", `O usuário ${email} solicitou o plano personalizado.`);

    const web3formsResponse = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      // FormData sets the correct multipart/form-data header automatically
      body: formData,
    });

    const data = await web3formsResponse.json();

    if (data.success) {
      return res.status(200).json({ success: true, message: "Form submitted successfully." });
    } else {
      console.error("Web3Forms API error:", data.message);
      // Even if it fails, we don't want to block the user.
      return res.status(200).json({ success: true, message: "Proceeding despite form submission error." });
    }
  } catch (error) {
    console.error("Error submitting to Web3Forms:", error);
    // Again, don't block the user.
    return res.status(200).json({ success: true, message: "Proceeding despite form submission error." });
  }
}
