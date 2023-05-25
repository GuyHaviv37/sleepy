import { useState } from "react";

type SelectedPlayer = { playerId: string; isUser: boolean }

export const usePlayerModal = () => {
    const [showPlayerModal, setShowPlayerModal] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState<SelectedPlayer>({ playerId: '', isUser: true });
    const openPlayerModal = (playerId: string, isUser?: boolean) => {
        setSelectedPlayer({ playerId, isUser: !!isUser });
        setShowPlayerModal(true);
    };
    const dismissPlayerModal = () => {
        setSelectedPlayer({playerId: '', isUser: false});
        setShowPlayerModal(false);
    }

    return {selectedPlayer, openPlayerModal, dismissPlayerModal, showPlayerModal};
}