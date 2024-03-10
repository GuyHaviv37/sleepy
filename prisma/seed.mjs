import fetch from 'node-fetch';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const TEAM_ABV_TO_ID = {
    ARI: -1, // Arizona Cardinals
    ATL: -2, // Atlanta Falcons
    BAL: -3, // Baltimore Ravens
    BUF: -4, // Buffalo Bills
    CAR: -5, // Carolina Panthers
    CHI: -6, // Chicago Bears
    CIN: -7, // Cincinnati Bengals
    CLE: -8, // Cleveland Browns
    DAL: -9, // Dallas Cowboys
    DEN: -10, // Denver Broncos
    DET: -11, // Detroit Lions
    GB: -12, // Green Bay Packers
    HOU: -13, // Houston Texans
    IND: -14, // Indianapolis Colts
    JAX: -15, // Jacksonville Jaguars
    KC: -16, // Kansas City Chiefs
    LV: -17, // Las Vegas Raiders
    LAC: -18, // Los Angeles Chargers
    LAR: -19, // Los Angeles Rams
    MIA: -20, // Miami Dolphins
    MIN: -21, // Minnesota Vikings
    NE: -22, // New England Patriots
    NO: -23, // New Orleans Saints
    NYG: -24, // New York Giants
    NYJ: -25, // New York Jets
    PHI: -26, // Philadelphia Eagles
    PIT: -27, // Pittsburgh Steelers
    SF: -28, // San Francisco 49ers
    SEA: -29, // Seattle Seahawks
    TB: -30, // Tampa Bay Buccaneers
    TEN: -31, // Tennessee Titans
    WAS: -32,
    WSH: -32
}

const extractDataFromApiResponse = (playersDataFromSleeper) => {
    const players = Object.values(playersDataFromSleeper);
    const playersRefinedInfo = players.map((player, index) => {
        const playerNumberId = Number(player.player_id);
        return {
            id: Number.isNaN(playerNumberId) ? TEAM_ABV_TO_ID[player.player_id] : playerNumberId,
            firstName: player.first_name,
            lastName: player.last_name,
            position: player.position,
            team: player.team ?? undefined,
            avatarId: player.espn_id ? player.espn_id.toString() : undefined,
            number: player.number ? player.number.toString() : undefined
        }
    })
    return playersRefinedInfo;
}

const seedPlayersInfo = async () => {
    try {
        console.log('Fetching updated player info from sleeper');
        const playersDataFromSleeper = await (await fetch('https://api.sleeper.app/v1/players/nfl')).json();
        console.log('Fetched, extracting relevant data');
        const playersData = extractDataFromApiResponse(playersDataFromSleeper);
        console.log('Starting to seed DB...');
        await prisma.player.deleteMany();
        console.log('Deleted Records in player table')
        await prisma.player.createMany({
            data: playersData
        })
        console.log('Added updated players to DB');
    } catch (e) {
        console.log(e);
        process.exit(1);
    } finally {
        await prisma.$disconnect;
    }
}

seedPlayersInfo();
export { };