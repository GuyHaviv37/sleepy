import AddMockDraftForm from "./AddMockDraftForm";

interface AddMockDraftModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const AddMockDraftModal = ({ isOpen, onClose, onSubmit }: AddMockDraftModalProps) => {
    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        onSubmit(e);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="fixed inset-0 w-full h-full bg-black opacity-40" onClick={onClose} />
            <div className="flex min-h-screen items-start justify-center p-4 pt-24 md:pt-32">
                <div className="relative w-full max-w-md bg-primary rounded-lg p-4 md:p-6 shadow-lg">
                    <button
                        type="button"
                        className="text-primary-text text-2xl absolute top-3 right-4"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        &times;
                    </button>
                    <h2 className="text-primary-text text-lg font-semibold mb-4 pr-8">Add Mock Draft</h2>
                    <p className="text-primary-text text-sm text-gray-400 mb-4">
                        Paste a Sleeper mock draft URL to save it for future use.
                    </p>
                    <AddMockDraftForm onSubmit={handleSubmit} isCompact />
                </div>
            </div>
        </div>
    );
};

export default AddMockDraftModal;
