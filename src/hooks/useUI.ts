// src/hooks/useUI.ts

import { useContext } from 'react';
import UIContext from '../context/UIContext'; // Verifique o caminho

const useUI = () => {
    const context = useContext(UIContext);
    if (!context) {
        // Este erro acontece se você tentar usar o hook fora do UIProvider.
        throw new Error('useUI deve ser usado dentro de um UIProvider');
    }
    return context;
};

export default useUI;