import React, { useState } from 'react';

// Na Vercel, configure esta variável de ambiente com sua Chave de Acesso do Web3Forms
// para o formulário de captura de leads.
const WEB3FORMS_ACCESS_KEY = process.env.WEB3FORMS_ACCESS_KEY || "e54addd5-be36-4fdc-ad35-014f3c1ba81c"; // Chave de exemplo

interface EmailCaptureProps {
  onSuccess: () => void;
  onClose: () => void;
}

const EmailCapture: React.FC<EmailCaptureProps> = ({ onSuccess, onClose }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Por favor, insira um e-mail válido.');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      localStorage.setItem('user_email', email);
      
      const formData = new FormData();
      formData.append("access_key", WEB3FORMS_ACCESS_KEY);
      formData.append("email", email);
      formData.append("name", name || "Não informado");
      formData.append("subject", "Novo lead - Plano 7 Dias FitCalc");
      formData.append("message", `O usuário ${email} solicitou o plano personalizado.`);

      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        console.log("Web3Forms submitted successfully");
        onSuccess();
      } else {
        console.error("Web3Forms error:", data.message);
        // Em caso de falha no envio do e-mail, ainda permitimos o usuário avançar.
        // O e-mail é um bônus, o pagamento é o principal.
        onSuccess();
      }
    } catch (err) {
      console.error(err);
      // Se a API estiver offline, não impedimos o usuário de pagar.
      onSuccess();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full relative transform transition-all scale-100 animate-fade-in-up">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold">&times;</button>
        <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">Só mais um passo!</h2>
            <p className="text-gray-600 mt-2">Digite seu melhor e-mail para receber o acesso ao seu plano.</p>
        </div>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="name-capture" className="block text-sm font-medium text-gray-700">Nome (opcional)</label>
            <input
              id="name-capture"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu primeiro nome"
              className="mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
          <div>
            <label htmlFor="email-capture" className="block text-sm font-medium text-gray-700">E-mail</label>
            <input
              id="email-capture"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seuemail@exemplo.com"
              required
              className={`mt-1 block w-full px-4 py-3 bg-white border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500`}
            />
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-lg text-lg font-bold text-white bg-gradient-to-r from-teal-500 to-cyan-600 hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50"
          >
            {isLoading ? 'Enviando...' : 'Acessar Pagamento'}
          </button>
        </form>
      </div>
       <style>{`
          @keyframes fade-in-up {
              from { opacity: 0; transform: translateY(20px) scale(0.95); }
              to { opacity: 1; transform: translateY(0) scale(1); }
          }
          .animate-fade-in-up {
              animation: fade-in-up 0.3s ease-out forwards;
          }
       `}</style>
    </div>
  );
};

export default EmailCapture;
