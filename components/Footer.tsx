import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-500">
        <p className="font-medium">&copy; {new Date().getFullYear()} FitCalc Premium. Todos os direitos reservados.</p>
        <p className="text-sm mt-2 max-w-2xl mx-auto">Os resultados desta calculadora são estimativas baseadas em fórmulas científicas e devem ser usados como um guia. Para um plano de saúde e nutrição personalizado, consulte um profissional qualificado.</p>
      </div>
    </footer>
  );
};

export default Footer;