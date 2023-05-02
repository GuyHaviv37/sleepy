import React, { ChangeEvent } from 'react';

interface LeagueWeightInputProps {
    leagueName: string;
    weightValue?: number;
    checkboxValue?: boolean;
    onWeightValueHandler: (event: ChangeEvent<HTMLInputElement>) => void;
    onCheckboxTickHandler: (event: ChangeEvent<HTMLInputElement>) => void;
}

const LeagueWeightInput: React.FC<LeagueWeightInputProps> = (props) => {
    const {leagueName, onWeightValueHandler, onCheckboxTickHandler, weightValue, checkboxValue} = props;

    return (
        <div className="flex justify-between mt-3 sm:space-x-5">
            <input type='checkbox' checked={checkboxValue} onChange={onCheckboxTickHandler}/>
            <p className="text-primary-text">{leagueName}</p>
            <div className="flex space-x-3">
                <input type="number" onChange={onWeightValueHandler}
                step={1} min={0} value={weightValue}
                className="max-w-[50px] h-full text-center rounded-lg text-grey-700
                border-[3px] border-solid border-grey-300
                transition ease-in-out
                focus:text-primary focus:border-accent focus:outline-none
                md:text-md"
                />
                <p className="text-green-500">$</p>
            </div>
        </div>
    )
}

export default LeagueWeightInput;