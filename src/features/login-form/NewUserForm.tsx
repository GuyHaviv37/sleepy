import Loader from '@/components/Loader';
import React, { type ChangeEvent, useCallback, useState } from 'react';
import { useMutation } from 'react-query';
import { submitNewUser } from '../user/data';
import { useRouter } from 'next/navigation';
import * as bi from '@/features/user/bi';


const NewUserLoginForm = () => {
    const router = useRouter();
    const [usernameInput, setUsernameInput] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const submitMutation = useMutation(submitNewUser, {
        onMutate: () => setErrorMessage(''),
        onSuccess: (user) => {
            bi.logUsernameSubmitted(user.username);
            router.push(`user/${user.user_id}/settings?fromLogin=true`);
        },
        onError: () => setErrorMessage('Could not fetch data for this user.')
    })

    const onUsernameInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setUsernameInput(event.target.value);
    }, [setUsernameInput])

    const onFormSubmit = (e: any) => {
        if (e.preventDefault) {
            e.preventDefault();
        }
        submitMutation.mutate(usernameInput);
    };

    return (
        <form className="flex flex-col space-y-3 bg-accent px-5 py-3 rounded-lg
              md:w-1/2 md:max-w-md" onSubmit={onFormSubmit}>
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
        </form>
    )
}

export default NewUserLoginForm;
