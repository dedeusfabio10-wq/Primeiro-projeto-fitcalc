import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';

const FeatureCard: React.FC<{ icon: string; title: string; text: string }> = ({ icon, title, text }) => (
    <Card className="p-6 text-center flex flex-col items-center h-full">
        <div className="text-4xl mb-4">{icon}</div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{text}</p>
    </Card>
);

const BenefitItem: React.FC<{ icon: string; text: string }> = ({ icon, text }) => (
    <li className="flex items-center space-x-3">
        <span className="text-2xl">{icon}</span>
        <span className="font-medium text-gray-700">{text}</span>
    </li>
);

const ChecklistItem: React.FC<{ text: string }> = ({ text }) => (
  <li className="flex items-start space-x-3">
    <div className="flex-shrink-0 pt-1">
      <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
      </svg>
    </div>
    <p className="text-gray-700 text-lg">{text}</p>
  </li>
);

const StepCard: React.FC<{ number: string; title: string; text: string }> = ({ number, title, text }) => (
  <div className="text-center">
    <div className="flex items-center justify-center h-16 w-16 mx-auto bg-gradient-to-br from-teal-500 to-cyan-600 text-white rounded-full text-2xl font-bold shadow-lg ring-4 ring-white">
      {number}
    </div>
    <h3 className="mt-5 text-xl font-bold text-gray-800">{title}</h3>
    <p className="mt-2 text-gray-600">{text}</p>
  </div>
);

const TestimonialCard: React.FC<{ quote: string; name: string; result: string; imageUrl: string }> = ({ quote, name, result, imageUrl }) => (
  <Card className="p-8 flex flex-col h-full bg-white">
    <div className="text-yellow-400 mb-4 text-2xl">
      {'★★★★★'}
    </div>
    <blockquote className="text-gray-700 italic text-lg flex-grow">"{quote}"</blockquote>
    <footer className="mt-6 flex items-center">
        <img className="h-14 w-14 rounded-full object-cover mr-4 shadow-sm" src={imageUrl} alt={`Foto de ${name}`} />
        <div>
            <p className="font-bold text-gray-900 text-lg">{name}</p>
            <p className="text-sm text-teal-600 font-semibold">{result}</p>
        </div>
    </footer>
  </Card>
);


