import { DashboardViewType, WEEKS } from '@/utils/consts';
import * as gtag from '../../../../lib/gtag';



export const logWeeksFilterClicked = (onOrOff: boolean) => gtag.dropdownEvent({
    category: 'weeks_filter',
    label: onOrOff ? 'opened' : 'closed'
})


export const logViewFilterClicked = (onOrOff: boolean) => gtag.dropdownEvent({
    category: 'view_filter',
    label: onOrOff ? 'opened' : 'closed'
})

export const logWeeksFilterItemClicked = (week: WEEKS) => gtag.dropdownEvent({
    category: 'weeks_filter_item',
    label: week
})

export const logViewFilterItemClicked = (viewType: DashboardViewType) => gtag.dropdownEvent({
    category: 'view_filter_item',
    label: viewType
})