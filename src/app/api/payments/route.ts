import { NextResponse } from "next/server";
import Stripe from "stripe"
import { handleCheckoutSessipnCompleyted } from "@/app/payments";
import dbConnect from "@/db";

const stripe_secret_key = process.env.STRIPE_SECRET_KEY!
// const stripe_publishable_key = "pk_test_51RFZywIR3kvZWYIJoa4cAmV8FxMQivdslQsR7RDipajzlbaxplpj0q4cUn6KVECQlkxnVD4NMlFsB4pKxofQZbcp00UQcfKp5v"

const stripe = new Stripe(stripe_secret_key);

export const POST = async (req: Request) => {
  await dbConnect();
  const payload = await req.json()

  const sig = req.headers.get("Stripe-Signature") || "";
  let event;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  try {
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);

    switch(event.type) {
      case 'checkout.session.completed':
        const session_Id = event.data.object.id;
        console.log("Payment was successful!",session_Id);

        const session = await stripe.checkout.sessions.retrieve(session_Id,{
          expand: ['line_items']
        });

        await handleCheckoutSessipnCompleyted({session,stripe});

        break;
      case 'customer.subscription.deleted':
        const subscription = event.data.object;
        console.log("Subscription was deleted!",subscription);
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