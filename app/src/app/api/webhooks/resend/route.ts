import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

type ResendWebhookEvent = {
  type?: string;
  created_at?: string;
  data?: {
    email_id?: string;
    to?: string[] | string;
    from?: string;
    subject?: string;
    created_at?: string;
    [key: string]: unknown;
  };
};

const resend = new Resend(process.env.RESEND_API_KEY ?? "placeholder");

export async function POST(request: Request) {
  const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("[email:webhook] RESEND_WEBHOOK_SECRET is not configured");
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  const payload = await request.text();
  const headers = {
    id: request.headers.get("svix-id") ?? "",
    timestamp: request.headers.get("svix-timestamp") ?? "",
    signature: request.headers.get("svix-signature") ?? "",
  };

  if (!headers.id || !headers.timestamp || !headers.signature) {
    return NextResponse.json({ error: "Missing webhook signature headers" }, { status: 400 });
  }

  let event: ResendWebhookEvent;
  try {
    event = resend.webhooks.verify({
      payload,
      headers,
      webhookSecret,
    }) as ResendWebhookEvent;
  } catch (err) {
    console.error("[email:webhook] Invalid Resend signature", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const to = Array.isArray(event.data?.to) ? event.data.to.join(",") : event.data?.to;
  console.log(
    [
      "[email:webhook]",
      `type=${event.type ?? "unknown"}`,
      `email_id=${event.data?.email_id ?? "unknown"}`,
      `to=${to ?? "unknown"}`,
      `subject=${event.data?.subject ?? "unknown"}`,
    ].join(" "),
  );

  return NextResponse.json({ received: true });
}
