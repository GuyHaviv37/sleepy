interface AddMockDraftFormProps {
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    isCompact?: boolean;
}

const AddMockDraftForm = ({ onSubmit, isCompact }: AddMockDraftFormProps) => {
    return (
        <form
            onSubmit={onSubmit}
            className={`flex flex-col space-y-3 bg-accent rounded-lg ${isCompact ? 'px-5 py-4' : 'px-6 py-8'}`}
        >
            <input
                className="p-3 text-base text-grey-600 border-[3px] border-solid border-grey-300 transition ease-in-out focus:text-primary focus:border-accent focus:outline-none md:text-md"
                type="url"
                name="mockDraftUrl"
                placeholder="Enter the URL of the mock draft"
                required
            />
            <button type="submit" className="bg-alt text-primary-text px-4 py-2 rounded-lg font-semibold tracking-wide">
                Add Mock Draft
            </button>
        </form>
    );
};

export default AddMockDraftForm;
