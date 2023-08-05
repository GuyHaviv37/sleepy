import * as gtag from '../../../lib/gtag';

export const logUsernameSubmitted = (userId: string, usernameInput: string) => gtag.event({
    action: 'user_submit_form',
    category: 'login',
    label: 'username',
    userId,
    value: usernameInput
  })

export const logContinuedWithLoggedInUser = (userId: string, username: string | undefined) => gtag.event({
  action: 'user_submit_form',
  category: 're-login',
  label: 'username',
  userId,
  value: username,
})

export const logUserLoggedOut = (userId: string | undefined) => gtag.event({
  action: 'user_alert',
  category: 'logout',
  label: 'logout',
  value: userId
})