const HomePage: React.FC = () => {
  return (
    <div className="space-y-20 md:space-y-32 pb-20">
      {/* Hero Section */}
      <section className="text-center pt-12 md:pt-20 pb-12 md:pb-20 bg-gradient-to-b from-cyan-100 to-teal-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
            Descubra Suas Calorias Ideais e <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-cyan-600">Emagreça com Segurança</span>
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-gray-600">
            Cálculo científico, visual premium e um plano de ação simples para você começar hoje, sem adivinhação.
            </p>
            <div className="mt-10">
            <Link
                to="/form"
                className="inline-block bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-bold text-lg rounded-full px-10 py-4 shadow-lg hover:scale-105 transform transition-transform duration-300"
            >
                Quero Calcular Agora
            </Link>
            <p className="mt-4 text-sm text-gray-500">Junte-se a milhares de pessoas que transformaram o corpo.</p>
            </div>
        </div>
      </section>

      {/* "Is this for you?" Section */}
       <section className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                <div className="text-center md:text-left">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">Cansado(a) de tentar e não ver resultados?</h2>
                    <p className="mt-4 text-lg text-gray-600">Se você se identifica com algum destes pontos, o FitCalc Premium foi feito para você.</p>
                </div>
                <Card className="p-8">
                    <ul className="space-y-4">
                        <ChecklistItem text="Já tentou de tudo para emagrecer e se frustrou?" />
                        <ChecklistItem text="Está confuso(a) com tanta informação contraditória?" />
                        <ChecklistItem text="Quer um método baseado em ciência, sem dietas malucas?" />
                        <ChecklistItem text="Busca um ponto de partida claro e seguro para sua jornada?" />
                    </ul>
                </Card>
            </div>
      </section>

      {/* How it works Section */}
      <section className="bg-white py-20 ring-1 ring-slate-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900">Sua transformação em 3 passos simples</h2>
            <p className="text-center text-gray-600 mt-2 max-w-xl mx-auto">Desenvolvemos um processo intuitivo para te dar clareza e direção.</p>
            <div className="grid md:grid-cols-3 gap-10 md:gap-16 mt-16 max-w-5xl mx-auto">
                <StepCard number="1" title="Anamnese Inteligente" text="Preencha nosso formulário detalhado em 2 minutos. Entendemos seus dados, hábitos e objetivos." />
                <StepCard number="2" title="Receba sua Meta" text="Nossa calculadora usa a fórmula Mifflin-St Jeor para definir sua meta calórica precisa e segura." />
                <StepCard number="3" title="Siga o Plano Exemplo" text="Receba um plano de 7 dias delicioso e personalizado para o seu orçamento e preferências." />
            </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900">Resultados que falam por si</h2>
        <p className="text-center text-gray-600 mt-2 max-w-xl mx-auto">Veja o que nossos usuários estão dizendo sobre a clareza e eficácia do FitCalc.</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            <TestimonialCard 
                quote="Finalmente entendi o que meu corpo precisa! O plano é simples e delicioso. A melhor decisão que tomei para minha saúde."
                name="Juliana S."
                result="Resultado: Perdeu 8kg em 2 meses"
                imageUrl="https://randomuser.me/api/portraits/women/44.jpg"
            />
            <TestimonialCard 
                quote="Não é só sobre perder peso. Minha disposição mudou completamente. A calculadora é precisa e o plano é fácil de seguir no dia a dia."
                name="Marcos A."
                result="Resultado: Mais energia e -5kg na balança"
                imageUrl="https://randomuser.me/api/portraits/men/32.jpg"
            />
            <TestimonialCard 
                quote="Estava perdida sem saber por onde começar. O FitCalc me deu o mapa exato do que fazer. Já vejo resultados nas primeiras semanas!"
                name="Carla P."
                result="Resultado: Foco e resultados consistentes"
                imageUrl="https://randomuser.me/api/portraits/women/67.jpg"
            />
        </div>
      </section>

      {/* What you'll receive section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 lg:flex lg:items-center lg:justify-between gap-8 border">
            <div className="lg:w-1/2">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">O que você vai receber</h2>
                <p className="mt-3 text-gray-600 text-lg">Um kit completo para dar o start no seu emagrecimento com o pé direito.</p>
                <ul className="mt-8 space-y-4">
                    <BenefitItem icon="🎯" text="Sua meta calórica personalizada" />
                    <BenefitItem icon="🍽️" text="Mini plano alimentar de 7 dias" />
                    <BenefitItem icon="🔥" text="Estratégia de déficit calórico seguro" />
                    <BenefitItem icon="📉" text="Regras simples para resultados visíveis" />
                </ul>
            </div>
            <div className="mt-10 lg:mt-0 text-center lg:w-1/2">
                 <Link
                    to="/form"
                    className="inline-block bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-bold text-xl rounded-full px-12 py-5 shadow-lg hover:scale-105 transform transition-transform duration-300"
                >
                    Começar meu cálculo
                </Link>
            </div>
        </div>
      </section>

       {/* Why Calculate Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900">A Ciência por Trás do Sucesso</h2>
        <p className="text-center text-gray-600 mt-2 max-w-xl mx-auto">Entender sua necessidade calórica é o pilar para um emagrecimento que funciona e se mantém.</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            <FeatureCard icon="✂️" title="Corte só o necessário" text="Evite dietas malucas e aprenda o déficit inteligente para perder gordura, não saúde." />
            <FeatureCard icon="🔬" title="Baseado em ciência" text="Usamos a fórmula mais validada do mundo (Mifflin-St Jeor) para precisão máxima." />
            <FeatureCard icon="📈" title="Evita platôs" text="Saber sua meta diária evita que seu corpo se adapte e pare de responder ao estímulo." />
            <FeatureCard icon="🏆" title="Resultados melhores" text="Comer certo acelera o emagrecimento, preserva massa magra e melhora sua energia." />
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
         <div className="relative text-center bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-3xl py-16 md:py-24 px-8 overflow-hidden ring-1 ring-white/10">
             <div className="absolute top-0 left-0 w-full h-full bg-cover opacity-10" style={{backgroundImage: "url('https://www.transparenttextures.com/patterns/subtle-carbon.png')"}}></div>
            <div className="relative">
                <h2 className="text-3xl md:text-5xl font-extrabold">Pronto para Transformar seu Corpo com Inteligência?</h2>
                <p className="mt-4 max-w-xl mx-auto text-lg text-gray-300">Chega de adivinhar. Receba seu cálculo científico + plano de 7 dias e comece a ver resultados de verdade.</p>
                 <div className="mt-10">
                    <Link
                        to="/form"
                        className="inline-block bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-bold text-xl rounded-full px-12 py-5 shadow-lg hover:scale-105 transform transition-transform duration-300"
                    >
                        Quero Começar Minha Transformação
                    </Link>
                </div>
            </div>
         </div>
      </section>
    </div>
  );
};

export default HomePage;