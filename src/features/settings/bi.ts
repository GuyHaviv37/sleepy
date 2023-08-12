import { LeagueNamesMap, LeagueWeightsMap, LeagueIgnoresMap } from "../local-storage/local-storage";
import * as gtag from '../../../lib/gtag';

type LogSettingsSubmittedProps = {
    leagueNames: LeagueNamesMap;
    leagueWeightsMap: LeagueWeightsMap;
    leagueIgnoresMap: LeagueIgnoresMap;
    shouldShowMissingStarters: boolean;
  }
export const logSettingsSubmitted = (settingsProps: LogSettingsSubmittedProps) => gtag.submitEvent({
  category: 'settings',
  label: 'submit',
  leagues_count: Object.keys(settingsProps.leagueNames).length,
  ignored_leagues: Object.values(settingsProps.leagueIgnoresMap).filter(check => !check).length,
  weighted_leagues: Object.values(settingsProps.leagueWeightsMap).filter(weight => weight > 0).length,
  show_missing_starters: settingsProps.shouldShowMissingStarters
})

export const logSettingsSkipped = () => gtag.submitEvent({
  category: 'settings',
  label: 'skip',
})