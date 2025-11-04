"use client";
import Script from "next/script";
import { useState } from "react";

interface PaymentRequestBody {
    amount: number;
    gigId: string;
    studentId: string;
  }
  
  interface RazorpayResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }


export default function PayButton({ amount, gigId, studentId } : PaymentRequestBody) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);

    // 1️⃣ Create Razorpay Order
    const res = await fetch("/api/payment/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, gigId, studentId }),
    });

    const data = await res.json();

    // 2️⃣ Open Razorpay UI
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY!,
      amount: amount * 100,
      currency: "INR",
      name: "Gigswall",
      description: "Gig Payment (Escrow)",
      order_id: data.orderId,
      handler: async function (response : RazorpayResponse) {
        const verifyRes = await fetch("/api/payment/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...response, gigId, studentId }),
        });

        const verifyData = await verifyRes.json();

        if (verifyData.success) {
          alert(" Payment Successful — Escrow Locked");
        } else {
          alert(" Payment Failed");
        }
      },
      theme: { color: "#4B55C3" },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
    setLoading(false);
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <button
        onClick={handlePayment}
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded-lg"
      >
        {loading ? "Processing..." : "Pay & Start Gig"}
      </button>
    </>
  );
}