import type { SleeperDraftPick } from "../mock-drafts.types";

interface MockDraftPickCellProps {
    pick: SleeperDraftPick;
}

const MockDraftPickCell = ({ pick }: MockDraftPickCellProps) => {
    const { first_name, last_name, position, team } = pick.metadata;

    return (
        <div className="flex-shrink-0 w-28 sm:w-32 md:w-36 bg-accent rounded-lg p-3 flex flex-col gap-1">
            <p className="text-primary-text text-xs sm:text-sm font-medium line-clamp-2">
                {first_name} {last_name}
            </p>
            <p className="text-gray-400 text-xs">
                {position} · {team}
            </p>
            <p className="text-gray-500 text-[10px] sm:text-xs">
                Round {pick.round} · Pick {pick.pick_no}
            </p>
        </div>
    );
};

export default MockDraftPickCell;
