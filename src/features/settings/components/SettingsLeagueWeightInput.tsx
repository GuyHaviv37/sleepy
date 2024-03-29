import React, { ChangeEvent } from 'react';

interface LeagueWeightInputProps {
    leagueName: string;
    weightValue?: number;
    checkboxValue?: boolean;
    onWeightValueHandler: (event: ChangeEvent<HTMLInputElement>) => void;
    onCheckboxTickHandler: (event: ChangeEvent<HTMLInputElement>) => void;
}

const LeagueWeightInput: React.FC<LeagueWeightInputProps> = (props) => {
    const { leagueName, onWeightValueHandler, onCheckboxTickHandler, weightValue, checkboxValue } = props;

    return (
        <div className="flex justify-between mt-3 sm:space-x-5 lg:space-x-8">
            <input type='checkbox'
                aria-label={`league_checkbox_${leagueName}`}
                className='w-4 checked:accent-alt rounded-lg md:w-5'
                checked={checkboxValue} onChange={onCheckboxTickHandler} />
            <label htmlFor={`league_weight_input_${leagueName}`}
                className="text-primary-text text-lg line-clamp-1 md:text-xl">{leagueName}</label>
            <div className="flex space-x-2">
                <input type="number" onChange={onWeightValueHandler}
                    step={1} min={0} value={weightValue}
                    id={`league_weight_input_${leagueName}`}
                    className="max-w-[60px] max-h-[40px] text-center text-grey-700
                border-[3px] border-solid border-grey-300
                transition ease-in-out
                focus:text-primary focus:border-alt focus:border-[2px] focus:outline-none
                md:text-md"
                />
            </div>
        </div>
    )
}

export default LeagueWeightInput;