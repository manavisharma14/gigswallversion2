import Razorpay from "razorpay";

export function initializeRazorpay() {
  if (!process.env.RAZORPAY_KEY || !process.env.RAZORPAY_SECRET) {
    console.warn("⚠️ Razorpay keys missing — running in mock mode");

    return {
      orderId: "mock_order_12345"
    };
  }

  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY!,
    key_secret: process.env.RAZORPAY_SECRET!,
  });
}

export const razorpay = initializeRazorpay();

