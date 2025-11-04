export default function DeleteGigModal({
    gig,
    onClose,
    onConfirm,
  }: {
    gig: { id: string; title: string };
    onClose: () => void;
    onConfirm: () => void;
  }) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4 text-center">
          <h2 className="text-xl font-extrabold text-[#B91C1C]">Delete Gig?</h2>
          <p className="text-gray-700">
            Are you sure you want to delete <span className="font-semibold">&quot;{gig.title}&quot;</span>?
          </p>
          <div className="flex justify-center gap-4 mt-6">
            <button
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium"
              onClick={onConfirm}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  }

