import { createContext } from 'react';

type PlayerModalContextType = {
    openPlayerModal: (playerId: string) => void;
}

export default createContext<PlayerModalContextType>({
    openPlayerModal: () => { return; },
});