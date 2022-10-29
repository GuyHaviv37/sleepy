import * as gtag from './gtag';

export const registerUsernameSubmit = (usernameInput: string) => gtag.event({
    action: 'user_submit_form',
    category: 'Main',
    label: 'username',
    value: usernameInput,
  })

export const registerUpdateNoticeClick = () => gtag.event({
    action: 'update_notice_click',
    category: 'Update_Notices',
    label: 'ignore_leagues_feature',
    value: true,
  })