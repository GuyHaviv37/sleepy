import type { NextPage } from "next";
import { ChangeEvent, useCallback, useState } from "react";
import { useRouter } from 'next/router';
import Loader from "@/components/Loader";
import * as bi from '../../lib/bi';
import { useMutation } from "react-query";
import { submitNewUser } from "@/features/user/data";
import { useGetLocalStorage } from "@/features/local-storage/hooks";
import { CacheStatus } from "@/features/local-storage/local-storage.types";
import AppHeader from "@/components/layout/AppHeader";
import { deleteLocalStorageData } from "@/features/local-storage/local-storage";
import FlexibleContainer from "@/components/layout/FlexibleContainer";

const Home: NextPage = () => {
  const router = useRouter();
  const [usernameInput, setUsernameInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const submitMutation = useMutation(submitNewUser, {
    onMutate: () => setErrorMessage(''),
    onSuccess: (user) => {
      bi.registerUsernameSubmit(user.username);
      router.push({
        pathname: `user/${user.user_id}/settings`,
        query: { fromLogin: true }
      }, `user/${user.user_id}/settings`);
    },
    onError: () => setErrorMessage('Could not fetch data for this user.')
  })

  const { data: cachedUser, cacheStatus: userCacheStatus, clear: clearUserCache } = useGetLocalStorage('user');

  const onUsernameInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setUsernameInput(event.target.value);
  }, [setUsernameInput])

  const onCachedSubmit = () => {
    const cachedUserId = cachedUser?.sleeperId;
    if (cachedUserId) {
      router.push(`user/${cachedUserId}`);
    } // @TODO: else show error toast
  }

  const onFormSubmit = () => {
    submitMutation.mutate(usernameInput);
  };

  const logOffUser = () => {
    if (window.confirm('Switching user will delete all saved settings for the previous user. Continue?')) {
      clearUserCache();
      deleteLocalStorageData('user');
      deleteLocalStorageData('settings');
    }
  };

  const renderFormOrCachedUsername = () => {
    switch (userCacheStatus) {
      case CacheStatus.HIT:
        return (
          <section className="flex flex-col items-center
          md:justify-end">
            <button className="text-primary-text rounded-md bg-alt py-3 px-5 w-fit"
              onClick={onCachedSubmit}>
              Continue with {cachedUser?.username} &rarr;
            </button>
            <button className="px-1 mt-2 text-primary-text text-xs tracking-wide md:text-base w-fit"
              onClick={logOffUser}>
              or change to a different user
            </button>
          </section>
        )
      case CacheStatus.MISS:
        return (
          <section className="flex flex-col space-y-3 bg-accent px-5 py-3 rounded-lg
          md:w-1/2 md:max-w-md">
            <>
              <label className="text-primary-text w-full"
                htmlFor="usernameInput">
                Enter your Sleeper username
              </label>
              <input className="p-3 text-base text-grey-600
              border-[3px] border-solid border-grey-300
              transition ease-in-out
              focus:text-primary focus:border-accent focus:outline-none
              md:text-md"
                placeholder="Username"
                type="text"
                id="usernameInput"
                value={usernameInput}
                onChange={onUsernameInputChange}
                autoComplete={'off'}
              />
              {errorMessage && (
                <p className="px-1 text-red-600 text-sm md:text-base">Error: {errorMessage}</p>
              )}
              <button className="text-primary-text rounded-lg bg-alt w-full py-3"
                onClick={onFormSubmit}>
                {submitMutation.isLoading ? <Loader customSize="h-5 w-5" customWidth="border-2" /> :
                  <span className="font-bold tracking-wide text-md">Submit</span>}
              </button>
            </>
          </section>)
      default: // LOADING
        return (<Loader />)
    }
  }

  return (
    <>
      <AppHeader title={'Sleepy'} />

      <main className="mx-auto flex flex-col items-center justify-center h-screen p-5 bg-primary w-screen">
        <FlexibleContainer>
          <section className="w-full h-1/2 md:w-1/2">
            <h1 className="text-xl md:text-2xl text-primary-text font-bold
            absolute top-5 left-3
            md:relative md:top-0 md:left-0 md:mb-3"
            >
              🏈 Sleepy
            </h1>
            <h3 className="text-3xl lg:text-5xl tracking-wide text-primary-text font-thin">
              Complete Weekly Summary of Your Sleeper Leagues
            </h3>
          </section>
          {renderFormOrCachedUsername()}
        </FlexibleContainer>
        {/* <div className="text-sm border-t-2 pt-2 text-primary-text">
          <p>&rarr; Update Nov. 5th:</p>
          <p>You can now enable a notice that warns you from missing starters !</p>
          <p>Try it out in the {userCacheStatus === CacheStatus.HIT ?
            <Link href={`user/${cachedUser?.sleeperId}/settings`}>
              <span className="text-alt cursor-pointer"
                onClick={bi.registerUpdateNoticeClick}
              >Settings </span></Link> : 'Settings '}
            page.</p>
        </div> */}
      </main>
    </>
  );
};

export default Home;
