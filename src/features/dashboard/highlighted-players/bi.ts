import * as gtag from '../../../../lib/gtag';
import { HighlightedPlayerType } from './types';

export const logSpotlightPlayerClicked = (highlightedPlayerType: HighlightedPlayerType) => gtag.clickEvent({
    category: 'spotlight_players',
    label: highlightedPlayerType,
})