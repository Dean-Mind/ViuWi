This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Prerequisites

Before running the application, ensure you have the following environment variables configured:

#### Supabase Edge Functions Environment Variables

The following environment variables must be set in your Supabase project dashboard for the edge functions to work properly:

- `N8N_WEBHOOK_BASE_URL` - Base URL for n8n webhook integration (e.g., `https://n8ncloud.com/webhook`)

### Development Server

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

## Deployment

### Supabase Edge Functions

To deploy the Supabase edge functions, use the provided deployment script:

```bash
./scripts/deploy-edge-functions.sh
```

**Important**: After deployment, make sure to set the required environment variables in your Supabase project dashboard:

1. Go to your Supabase project dashboard  
2. Navigate to Settings > Edge Functions  
3. Set ONLY the following Edge Functions environment variables (do not add them to client/browser environments):  
   - `LLAMA_CLOUD_API_KEY` – Your LlamaIndex Cloud API key  
   - `SUPABASE_SERVICE_ROLE_KEY` – Your service role key (KEEP PRIVATE; never expose in Next.js client or `.env.*` with `NEXT_PUBLIC_` prefix)  
   - `N8N_WEBHOOK_BASE_URL` – Your n8n webhook base URL (e.g., `https://n8ncloud.com/webhook`)

For local development of the Next.js API route, put this in `.env.local`:

### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
