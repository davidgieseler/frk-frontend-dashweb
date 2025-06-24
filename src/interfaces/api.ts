// Interface para uma Organização
export interface Organization {
    id: number;
    name: string;
}

// Interface para a resposta da primeira etapa do login
export interface LoginStep1Response {
    user_id: number;
    organizations: Organization[];
}

// Interface para os tokens de autenticação
export interface AuthTokens {
    access: string;
    refresh: string;
}

// Interface para os Objetos de Acesso da UI, baseada na sua documentação
export interface AccessObject {
    id: number;
    name: string;
    type: 'MENU' | 'COMPONENT' | 'BUTTON' | 'TAB' | string; // Usamos um tipo união para os valores conhecidos
    metadata: {
        href?: string;
        icon?: string;
        label?: string;
        [key: string]: unknown; // Permite outras propriedades em metadata
    };
    description: string;
}

// Interface para o objeto de Usuário (simplificada)
export interface User {
    id: number;
    username: string;
    email: string;
    // Adicione outros campos conforme necessário
}