'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import KofiModal from './KofiModal';

interface KofiButtonProps {
    absolute?: boolean;
}

const KofiButton = (props: KofiButtonProps) => {
    const [shouldShowKofiModal, setShouldShowKofiModal] = useState(false);
    const buttonPosition = props.absolute ? 'absolute bottom-10' : undefined;
    return (
        <>
            <button className={`bg-accent px-4 py-2 rounded-full flex items-center ${buttonPosition}`}
                onClick={() => setShouldShowKofiModal(true)}>
                <Image
                    alt='buy me a kofi support icon'
                    src={require('/public/icons/kofi.webp')} height={40} width={40} />
                <span className='text-primary-text'>
                    Support Sleepy
                </span>
            </button>
            <KofiModal shouldShowKofiModal={shouldShowKofiModal} dismissKofiModal={() => setShouldShowKofiModal(false)} />
        </>
    )
}

export default KofiButton;