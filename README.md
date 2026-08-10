# Payment Voice Alert — Razorpay + GitHub

This project provides a GitHub-ready frontend plus a Vercel serverless webhook for Razorpay.

## Features
- Enter amount
- Create Razorpay payment order
- Show QR/payment link
- 5-minute countdown
- Razorpay Checkout
- Webhook verification
- Bengali payment-received voice
- Transaction history in browser localStorage
- Duplicate webhook event protection in memory (use a database for production)

## Important
GitHub Pages cannot receive Razorpay webhooks directly. Deploy the `/api/webhook.js` endpoint on a serverless host such as Vercel, and use the public webhook URL in Razorpay Dashboard.

Never put `RAZORPAY_KEY_SECRET` or `RAZORPAY_WEBHOOK_SECRET` in public GitHub files.

## Vercel environment variables
Set:
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `RAZORPAY_WEBHOOK_SECRET`

## Deploy
1. Upload this project to a GitHub repository.
2. Import the repository into Vercel.
3. Add the three environment variables.
4. Deploy.
5. In Razorpay Dashboard -> Webhooks, add:
   `https://YOUR-DOMAIN.vercel.app/api/webhook`
6. Subscribe to at least `payment.captured` and `payment.failed`.
7. Open the deployed site.

## Local testing
Install Node.js, then:
```bash
npm install
npm run dev
```

The frontend uses `/api/create-order`, so it should be served from the same deployed domain.
