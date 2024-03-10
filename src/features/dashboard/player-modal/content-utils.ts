import { getTeamAbvFromDBId } from "@/features/teams/data-transfomers";

export const getPlayerImageById = (playerId: string | undefined) => {
    const isDefPlayerId = Number(playerId) < 0;
    const teamAbvFromDBId = getTeamAbvFromDBId(Number(playerId));
    const playerImageSrc = isDefPlayerId ? `https://sleepercdn.com/images/team_logos/nfl/${teamAbvFromDBId?.toLocaleLowerCase()}.png` : `https://sleepercdn.com/content/nfl/players/${playerId}.jpg`
    return playerImageSrc;
};
