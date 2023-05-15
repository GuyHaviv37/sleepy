import { LeagueStarterSpots } from '../local-storage/local-storage';
import type {MissingPlayersNoticeProps} from './MissingPlayersNotice';

export const getMissingPlayersDiff = ({userStarters, playersInfo, scheduleData, leagueStarterSpots}: MissingPlayersNoticeProps & {leagueStarterSpots?: LeagueStarterSpots}) => {
    const startersCountPerLeague: {[leagueId: string]: number} = {};
    Object.entries(userStarters).forEach(([starterId, starterData]) => {
        const starterLeagueIds = Object.keys(starterData.leagues ?? {});
        const starterTeam = playersInfo?.[starterId]?.team ?? 'N/A';
        const starterIsPlaying = !!scheduleData.byTeam[starterTeam];
        if (starterIsPlaying) {
            starterLeagueIds.forEach(leagueId => {
                if (startersCountPerLeague[leagueId]) {
                    // @ts-ignore
                    startersCountPerLeague[leagueId] = startersCountPerLeague[leagueId] + 1;
                } else {
                    startersCountPerLeague[leagueId] = 1;
                }
            })
        }
    });
    const diffInStarters: {[leagueId: string]: number} = Object.keys(startersCountPerLeague).reduce((acc, leagueId) => {
        const diff = (leagueStarterSpots?.[leagueId] ?? 0) - (startersCountPerLeague?.[leagueId] ?? 0);
        return diff > 0 ? {...acc, [leagueId]: diff} : acc;
    }, {})
    const isSomeDiff = Object.keys(diffInStarters).length > 0
    return {diffInStarters, isSomeDiff};
}