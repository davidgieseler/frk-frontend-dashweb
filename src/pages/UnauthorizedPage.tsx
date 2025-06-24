import React from 'react';
import { Link } from 'react-router-dom';

const UnauthorizedPage: React.FC = () => {
    return (
        <div className="text-center">
            <h1 className="text-4xl font-bold text-red-500">Acesso Negado</h1>
            <p className="mt-4 text-lg">Você não tem permissão para visualizar esta página.</p>
            <Link
                to="/home"
                className="mt-6 inline-block px-6 py-2 text-sm font-medium text-white bg-[var(--primary-color)] rounded hover:bg-[var(--primary-light)]"
            >
                Voltar para a Página Inicial
            </Link>
        </div>
    );
};

export default UnauthorizedPage;