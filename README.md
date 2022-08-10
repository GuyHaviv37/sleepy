# Create T3 App

This is an app bootstrapped according to the [init.tips](https://init.tips) stack, also known as the T3-Stack.

# TODO
- General UI: font pallete - font-primary, font-secondary, font-success, font-error. primary-color, accent-color, alt-color (V)
- General UI: Loader component
- General BE: Plantscale setup (V), Prisma schema for player data, seed data, automated job for seeding
- General CI/CD: Deploy to Vercel (V)
- Login page: titles (V), username form (V), localStorage cache of username (V), submit button + loading state (V)
Logic: validation (V), redirect to user on cache hit (V), redirect to settings on cache miss (new user) (V).
Styling: Title animations/gradient, hover effects for button
- Settings page: fetch leagues (V), localStorage cache (V), weights form (V), submit button (V) + loading state.
- User page: weeks navbar (V), fetch current week logic for initial state, fetch matchup data
- Sleeper logic: extract user/opp matchups data (V), nflWeek & nflWeekDisplay ?, extract player personal data from DB,
attach game info data to each player (fetch & attach)
Basic view:
Roots vs. boos view:
BE work: fetch + maps
