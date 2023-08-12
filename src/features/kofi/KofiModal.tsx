import React, { useState } from 'react';

interface KofiModalProps {
    shouldShowKofiModal: boolean;
    dismissKofiModal: () => void;
}
const KofiModal = ({ shouldShowKofiModal, dismissKofiModal }: KofiModalProps) => {
    return (
        shouldShowKofiModal ? (
            <>
                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div
                        className="fixed inset-0 w-full h-full bg-black opacity-40"
                        onClick={dismissKofiModal}
                    ></div>
                    <div className="flex w-full max-w-lg min-h-screen mx-auto">
                        <iframe id='kofiframe' src='https://ko-fi.com/guyhaviv/?hidefeed=true&widget=true&embed=true&preview=true' title='guyhaviv'
                            className='relative mx-auto mt-24 max-h-[650px]' />
                    </div>
                </div>
            </>
        ) : null
    )
}

export default KofiModal;
