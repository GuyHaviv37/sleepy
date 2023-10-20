export const getPlayerImageById = (playerId: string | undefined) => {
    const isDefPlayerId = isNaN(Number(playerId));
    const playerImageSrc = isDefPlayerId ? `https://sleepercdn.com/images/team_logos/nfl/${playerId?.toLowerCase()}.png` : `https://sleepercdn.com/content/nfl/players/${playerId}.jpg`
    return playerImageSrc;
};
