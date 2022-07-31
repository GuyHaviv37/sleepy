import type { NextPage } from "next";
import Head from "next/head";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from 'next/router';

const enum CacheStatus {
  'LOADING',
  'MISS',
  'HIT',
}

type SleeperUserFromCache = {username: string; sleeperId: string};
type SleeperUserData = {username: string, user_id: string};

const getSleeperUserData = async (username: string): Promise<SleeperUserData> => {
  return await (await fetch(`https://api.sleeper.app/v1/user/${username}`)).json()
};

const Home: NextPage = () => {
  const router = useRouter();
  const [usernameInput, setUsernameInput] = useState('');
  const [isCachedUsername, setIsCachedUsername] = useState<CacheStatus>(CacheStatus.LOADING);
  const [errorMessage, setErrorMessage] = useState('');
  const userFromCache = useRef<SleeperUserFromCache>();

  useEffect(() => {
    try {
      const user = window.localStorage.getItem('user');
      if (user) {
        userFromCache.current = JSON.parse(user);
        if (userFromCache.current?.username) {
          setUsernameInput(userFromCache.current.username);
          setIsCachedUsername(CacheStatus.HIT);
        } else {
          console.log('Error: an empty username was saved to cache');
        }
      } else {
        setIsCachedUsername(CacheStatus.MISS);
      }
    }
    catch (error) {
      console.log(error);
      setIsCachedUsername(CacheStatus.MISS);
    }
  }, [])

  const onUsernameInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setUsernameInput(event.target.value);
  }, [setUsernameInput])

  const onCachedSubmit = () => {
    if (userFromCache.current?.sleeperId) {
      const {sleeperId} = userFromCache.current;
      router.push(`user/${sleeperId}`);
    } else {
      console.error('Error with cached data: no sleeper id');
    }
  }
  const onFormSubmit = async () => {
    setErrorMessage('');
    try {
      const userData = await getSleeperUserData(usernameInput);
      console.log('userData', userData);
      if (userData) {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem('user', JSON.stringify({
            username: usernameInput,
            sleeperId: userData.user_id
          }));
        }
        router.push(`user/${userData.user_id}/settings`);
      } else {
        setErrorMessage(`Could not find user - ${usernameInput}`);
      }
    } catch (error) {
      console.log(error);
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
                Submit &rarr;
              </button>
            </>
          </section>)
        default: // LOADING
        return (<div>Loading...</div>)
    }
  }

  return (
    <>
      <Head>
        <title>Sleeper Sunday Cheatsheet</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto flex flex-col items-center justify-center h-screen p-4 bg-background-main">
        <h1 className="text-4xl md:text-5xl leading-tight text-center md:leading-normal font-bold md:font-extrabold text-primary">
          Sleeper Sunday Board
        </h1>
        <br />
        <h3 className="text-lg md:text-2xl leading-tight text-center md:leading-normal font-semibold md:font-bold text-accent">
          Complete Weekly Summary of Your Sleeper Leagues
        </h3>
        <br />
        {renderFormOrCachedUsername()}
      </main>
    </>
  );
};

export default Home;
