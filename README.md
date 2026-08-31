This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Load Testing with k6

The repo includes three k6 scripts under `k6/` for safe demo progression:

- `k6/script1-sanity.js`: light validation of `/`, `/live`, and `/api/presence/count`
- `k6/script2-ramp.js`: gradual ramp-up for the main demo
- `k6/script3-spike.js`: short controlled spike
- `k6/script4-cpu-burn.js`: targets a demo-only CPU endpoint to create sustained pressure

Run commands:

```bash
k6 run -e BASE_URL=https://nextk6demo92358.azurewebsites.net k6/script1-sanity.js
k6 run -e BASE_URL=https://nextk6demo92358.azurewebsites.net k6/script2-ramp.js
k6 run -e BASE_URL=https://nextk6demo92358.azurewebsites.net k6/script3-spike.js
k6 run -e BASE_URL=https://nextk6demo92358.azurewebsites.net k6/script4-cpu-burn.js
```

Recommended order for demo/trial:

1. Run `script1-sanity.js` to verify baseline health.
2. Run `script2-ramp.js` for the primary load story.
3. Run `script3-spike.js` only if you want a brief stress burst.

### Demo-Only CPU Endpoint

For autoscale rehearsal without unsafe traffic levels, this repo includes:

- Route: `/api/demo/cpu-burn`
- File: `src/app/api/demo/cpu-burn/route.ts`

The endpoint is disabled by default. Enable it only for testing:

1. Set app setting `DEMO_CPU_ENDPOINT_ENABLED=true`
2. Optionally set `DEMO_CPU_ENDPOINT_SECRET=<your-secret>`
3. Restart the app

Run with optional secret:

```bash
k6 run \
	-e BASE_URL=https://nextk6demo92358.azurewebsites.net \
	-e DEMO_CPU_SECRET=your-secret \
	-e BURN_MS=160 \
	-e COMPLEXITY=6000 \
	k6/script4-cpu-burn.js
```

Disable after demo by setting `DEMO_CPU_ENDPOINT_ENABLED=false` (or removing the setting) and restarting the app.
