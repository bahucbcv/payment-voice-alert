const crypto = require("crypto");

const processedEvents = new Set();

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!secret) return res.status(500).send("Webhook secret is not configured");

    // Vercel Node functions expose the body as an object/string.
    // Signature verification must use the exact raw payload in production.
    const rawBody =
      typeof req.body === "string" ? req.body : JSON.stringify(req.body || {});

    const signature = req.headers["x-razorpay-signature"];
    const expected = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");

    if (!signature || signature.length !== expected.length ||
        !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
      return res.status(400).send("Invalid signature");
    }

    const eventId = req.headers["x-razorpay-event-id"];
    if (eventId && processedEvents.has(eventId)) {
      return res.status(200).send("Already processed");
    }
    if (eventId) processedEvents.add(eventId);

    const event = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    if (event.event === "payment.captured") {
      const payment = event.payload?.payment?.entity;
      console.log("PAYMENT_CAPTURED", {
        id: payment?.id,
        amount: payment?.amount,
        currency: payment?.currency,
        order_id: payment?.order_id
      });

      // Production: save the verified payment to a database here.
    }

    if (event.event === "payment.failed") {
      const payment = event.payload?.payment?.entity;
      console.log("PAYMENT_FAILED", payment?.id);
    }

    return res.status(200).send("OK");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Webhook error");
  }
};
