import Stripe from "stripe";
import dbConnect from "@/db";
import { User } from "./user";
import { Payment } from "./payment";
export async function handleCheckoutSessipnCompleyted({
    session,
    stripe
}:{
    session:Stripe.Checkout.Session
    stripe:Stripe
}) {
    console.log("Payment was successful!",session);
    const customerid = session.customer as string;

    const customer = await stripe.customers.retrieve(customerid);
    const priceid = session.line_items?.data?.[0]?.price?.id || "";
    const email = (customer as Stripe.Customer).email || "";
    const name = (customer as Stripe.Customer).deleted ? "" : (customer as Stripe.Customer).name || "";
    console.log("customer:",customer);
    console.log("priceid:",priceid);

    await createUpdateduser({
        email: email || "",
        cusomerid: customerid || "",
        priceid: priceid || "",
        name: name || ""
    });
    await createPayment({
        session,
        name,
        email
    });
    console.log("User created successfully");
}

async function createUpdateduser({
    email,
    cusomerid,
    priceid,
    name
}:{
    email:string,
    cusomerid:string,
    priceid:string,
    name:string
}) {
    await dbConnect();
    try {
        // Removed redundant email declaration
        const user = await User.findOne({ email });
        if (!user) {
           //create he user
            const newUser = new User({
                email,
                name,
                cusomerid,
                priceid,
                status: "active",
            });
            await newUser.save();
            console.log("User created successfully");
            return;
        }
       
        user.cusomerid = cusomerid;
        user.priceid = priceid;
        await user.save();
    } catch (error) {
        console.log("Error creating user:", error);
        throw new Error("Error creating user");
    }
}

async function createPayment({
    session,
    name,email
}:{
    session:Stripe.Checkout.Session
    name:string,
    email:string
}){
    await dbConnect();
    try {
        console.log("Payment was successful!",session);
        const stripepaymnetid = session.id;
        const customerid = session.customer as string;
        const amount = session.amount_total;
        const priceid = session.line_items?.data?.[0]?.price?.id || "";
        // const customer = await stripe.customers.retrieve(customerid);
    //   const customer_email = session.customer_email || "";
        const pay = await Payment.create({
            email,
            name,
            cusomerid:customerid,
            priceid,
            amount,
            stripepaymnetid,
        });
        if(!pay){
            throw new Error("Payment not created");
        }
        console.log("Payment created successfully");
        return pay;
    } catch (error) {
        console.log("Error creating payment:", error);
        throw new Error("Error creating payment");
    }
}

export async function handleSubsciptionDeleted({
    session_Id_del,
    stripe
}:{
    session_Id_del:string,
    stripe:Stripe
}) {
    await dbConnect();
    try {
        const session = await stripe.checkout.sessions.retrieve(session_Id_del);
        const customerid = session.customer as string;
        const subscription = await stripe.subscriptions.retrieve(session_Id_del);
        const status = subscription.status;
        console.log("Subscription was deleted!",subscription);
        console.log("status:",status);
        if(status === "canceled"){
            await User.findOneAndUpdate(
                { cusomerid: customerid },
                { status: "inactive" },
                { new: true }
            );
            console.log("User status updated to inactive");
        }
    } catch (error) {
        console.log("Error handling subscription deletion:", error);
        throw new Error("Error handling subscription deletion");
    }
}