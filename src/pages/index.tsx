import type { NextPage } from "next";
import Head from "next/head";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from 'next/router';
import { CacheStatus, getLocalStorageData, setLocalStorageData } from "@/utils/localStorage";
import { fetcher } from '@/utils/fetcher';
import Loader from "@/components/Loader";
import * as bi from '../../lib/bi';
import Link from "next/link";

type SleeperUserFromCache = { username: string; sleeperId: string };
type SleeperUserData = { username: string, user_id: string };

const getSleeperUserData = async (username: string): Promise<SleeperUserData> => {
  return fetcher(`https://api.sleeper.app/v1/user/${username}`);
};

const Home: NextPage = () => {
  const router = useRouter();
  const [usernameInput, setUsernameInput] = useState('');
  const [isCachedUsername, setIsCachedUsername] = useState<CacheStatus>(CacheStatus.LOADING);
  const [isFetchingUserData, setIsFetchingUserData] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const userFromCache = useRef<SleeperUserFromCache>();

  useEffect(() => {
    try {
      const user = getLocalStorageData('user');
      if (user) {
        userFromCache.current = user;
        if (userFromCache.current?.username) {
          setUsernameInput(userFromCache.current.username);
          setIsCachedUsername(CacheStatus.HIT);
        } else {
          // @TODO: fedops
          console.log('Error: an empty username was saved to cache');
          setIsCachedUsername(CacheStatus.MISS);
        }
      } else {
        setIsCachedUsername(CacheStatus.MISS);
      }
    }
    catch (error) {
      // @TODO: fedops
      console.log('Error fetching username from cache:', error);
      setIsCachedUsername(CacheStatus.MISS);
    }
  }, [])

  const onUsernameInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setUsernameInput(event.target.value);
  }, [setUsernameInput])

  const onCachedSubmit = () => {
    if (userFromCache.current?.sleeperId) {
      const { sleeperId } = userFromCache.current;
      router.push(`user/${sleeperId}`);
    }
  }
  const onFormSubmit = async () => {
    setErrorMessage('');
    try {
      setIsFetchingUserData(true);
      const userData = await getSleeperUserData(usernameInput);
      if (userData) {
        setLocalStorageData('user', {
          username: usernameInput,
          sleeperId: userData.user_id
        })
        bi.registerUsernameSubmit(usernameInput);
        router.push({
          pathname: `user/${userData.user_id}/settings`,
          query: { fromLogin: true }
        }, `user/${userData.user_id}/settings`);
      } else {
        setErrorMessage(`Could not find user - ${usernameInput}`);
      }
      setIsFetchingUserData(false);
    } catch (error) {
      // @TODO - fedops
      console.log('Error: fetching sleeper user data from username input', error);
      setErrorMessage(`Could not fetch user data for username: ${usernameInput}`);
    }
  };

  const renderFormOrCachedUsername = () => {
    switch (isCachedUsername) {
      case CacheStatus.HIT:
        return (
          <>
            <button className="text-primary-text rounded-md bg-accent mx-auto px-3 py-1
            hover:-translate-y-1 active:translate-y-0"
              onClick={onCachedSubmit}>
              {usernameInput} &rarr;
            </button>
            <button className="px-1 mt-2 text-primary text-xs tracking-wide md:text-base"
              onClick={() => setIsCachedUsername(CacheStatus.MISS)}>
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
                {isFetchingUserData ? <Loader customSize="h-5 w-5" customWidth="border-2" /> : <>Submit &rarr;</>}
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
        <p>&rarr; Update Nov. 5th:</p>
          <p>You can now enable a notice that warns you from missing starters !</p>
          <p>Try it out in the {isCachedUsername === CacheStatus.HIT ?
            <Link href={`user/${userFromCache.current?.sleeperId}/settings`}>
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
