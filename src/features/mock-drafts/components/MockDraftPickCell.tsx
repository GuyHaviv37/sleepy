import type { SleeperDraftPick } from "../mock-drafts.types";

interface MockDraftPickCellProps {
    pick: SleeperDraftPick;
}

const getCellBackgroundColor = (pick: SleeperDraftPick) => {
    switch (pick.metadata.position) {
        case 'QB':
            return 'bg-pink-400/70';
        case 'WR':
            return 'bg-sky-400/70';
        case 'RB':
            return 'bg-emerald-300/70';
        case 'TE':
            return 'bg-amber-400/70';
        case 'DEF':
            return 'bg-orange-700/70';
        default:
            return 'bg-accent'
    }
}

const MockDraftPickCell = ({ pick }: MockDraftPickCellProps) => {
    const { first_name, last_name, position, team } = pick.metadata;

    return (
        <div className={`w-full min-w-0 rounded-lg p-3 flex flex-col gap-1 ${getCellBackgroundColor(pick)}`}>
            <p className="text-primary-text text-xs sm:text-sm font-medium line-clamp-2">
                {first_name} {last_name}
            </p>
            <p className="text-xs">
                {position} · {team}
            </p>
            <p className="text-primary-text text-[10px] sm:text-xs">
                Round {pick.round} · Pick {pick.pick_no}
            </p>
        </div>
    );
};

export default MockDraftPickCell;
