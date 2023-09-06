export const getConflictScoreColor = (conflictScore: number | undefined) => {
    if (conflictScore === undefined) return;
    if (conflictScore <= 15) {
        return 'text-rose-600'
    } else if (conflictScore <=35) {
        return 'text-rose-400'
    } else if (conflictScore >= 85) {
        return 'text-emerald-500'
    } else if (conflictScore >= 65) {
        return 'text-emerald-200'
    }
}