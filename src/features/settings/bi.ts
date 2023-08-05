import { LeagueNamesMap, LeagueWeightsMap, LeagueIgnoresMap } from "../local-storage/local-storage";
import * as gtag from '../../../lib/gtag';

type LogSettingsSubmittedProps = {
    userId: string;
    leagueNames: LeagueNamesMap;
    leagueWeightsMap: LeagueWeightsMap;
    leagueIgnoresMap: LeagueIgnoresMap;
    shouldShowMissingStarters: boolean;
  }
  export const logSettingsSubmitted = (settingsProps: LogSettingsSubmittedProps) => gtag.event({
    action: 'user_submit_form',
    category: 'settings',
    label: 'submit',
    value: settingsProps.userId,
    leagues_count: Object.keys(settingsProps.leagueNames).length,
    ignored_leagues: Object.values(settingsProps.leagueIgnoresMap).filter(check => !check).length,
    weighted_leagues: Object.values(settingsProps.leagueWeightsMap).filter(weight => weight > 0).length,
    show_missing_starters: settingsProps.shouldShowMissingStarters
  })
  
  export const logSettingsSkipped = (userId: string) => gtag.event({
    action: 'user_submit_form',
    category: 'settings',
    label: 'skip',
    value: userId
  })