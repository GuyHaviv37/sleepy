const Loader = ({customSize, customWidth}: {customSize?: string; customWidth?: string}) => {
    return (
        <div className="flex justify-center items-center">
            <div className={`spinner-border animate-spin inline-block border-b-transparent rounded-full 
            ${customWidth ?? 'border-4'} 
            ${customSize ?? 'w-8 h-8'}`}
            role="status">
                <span className="visually-hidden"></span>
            </div>
        </div>
    )
};
export default Loader;