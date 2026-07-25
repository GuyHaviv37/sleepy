import * as gtag from '../../../lib/gtag';

export const logHomeLinkClicked = () => gtag.clickEvent({
    category: 'home_screen_navbar',
    label: 'home'
});

export const logDashboardLinkClicked = () => gtag.clickEvent({
    category: 'mock_drafts_screen_navbar',
    label: 'dashboard'
});

export const logSettingsLinkClicked = () => gtag.clickEvent({
    category: 'home_screen_navbar',
    label: 'settings'
});

export const logMockDraftsLinkClicked = () => gtag.clickEvent({
    category: 'home_screen_navbar',
    label: 'mock_drafts'
});

export const logStarterClicked = () => gtag.clickEvent({
    category: 'timeslot_starter',
})