import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
});

export async function POST(req: Request) {
  const { amount, gigTitle } = await req.json();

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: {
            name: gigTitle,
          },
          unit_amount: amount * 100, // Stripe expects amount in cents
        },
        quantity: 1,
      }],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe Error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}