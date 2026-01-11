import { NextResponse } from "next/server";
import Stripe from "stripe";

// Hubi in Secret Key-ga uu ku jiro .env.local
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16" as any,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { plan, userId, email } = body;

    // Qiimaha qorshayaasha (Stripe cents ayuu u xisaabiyaa)
    const prices: Record<string, number> = {
      standard: 1200, // $12.00
      premium: 2900,  // $29.00
    };

    // Hubi in qorshaha la doortay uu sax yahay
    const selectedPlan = plan?.toLowerCase();

    if (!prices[selectedPlan]) {
      return NextResponse.json(
        { error: `Qorshaha '${plan}' lama helin. Hubi inuu yahay Standard ama Premium.` },
        { status: 400 }
      );
    }

    // Abuurista Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: `SmartBook ${selectedPlan.toUpperCase()}` },
            unit_amount: prices[selectedPlan],
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/#pricing`,
    });

    // HALKAN AYAA ISBEDDELAY: Soo celi URL halkii aad Session ID soo celin lahayd
    return NextResponse.json({ url: session.url }); 

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}