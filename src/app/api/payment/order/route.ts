import { NextResponse, NextRequest } from 'next/server'
import Razorpay from 'razorpay'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET!
})


export async function POST(req : NextRequest ){
  try{
    const { amount, gigId, studentId, applicationId } = await req.json();

    const order = await razorpay.orders.create({
      amount: amount*100,
      currency: "INR",
      receipt: `gw_${gigId.slice(0,6)}_${studentId.slice(0,6)}_${applicationId.slice(0,6)}`,
      notes: {
        gigId,
        studentId,
        applicationId
      }
    })
  
    return NextResponse.json({ orderId: order.id})
  } catch (error) {
    console.log("razorpay order error : ", error);
    return NextResponse.json(
      {error: "failed to create payment order"},
      { status: 500}
    )
  }
}