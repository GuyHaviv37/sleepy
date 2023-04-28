import type { NextPage } from "next";
import Head from "next/head";
import { ChangeEvent, useCallback, useState } from "react";
import { useRouter } from 'next/router';
import { CacheStatus, setLocalStorageData, useGetLocalStorage } from "@/utils/localStorage";
import Loader from "@/components/Loader";
import * as bi from '../../lib/bi';
import Link from "next/link";
import { useMutation } from "react-query";
import { submitNewUser } from "@/features/home/data";

type SleeperUserFromCache = { username: string; sleeperId: string };

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

  const {data: cachedUser, cacheStatus: userCacheStatus, clear: clearUserCache} = useGetLocalStorage<SleeperUserFromCache>('user');

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

  const renderFormOrCachedUsername = () => {
    switch (userCacheStatus) {
      case CacheStatus.HIT:
        return (
          <>
            <button className="text-primary-text rounded-md bg-accent mx-auto px-3 py-1
            hover:-translate-y-1 active:translate-y-0"
              onClick={onCachedSubmit}>
              {cachedUser?.username} &rarr;
            </button>
            <button className="px-1 mt-2 text-primary text-xs tracking-wide md:text-base"
              onClick={clearUserCache}>
              or change to a different user
            </button>
          </>
        )
      case CacheStatus.MISS:
        return (
          <section className="mt-3 flex flex-col space-y-3 bg-primary px-5 py-3 rounded-lg">
            <>
              <label className="text-primary-text text-center w-full md:text-lg tracking-wide"
                htmlFor="usernameInput">
                Enter your Sleeper username:
              </label>
              <input className="px-3 py-1.5 text-base rounded-lg text-grey-700
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
                <p className="px-1 text-red-600 text-sm md:text-base">{errorMessage}</p>
              )}
              <button className="text-primary-text rounded-md bg-accent mx-auto px-3 py-1
              hover:-translate-y-1 active:translate-y-0"
                onClick={onFormSubmit}>
                {submitMutation.isLoading ? <Loader customSize="h-5 w-5" customWidth="border-2" /> : <>Submit &rarr;</>}
              </button>
            </>
          </section>)
      default: // LOADING
        return (<Loader />)
    }
  }

  return (
    <>
      <Head>
        <title>Sleepy</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/american-football.png" />
      </Head>

      <main className="container mx-auto flex flex-col items-center justify-center h-screen p-4 bg-background-main">
        <h1 className="text-4xl md:text-5xl leading-tight tracking-wide text-center md:leading-normal font-bold md:font-extrabold text-primary">
          Sleepy
        </h1>
        <br />
        <h3 className="text-lg md:text-2xl leading-tight text-center md:leading-normal font-semibold md:font-bold text-accent">
          Complete Weekly Summary of Your Sleeper Leagues
        </h3>
        <br />
        {renderFormOrCachedUsername()}
        <br />
        <div className="text-sm border-t-2 pt-2">
        {/* Migrate to updates component */}
        <p>&rarr; Update Nov. 5th:</p>
          <p>You can now enable a notice that warns you from missing starters !</p>
          <p>Try it out in the {userCacheStatus === CacheStatus.HIT ?
            <Link href={`user/${cachedUser?.sleeperId}/settings`}>
              <span className="text-alt cursor-pointer"
                onClick={bi.registerUpdateNoticeClick}
              >Settings </span></Link> : 'Settings '}
            page.</p>
        </div>
      </main>
    </>
  );
};

export default Home;
