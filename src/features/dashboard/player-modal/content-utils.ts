export const getPlayerImageById = (playerId: string | undefined) => {
    const isDefPlayerId = Number(playerId) < 0;
    const playerImageSrc = isDefPlayerId ? `https://sleepercdn.com/images/team_logos/nfl/${playerId?.toLowerCase()}.png` : `https://sleepercdn.com/content/nfl/players/${playerId}.jpg`
    return playerImageSrc;
};
