import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Card from '../components/Card';

const PaymentFailurePage: React.FC = () => {
    const [searchParams] = useSearchParams();

    return (
        <div className="max-w-md mx-auto py-12 px-4 text-center">
            <Card className="p-8">
                <div className="text-5xl mb-4">😢</div>
                <h1 className="text-2xl font-bold text-red-700">Ocorreu um Erro no Pagamento</h1>
                <p className="text-gray-600 mt-4">Não foi possível processar seu pagamento. Por favor, verifique seus dados ou tente novamente mais tarde.</p>
                <div className="mt-8">
                    <Link
                        to={`/pagamento?${searchParams.toString()}`}
                        className="inline-block bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-bold text-lg rounded-full px-10 py-3 shadow-lg hover:scale-105 transform transition-transform duration-300"
                    >
                        Tentar Novamente
                    </Link>
                </div>
            </Card>
        </div>
    );
};

export default PaymentFailurePage;
