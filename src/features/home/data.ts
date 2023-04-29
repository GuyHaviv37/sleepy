import { fetcher } from "@/utils/fetcher";
import { setLocalStorageData } from "@/utils/localStorage";

type SleeperUserData = { username: string, user_id: string };

const getSleeperUserData = async (username: string): Promise<SleeperUserData> => {
    return fetcher(`https://api.sleeper.app/v1/user/${username}`);
};

export const submitNewUser = async (usernameInput: string) => {
    try {
        const userData = await getSleeperUserData(usernameInput);
        if (userData) {
            setLocalStorageData('user', {
                username: usernameInput,
                sleeperId: userData.user_id
            })
        }
        return userData;
    } catch (error) {
        console.error('Failed to submit user with username: ', usernameInput);
        throw error;
    }
}