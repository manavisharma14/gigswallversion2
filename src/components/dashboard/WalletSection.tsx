// components/dashboard/WalletSection.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  balance: number;
  upiId?: string;
}

export default function WalletSection({ balance, upiId }: Props) {
  const router = useRouter();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleWithdraw = async () => {
    if (balance < 100) {
      setToast({ message: 'Minimum ₹100 to withdraw', type: 'error' });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    try {
      const res = await fetch('/api/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: balance }),
      });
      const data = await res.json();

      if (data.success) {
        setToast({ message: 'Withdrawal requested!', type: 'success' });
        router.refresh();
      } else {
        setToast({ message: data.error ?? 'Failed', type: 'error' });
      }
    } catch {
      setToast({ message: 'Network error', type: 'error' });
    }
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="bg-white rounded-xl border shadow p-5">
      <h2 className="font-semibold mb-2">Wallet Balance</h2>
      <p className="text-2xl font-bold text-green-600">₹{balance}</p>
      <p className="text-sm text-gray-600 mt-1">
        UPI ID: {upiId ? upiId : 'Not added'}
      </p>

      {balance > 0 && (
        <button
          onClick={handleWithdraw}
          className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700"
        >
          Withdraw ₹{balance} to UPI
        </button>
      )}

      {toast && (
        <div
          className={`mt-3 p-3 rounded-lg text-sm ${
            toast.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}