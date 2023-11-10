'use client'
import { SleeperLeagueData } from '@/features/leagues/leagues.types';
import React from 'react';
import LeagueWeightInput from './SettingsLeagueWeightInput';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useSettings } from '../useSettings';
import { safeUpdateLocalStorageData } from '@/features/local-storage/local-storage';
import * as bi from '@/features/settings/bi';


interface SettingsFormProps {
    leagues: SleeperLeagueData[];
}
const SettingsForm = (props: SettingsFormProps) => {
    const router = useRouter();
    const routeParams = useParams<{ id: string }>();
    const id = routeParams?.id;
    const searchParams = useSearchParams();
    const fromLogin = searchParams?.get('fromLogin') === 'true';
    const { leagues } = props;

    const { leagueIgnoresMap, leagueWeightsMap, shouldShowMissingStarters,
        onChangeLeagueIgnore, onChangeLeagueWeight, onChangeShowMissingStarters } = useSettings(leagues);

    const submitWeightsHandler = (isSkipped = false) => {
        const leagueNames = leagues?.reduce((acc, league) => ({ ...acc, [league.league_id]: league.name }), {});
        const leagueStarterSpots = leagues?.reduce((acc, league) => {
            const starterSpotsInLeague = league.roster_positions.filter(position => position !== 'BN').length;
            return { ...acc, [league.league_id]: starterSpotsInLeague };
        }, {})
        safeUpdateLocalStorageData('settings', {
            shouldShowMissingStarters,
            leagueIgnoresMap,
            leagueWeightsMap
        });
        safeUpdateLocalStorageData('leaguesInfo', {
            leagueNames,
            leagueStarterSpots,
        });
        if (isSkipped) {
            bi.logSettingsSkipped();
        } else {
            bi.logSettingsSubmitted({ leagueNames, leagueWeightsMap, leagueIgnoresMap, shouldShowMissingStarters })
        }
        router.replace(`/user/${id}`);
    };
    return (
        <section className='flex flex-col space-y-3 bg-accent py-8 rounded-lg md:w-1/2 md:max-w-md'>
            <h5 className='text-primary-text text-xl font-semibold tracking-wide md:text-2xl px-8'>Your Leagues</h5>
            <div className="flex flex-col center-items">
                <div className="w-full mb-3 max-h-96 overflow-y-auto md:self-center px-8">
                    {leagues?.map((league) => (
                        <LeagueWeightInput
                            key={league.league_id}
                            leagueName={league.name}
                            weightValue={leagueWeightsMap[league.league_id] ?? 0}
                            onWeightValueHandler={event => onChangeLeagueWeight(league.league_id, parseInt(event.target.value))}
                            onCheckboxTickHandler={event => onChangeLeagueIgnore(league.league_id, event.target.checked)}
                            checkboxValue={leagueIgnoresMap[league.league_id] ?? true}
                        />
                    ))}
                </div>
                <div className='border-t-[1px] mt-3 border-alt opacity-20' />
                <div className='px-8'>
                    <div className='flex mt-3 mb-6'>
                        <input type='checkbox'
                            id='missing_players_checkbox'
                            className='w-4 checked:accent-alt rounded-lg md:w-5'
                            checked={shouldShowMissingStarters}
                            onChange={event => onChangeShowMissingStarters(event.target.checked)} />
                        <label htmlFor='missing_players_checkbox'
                            className="text-primary-text text-sm pl-5 md:text-base">Show missing starters notice</label>
                    </div>
                    <button className="text-primary-text rounded-lg bg-alt w-full py-3"
                        onClick={() => submitWeightsHandler(false)}>
                        Submit
                    </button>
                    {fromLogin && <button className="px-1 mt-2 text-primary-text text-sm tracking-wide md:text-base w-full text-center"
                        onClick={() => submitWeightsHandler(true)}>
                        Skip for later
                    </button>}
                </div>
            </div>
        </section>
    )
};

export default SettingsForm;
