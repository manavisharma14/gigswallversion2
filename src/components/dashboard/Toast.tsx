export default function Toast({
    message,
    type,
    onClose,
  }: {
    message: string;
    type: 'success' | 'error';
    onClose: () => void;
  }) {
    return (
      <div className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg text-white transition-all ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
        {message}
        <button onClick={onClose} className="ml-4 font-bold">×</button>
      </div>
    );
  }

