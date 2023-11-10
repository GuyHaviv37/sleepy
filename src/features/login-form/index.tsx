'use client'
import Loader from '@/components/Loader';
import { useGetLocalStorage } from '@/features/local-storage/hooks';
import { CacheStatus } from '@/features/local-storage/local-storage.types';
import React from 'react';
import CachedLoginForm from './CachedForm';
import NewUserLoginForm from './NewUserForm';

const LoginForm = () => {
    const { data: cachedUser, cacheStatus: userCacheStatus, clear: clearUserCache } = useGetLocalStorage('user');

    if (userCacheStatus === CacheStatus.LOADING) {
        return <Loader />
    }
    else if (userCacheStatus === CacheStatus.HIT) {
        return <CachedLoginForm cachedSleeperId={cachedUser?.sleeperId} cachedSleeperUsername={cachedUser?.username} clearUserCache={clearUserCache} />
    } else {
        return <NewUserLoginForm />
    }

};

export default LoginForm;
