import fetch from 'node-fetch';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const extractDataFromApiResponse = (playersDataFromSleeper) => {
    const players = Object.values(playersDataFromSleeper);
    const playersRefinedInfo = players.map((player) => {
        return {
            id: player.player_id,
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
export {};