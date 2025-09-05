import { useState } from "react";
import { logModalDismissed } from "./bi";

type SelectedPlayer = { playerId: string }

export const usePlayerModal = () => {
    const [showPlayerModal, setShowPlayerModal] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState<SelectedPlayer>({ playerId: '' });
    const openPlayerModal = (playerId: string) => {
        setSelectedPlayer({ playerId });
        setShowPlayerModal(true);
    };
    const dismissPlayerModal = () => {
        logModalDismissed()
        setSelectedPlayer({ playerId: '' });
        setShowPlayerModal(false);
    }

    return { selectedPlayer, openPlayerModal, dismissPlayerModal, showPlayerModal };
}