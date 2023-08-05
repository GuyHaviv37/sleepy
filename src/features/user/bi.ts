import * as gtag from '../../../lib/gtag';


export const logUsernameSubmitted = (usernameInput: string) => gtag.submitEvent({
    category: 'login',
    label: 'new',
    username: usernameInput
  })

export const logContinuedWithLoggedInUser = () => gtag.submitEvent({
  category: 'login',
  label: 'continue',
})

export const logUserLoggedOut = () => gtag.event({
  action: 'user_alert',
  category: 'logout',
  label: 'logout',
})