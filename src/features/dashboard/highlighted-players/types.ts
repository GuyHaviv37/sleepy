export const HIGHLIGHTED_PLAYER_TYPES = {
    CONFLICTED: 'CONFLICTED',
    ROOT: 'ROOT',
    BOO: 'BOO',
} as const;

export type HighlightedPlayerType = typeof HIGHLIGHTED_PLAYER_TYPES[keyof typeof HIGHLIGHTED_PLAYER_TYPES];