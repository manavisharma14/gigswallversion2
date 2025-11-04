"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";


type Transaction = {
  id: string;
  type: "credit" | "debit";
  amount: number;
  description: string;
  createdAt?: string;
};

type Withdrawal = {
  id: string;
  amount: number;
  status: "pending" | "completed" | "rejected";
  createdAt?: string;
};

type WalletResponse = {
  walletBalance: number;
  upiId?: string;
  transactions: Transaction[];
  withdrawals: Withdrawal[];
};

export default function EarningsPage() {
  const [wallet, setWallet] = useState<number>(0);
  const [upiId, setUpiId] = useState<string>("");
  const [showUpiInput, setShowUpiInput] = useState<boolean>(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);

  const fetchData = async () => {
    const res = await axios.get<WalletResponse>("/api/dashboard/earnings/");
    setWallet(res.data.walletBalance);
    setUpiId(res.data.upiId || "");
    setTransactions(res.data.transactions || []);
    setWithdrawals(res.data.withdrawals || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const saveUpi = async () => {
    await axios.post("/api/wallet/upi", { upiId });
    toast.success("UPI ID saved");
    setShowUpiInput(false);
    fetchData();
  };

  const requestWithdrawal = async () => {
    if (!upiId) return toast.error("Add your UPI ID first");

    await axios.post("/api/wallet/withdraw", {});
    toast.success("Withdrawal request submitted");
    fetchData();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Earnings & Wallet</h2>

      {/* Wallet Card */}
      <div className="bg-white shadow-md p-5 rounded-lg mb-5">
        <p className="text-sm text-gray-600">Wallet Balance</p>
        <h2 className="text-3xl font-bold">₹{wallet}</h2>

        {upiId ? (
          <p className="text-green-600 mt-2 font-medium">
            UPI ID: {upiId}
          </p>
        ) : (
          <button
            className="mt-2 bg-blue-600 text-white px-3 py-1 rounded"
            onClick={() => setShowUpiInput(true)}
          >
            Add UPI ID
          </button>
        )}

        {showUpiInput && (
          <div className="mt-3 flex gap-2">
            <input
              className="border p-2 rounded"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="example@upi"
            />
            <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={saveUpi}>
              Save
            </button>
          </div>
        )}

        <button
          className="mt-4 bg-black text-white px-4 py-2 rounded"
          onClick={requestWithdrawal}
        >
          Request Withdrawal
        </button>
      </div>

      {/* Transactions */}
      <div className="bg-white shadow-md p-5 rounded-lg mb-5">
        <h3 className="text-lg font-semibold mb-2">Transaction History</h3>
        {transactions.length === 0 ? (
          <p className="text-gray-500 text-sm">No transactions yet</p>
        ) : (
          <ul className="text-sm">
            {transactions.map((t: Transaction) => (
              <li key={t.id} className="py-2 border-b">
                <strong className={t.type === "credit" ? "text-green-600" : "text-red-600"}>
                  {t.type === "credit" ? "+" : "-"}₹{t.amount}
                </strong>
                <span className="ml-2">{t.description}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Withdrawal History */}
      <div className="bg-white shadow-md p-5 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Withdrawal History</h3>
        {withdrawals.length === 0 ? (
          <p className="text-gray-500 text-sm">No withdrawals yet.</p>
        ) : (
          <ul className="text-sm">
            {withdrawals.map((w: Withdrawal) => (
              <li key={w.id} className="py-1 border-b">
                ₹{w.amount} — <span className="font-medium">{w.status}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
} 