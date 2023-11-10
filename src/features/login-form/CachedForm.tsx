import React, { useCallback } from 'react';
import * as bi from '@/features/user/bi';
import { useRouter } from 'next/navigation';
import { deleteLocalStorageData } from '../local-storage/local-storage';



interface CachedLoginForm {
    cachedSleeperId: string | undefined;
    cachedSleeperUsername: string | undefined;
    clearUserCache: () => void
}

const CachedLoginForm = (props: CachedLoginForm) => {
    const { cachedSleeperId, cachedSleeperUsername, clearUserCache } = props;
    const router = useRouter();
    const onCachedSubmit = () => {
        const cachedUserId = cachedSleeperId;
        if (cachedUserId) {
            bi.logContinuedWithLoggedInUser();
            router.push(`user/${cachedUserId}`);
        } // @TODO: else show error toast
    }

    const logOffUser = useCallback(() => {
        if (window.confirm('Switching user will delete all saved settings for the previous user. Continue?')) {
            bi.logUserLoggedOut();
            clearUserCache();
            deleteLocalStorageData('user');
            deleteLocalStorageData('settings');
        }
    }, []);

    return (
        <section className="flex flex-col items-center
              md:justify-end">
            <button className="text-primary-text rounded-md bg-alt py-3 px-5 w-fit"
                onClick={onCachedSubmit}>
                Continue with {cachedSleeperUsername} &rarr;
            </button>
            <button className="px-1 mt-2 text-primary-text text-xs tracking-wide md:text-base w-fit"
                onClick={logOffUser}>
                or change to a different user
            </button>
        </section>
    )
};

export default CachedLoginForm;
