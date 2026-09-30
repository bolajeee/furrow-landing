# Furrow landing page

A responsive Next.js 14 landing page for the upcoming Furrow mobile app.

## Mobile development documentation

Start with [doc/readme.md](doc/readme.md) for the planned Flutter app: vegetable self-growing, practical learning, and community. The directory includes features, user journeys, architecture, data/API proposals, content and moderation plans, testing, a roadmap, and an implementation progress tracker. Mobile functionality is planned, not implemented in this web repository.

## Development

```sh
npm install
npm run dev
```

Open http://localhost:3000. Use `npm run build` and `npm start` for production. Google Fonts require network access during the first build.

## Pilot signup

All pilot links lead to the form at `#start`. It collects a name, email, region, growing experience, optional crops, and permission to send pilot updates.

1. Copy `.env.example` to `.env.local`.
2. Set `PILOT_WEBHOOK_URL` to your signup service's HTTPS endpoint.
3. Set `PILOT_WEBHOOK_TOKEN` if your service requires a bearer token.
4. Restart the server (or configure these environment variables on your hosting provider).

The endpoint receives JSON with `name`, `email`, `location`, `role`, `crops`, `consent`, `source`, and `submittedAt`. It must persist the signup and return a 2xx response. Configure the receiving service to deduplicate by email and apply rate limits to the public signup endpoint at your hosting layer.

Secrets stay on the server. `/api/pilot` validates fields and consent, limits request size, checks browser origin, includes a honeypot, and times out failed deliveries. Without a configured destination, it returns an unavailable message. The UI preserves input on errors and only confirms signup after successful delivery. No submissions are stored locally.

## Checks

```sh
npm test
npx tsc --noEmit
npm run build
```

API tests cover validation, malformed and oversized payloads, origin checks, unconfigured delivery, successful forwarding, and upstream failures. They use a mocked receiver and do not send real signups.

To build while a development server is using `.next`, set `FURROW_BUILD_DIR=.next-preview` for both the build and preview server. In PowerShell:

```powershell
$env:FURROW_BUILD_DIR = '.next-preview'
npm run build
npm run start -- -p 3100
```

## Page structure

- `Hero`: responsive journal illustration with a scroll-grown flower; reduced-motion visitors see the full bloom.
- `HowItWorks`: three steps for the planned app.
- `Globe`: smooth region rotation and fading comments with previous/next arrows, region dots, and keyboard controls.
- `Features`: previews of the assistant and grower circles.
- `Cta` / `PilotForm`: pilot signup and submission states.
- `app/api/pilot/route.ts`: server-side webhook integration.

Community counts and conversations are illustrative placeholders, labeled on the page. The mobile app is still in development; joining the list does not grant immediate app access.
