import { inferQueryOutput } from "@/utils/trpc";

export const EMOJIES = {
    SWORDS_EMOJI: '⚔',
    THUNDER_EMOJI: '⚡',
    THUMBS_DOWN_EMOJI: '👎',
}

export const POSITION_ORDER = ['QB', 'RB', 'WR', 'TE', 'K', 'DEF'];

export type PlayersInfo = inferQueryOutput<'players.getPlayersInfoByIds'>;

