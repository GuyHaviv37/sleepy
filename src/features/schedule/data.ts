import { WEEKS } from "@/utils/consts";
import { fetcher } from "@/utils/fetcher";
import { extractScheduleData } from "./extractors";

export const getScheduleData = async (selectedWeek: WEEKS) => {
    const espnScoreboardData = await fetcher(`https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?seasontype=2&week=${selectedWeek}`);
    if (!espnScoreboardData) return;
    return extractScheduleData(espnScoreboardData);
}