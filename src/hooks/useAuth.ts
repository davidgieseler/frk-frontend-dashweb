import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const useAuth = () => {
    // A asserção 'as' garante ao TypeScript que o valor nunca será nulo
    // Isso funciona porque sempre usaremos este hook dentro do AuthProvider
    return useContext(AuthContext)!;
};

export default useAuth;