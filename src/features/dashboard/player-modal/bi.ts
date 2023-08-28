import * as gtag from '../../../../lib/gtag';

export const logModalDismissed = () => gtag.loadEvent({
    category: 'player_modal',
    label: 'dismissed'
})