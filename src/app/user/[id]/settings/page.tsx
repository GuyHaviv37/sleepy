import React from 'react';
import Link from 'next/link';
import { getSleeperUserLeagues } from '@/features/leagues/data';
import FlexibleContainer from '@/components/layout/FlexibleContainer';
import PageLogo from '@/components/PageLogo';
import SettingsForm from '@/features/settings/components/SettingsForm';
import { type Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Sleepy - Settings'
}

const UserSettingsPage = async ({ params, searchParams }: { params: { id: string }; searchParams: { fromLogin: boolean } }) => {
    const { id } = params;
    const { fromLogin } = searchParams;
    const leagues = await getSleeperUserLeagues(id);

    return <>
        <main className="flex flex-col items-center justify-center h-screen p-4 bg-primary">
            <PageLogo title={fromLogin ? '🏈 Sleepy' : `⚙️ Settings`} />
            {fromLogin ? null :
                <Link href={`/user/${id}`}>
                    <span className="text-primary-text text-2xl lg:text-4xl absolute top-5 right-5">&times;</span>
                </Link>}
            <FlexibleContainer>
                <p className='text-primary-text text-2xl px-6 mt-3 mx-auto md:mx-0 lg:text-4xl md:w-1/2'>
                    Enter your leagues entry fees so you can scale better to who you should root for and against.
                    <br />
                    <span className='text-alt text-sm font-thin md:text-lg'>Ignore a league by unticking its checkbox</span>
                </p>
                <SettingsForm leagues={leagues} />
            </FlexibleContainer>

        </main>
    </>;
};

export default UserSettingsPage;
