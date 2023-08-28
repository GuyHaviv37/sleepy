import * as gtag from '../../../lib/gtag';

export const logHomeLinkClicked = () => gtag.clickEvent({
    category: 'home_screen_navbar',
    label: 'home'
});

export const logSettingsLinkClicked = () => gtag.clickEvent({
    category: 'home_screen_navbar',
    label: 'settings'
});

export const logStarterClicked = () => gtag.clickEvent({
    category: 'timeslot_starter',
})