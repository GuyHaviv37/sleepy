import { createContext } from 'react';

type PlayerModalContextType = {
    openPlayerModal: (playerId: string, isUser?: boolean) => void;
}

export default createContext<PlayerModalContextType>({
    openPlayerModal: () =>  {return;},
});