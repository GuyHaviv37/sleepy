import { Fragment } from "react";
import type { CategoryDraft } from "../extractors";
import { getUserPicks } from "../extractors";
import MockDraftPickCell from "./MockDraftPickCell";

interface MockDraftsGridProps {
    drafts: CategoryDraft[];
    sleeperUserId: string;
    emptyMessage?: string;
}

const MockDraftsGrid = ({
    drafts,
    sleeperUserId,
    emptyMessage = 'No drafts found for this draft slot.',
}: MockDraftsGridProps) => {
    const draftRows = drafts.map(draft => ({
        draftId: draft.metadata.draft_id,
        userPicks: getUserPicks(draft.picks, sleeperUserId),
    }));
    const maxPicks = Math.max(...draftRows.map(row => row.userPicks.length), 0);

    if (draftRows.length === 0) {
        return (
            <p className="text-gray-400 text-sm italic px-1">
                {emptyMessage}
            </p>
        );
    }

    return (
        <div className="overflow-auto max-h-[70vh] scrollbar-thin scrollbar-thumb-secondary-accent scrollbar-track-accent pb-2">
            <div
                className="grid gap-2 min-w-min"
                style={{ gridTemplateColumns: `repeat(${maxPicks}, minmax(9rem, 9rem))` }}
            >
                {draftRows.map(({ draftId, userPicks }) => (
                    <Fragment key={draftId}>
                        {userPicks.map(pick => (
                            <MockDraftPickCell key={`${draftId}-${pick.pick_no}`} pick={pick} />
                        ))}
                        {Array.from({ length: maxPicks - userPicks.length }).map((_, index) => (
                            <div key={`${draftId}-empty-${index}`} aria-hidden="true" />
                        ))}
                    </Fragment>
                ))}
            </div>
        </div>
    );
};

export default MockDraftsGrid;
