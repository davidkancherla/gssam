# Good Shepherd South Asian Ministry (GSSAM)

Public website, volunteer CMS (admin portal), and member portal for **Good Shepherd South Asian Ministry**, a Lutheran congregation in Fremont, California.

This application recreates the public content of the existing WordPress site at [gssam-iccfremont.com](https://gssam-iccfremont.com) and adds signed-in tools the live site does not have. It does **not** clone Hostinger or WordPress files.

- **Church:** Good Shepherd South Asian Ministry (GSSAM)
- **Address:** 4211 Carol Ave, Fremont, CA 94538
- **Worship:** Sunday School & Worship 11:30 AM–1:00 PM
- **Languages:** Telugu, Hindi, Tamil, and English
- **Ministries:** Men’s Fellowship, Women’s Fellowship, Youth Fellowship, Sunday School, Community Engagement

## Stack

- [Next.js](https://nextjs.org/) 16 (App Router) + TypeScript + Tailwind CSS
- [Prisma](https://www.prisma.io/) 6 with SQLite (local file; swap the datasource later for Postgres if you deploy)
- Cookie sessions (JWT via `jose`) with distinct **ADMIN** and **MEMBER** roles

## Run locally

You need Node.js 20+.

```bash
cp .env.example .env
npm install
npm run setup
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

`npm run setup` generates the Prisma client, creates `prisma/dev.db`, and loads GSSAM pages, ministries, events, YouTube messages, gallery photos, weekly bulletins, and **labeled demo finance data**.

To wipe and reseed:

```bash
npm run db:reset
```

## Demo logins

These accounts are created by the seed. They are for local review only.

| Role | Email | Password | What you should see |
| --- | --- | --- | --- |
| Admin | `admin@gssam.demo` | `GSSAM-Admin-2026` | CMS for pages, ministries, events, messages, gallery uploads, weekly bulletin, church-wide finance, contact inbox |
| Member | `member@gssam.demo` | `GSSAM-Member-2026` | Own finance, weekly bulletin, income tracking (Priya Sharma demo household) |
| Member | `member2@gssam.demo` | `GSSAM-Member-2026` | A second household so you can confirm members do **not** see each other’s gifts |

All money rows are tagged in the UI as **demo sample data**. They are fictional. Do not treat them as real GSSAM member finances.

## What a reviewer should try

1. **Public site** — Home, About, Contact, Giving, Gallery, Messages, Events, Ministries. Copy is GSSAM-specific (no lorem ipsum, no “Hello world” posts). Messages embed real GSSAM Fremont YouTube worship recordings.
2. **Admin** — Sign in as `admin@gssam.demo`. Edit Home title/introduction and confirm `/` updates. Upload a photo under Gallery, set it to Homepage hero or Homepage gallery, and confirm it appears on `/`. Delete an upload and confirm the file is gone from `public/uploads/`.
3. **Member** — Sign in as `member@gssam.demo`. Open Finance, Weekly, and Income. Confirm the banner says the figures are sample data. Sign in as `member2@gssam.demo` and confirm you do **not** see Priya Sharma’s rows.
4. **Privacy** — Visit `/admin` while signed in as a member; you should be sent to the member portal. Visit `/member` while logged out; you should land on sign-in.

```bash
npm run verify
```

That script expects the app to already be running on port 3000. It checks public copy, login, and role gates.

## Portals

### Public

Home, About Us, Ministries, Events, Messages, Gallery, Giving, Contact Us, Privacy Policy. Contact messages are stored for the admin inbox.

### Admin

Volunteer CMS (forms, not a database console):

- Edit page title, introduction, and body
- Add/edit ministries, events, and sermon/YouTube links
- Upload gallery photos (saved under `public/uploads/`)
- Publish weekly bulletins
- See church-wide income, offerings, and expenses
- Read contact-form inquiries

### Member

- **Finance** — tithes, weekly offerings, expenses
- **Weekly** — bulletin / worship notes plus that household’s giving
- **Income** — private income tracking

Members see only their own financial rows. Admins see congregation totals and every demo household.

## Deploy later

This is a standard Next.js app. For production:

1. Set `AUTH_SECRET` to a long random value. If it is still the example string from `.env.example` (`change-this-to-a-long-random-string-before-production`), change it before deploy. Local demo only uses that placeholder when the env var is missing.
2. Replace SQLite with Postgres (update `prisma/schema.prisma` `datasource` and `DATABASE_URL`).
3. Put uploads on object storage instead of `public/uploads` if you run multiple servers.
4. Remove or replace the demo users before a real congregation uses the portal.

Giving on the public site lists the church’s Zelle and PayPal **email** (`gssam2005@gmail.com`) and mailed checks to 4211 Carol Ave. There is no card checkout on the site.

## Content notes

- Public prose is taken from the live GSSAM site (about, ministries, worship times, contact, giving platforms) with placeholder Latin and dummy posts replaced.
- Logo, ministry images, event images, and gallery photos were copied from **public** URLs on the live site, not from a WordPress export.
- Sermon titles and IDs come from the public GSSAM Fremont YouTube channel.

## License

Congregation website project for GSSAM. All demo financial data is fictional.
