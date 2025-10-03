import { useContext } from 'react';
import { Context } from './MainContext';

const useMainContext = () => {
    const context = useContext(Context);

    if (!context) {
        throw new Error('useMainContext must be used within a ContextProvider');
    }

    return context;
};

export default useMainContext;
