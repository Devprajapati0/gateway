import { NextResponse } from "next/server";
import Stripe from "stripe"
const stripe_secret_key = "sk_test_51RFZywIR3kvZWYIJ5V9O7EKvQfywJiJ447vhNNrAUuYu7QeFb35ozRcjWljqYd3Y4nir8OjNfaBKmlJF2NNEwzA600nAdIr9gs"
// const stripe_publishable_key = "pk_test_51RFZywIR3kvZWYIJoa4cAmV8FxMQivdslQsR7RDipajzlbaxplpj0q4cUn6KVECQlkxnVD4NMlFsB4pKxofQZbcp00UQcfKp5v"

const stripe = new Stripe(stripe_secret_key);

export const POST = async (req: Request) => {
  const payload = await req.json()

  const sig = req.headers.get("Stripe-Signature") || "";
  let event;
  const endpointSecret = "";

  try {
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);

    switch(event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        console.log("Payment was successful!",session);
        break;
        default:
        console.log(`Unhandled event type ${event.type}`);
    }
    // Return a response to acknowledge receipt of the event
  } catch (error) {
    return NextResponse.json({ error: `Webhook Error:${error}` }, { status: 400 });    
  }
    return NextResponse.json({ received: true }, { status: 200 });
}