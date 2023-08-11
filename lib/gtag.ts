import { getLocalStorageData } from "@/features/local-storage/local-storage";

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

interface GtagEventProps {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }: GtagEventProps) => {
  const userId = getLocalStorageData('settings')?.sleeperId;
  // @ts-ignore
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
    userId
  })
}

export const clickEvent = (props: Omit<GtagEventProps, 'action'>) => {
  event({
    action: 'user_click',
    ...props
  })
}

export const submitEvent = <T>(props: Omit<GtagEventProps, 'action'> & T) => {
  event({
    action: 'user_submit_form',
    ...props
  });
}

export const alertEvent = (props: Omit<GtagEventProps, 'action'>) => {
  event({
    action: 'user_alert_click',
    ...props
  })
}

export const loadEvent = (props: Omit<GtagEventProps, 'action'>) => {
  event({
    action: 'load_event',
    ...props
  })
}

export const dropdownEvent = (props: Omit<GtagEventProps, 'action'>) => {
  event({
    action: 'dashboard_filters_action',
    ...props
  })
}