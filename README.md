# Mobile Massage Directory

A Next.js 14 directory site for finding licensed mobile massage therapists across 200+ US cities. Built with Supabase, Tailwind CSS, and MDX for blog content.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Database:** Supabase (PostgreSQL)
- **Styling:** Tailwind CSS
- **Blog:** MDX via next-mdx-remote
- **Email:** Resend
- **Language:** TypeScript

## Getting Started

### 1. Clone and install

```bash
git clone <repo-url>
cd mobile-massage-directory
npm install
```

### 2. Set up environment variables

Create a `.env.local` file in the project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Resend (for lead notification emails)
RESEND_API_KEY=re_your-resend-api-key

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Set up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Open the SQL Editor in your Supabase dashboard
3. Paste the contents of `supabase-schema.sql` and run it
4. This creates the `mm_listings`, `mm_reviews`, and `mm_leads` tables with indexes and RLS policies

### 4. Seed the database

```bash
npm run seed
```

This inserts 50 sample listings across 10 cities (LA, NYC, Chicago, Houston, Phoenix, Seattle, Denver, Miami, Atlanta, Boston) with 2 reviews each.

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
mobile-massage-directory/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Homepage
│   ├── [slug]/page.tsx     # City + modality pages
│   ├── listing/[slug]/     # Individual listing pages
│   └── blog/               # Blog index + article pages
├── components/             # React components
├── content/blog/           # MDX blog articles
├── data/                   # Static data (cities, modalities, blog metadata)
├── lib/                    # Supabase client, utilities
├── public/                 # Static assets, llms.txt
├── scripts/seed.ts         # Database seed script
├── supabase-schema.sql     # Full SQL schema with RLS
├── types/                  # TypeScript type declarations
└── tailwind.config.ts      # Tailwind configuration
```

## Key Features

- **200+ city pages** with SEO-optimized URLs (`/mobile-massage-los-angeles-ca`)
- **8 modality pages** (Swedish, Deep Tissue, Sports, Prenatal, Hot Stone, Couples, Lymphatic, Trigger Point)
- **Individual listing pages** with reviews, modalities, and contact info
- **Lead capture form** stored in Supabase with optional email notifications via Resend
- **Blog** with 6 SEO-focused articles rendered via next-mdx-remote
- **Featured listings** highlighted on city and homepage
- **License and insurance badges** for verified therapists
- **Responsive design** optimized for mobile, tablet, and desktop
- **llms.txt** for AI discoverability

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run seed` | Seed Supabase with sample data |

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import the repo in Vercel
3. Add environment variables in Vercel project settings
4. Deploy

### Environment Variables for Production

Set the same variables from `.env.local` in your hosting platform:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `NEXT_PUBLIC_SITE_URL` (your production domain)

## Post-Launch Checklist

- [ ] Verify all environment variables are set in production
- [ ] Run `supabase-schema.sql` on your production Supabase project
- [ ] Seed the database or add real listings
- [ ] Test the lead capture form end-to-end (submission + email notification)
- [ ] Verify RLS policies are active (check Supabase dashboard > Authentication > Policies)
- [ ] Submit sitemap to Google Search Console
- [ ] Set up Supabase database backups (enabled by default on paid plans)
- [ ] Configure a custom domain and update `NEXT_PUBLIC_SITE_URL`
- [ ] Add Google Analytics or Plausible for traffic tracking
- [ ] Replace placeholder affiliate links in `data/modalities.ts`
- [ ] Set up uptime monitoring (UptimeRobot, Betterstack, etc.)
- [ ] Test mobile responsiveness across devices
- [ ] Run Lighthouse audit and fix any issues
