# Lansing Codes website

[Lansing Codes](https://www.lansing.codes) is a website of resources for coders
and other tech enthusiasts in and around Lansing, Michigan.

These resources include a calendar of tech events, a list of meetup groups,
local beginner-friendly resources, shout-outs of our gracious sponsors, and
other ways to get involved in the Lansing tech community.

This repository combines the frontend and data-sync backend into a single
[Next.js](https://nextjs.org) application deployed to Netlify.

## Code of Conduct

All participants are expected to treat others with respect and follow our [Code of Conduct](https://www.lansing.codes/code-of-conduct/).

## Questions

For general support, direct your questions to the
[Lansing Codes Slack team](http://slack.lansing.codes). The issue list for this
project is exclusively for bug reports and feature requests.

## Stay in touch

- [Slack](http://slack.lansing.codes)
- [Twitter](https://twitter.com/lansingcodes)
- [Facebook](https://www.facebook.com/lansingcodes)
- [Website](https://www.lansing.codes)
- [Newsletter](http://bit.ly/lansing-codes-newsletter)

## Getting started

If you want to run this website and make changes to it on your computer, some
initial setup is required.

### Required software

- [git](https://git-scm.com/downloads)
- [Node.js 20+](https://nodejs.org/) — [nvm](https://github.com/nvm-sh/nvm) is recommended for macOS/Linux users
- [Visual Studio Code](https://code.visualstudio.com/) with these extensions:
  - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
  - [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
  - [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

### Getting the source code

Fork the repository on GitHub, then clone your fork:

```sh
git clone https://github.com/YOUR_USERNAME/website.git
cd website
```

Or clone the main repository directly if you have commit access:

```sh
git clone https://github.com/lansingcodes/website.git
cd website
```

### Installing dependencies

```sh
npm install
```

### Configuring environment variables

Copy the example environment file:

```sh
cp .env.local.example .env.local
```

Then fill in the values as described below.

#### Firebase credentials

This app uses the Firebase Admin SDK to read and write Firestore data server-side.
Each developer sets up their own Firebase project for local development.

**1. Create a Firebase project**

1. Go to the [Firebase Console](https://console.firebase.google.com/) and sign
   in with a Google account.
2. Click **Add project**, give it a name (e.g. `lansing-codes-dev`), and follow
   the prompts. You can disable Google Analytics when asked.

**2. Enable Firestore**

1. In the left sidebar, click **Firestore Database** (under Databases).
2. Click **Create database**.
3. Choose **Start in test mode** for local development, then click **Next**.
4. Pick any region and click **Enable**.

**3. Get service account credentials**

1. In the left sidebar, click **Settings** (the gear icon).
2. From the dropdown, click **Service accounts**.
3. Scroll down and click **Generate new private key**, then confirm. A JSON file
   will download to your computer.
4. Open the downloaded JSON file. Copy these three fields into `.env.local`:

```sh
# "project_id" in the JSON
FIREBASE_PROJECT_ID=lansingcodes-dev-36daf

# "client_email" in the JSON
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@lansingcodes-dev-36daf.iam.gserviceaccount.com

# "private_key" in the JSON — paste the full value wrapped in double quotes
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"
```

The `private_key` value in the JSON already contains `\n` sequences — just
copy it as-is and wrap it in double quotes. Do not expand the `\n` into real
newlines.

#### Other variables

| Variable | Description |
|----------|-------------|
| `SYNC_SECRET` | A random string used to protect the `/api/sync/*` routes. Generate one with `openssl rand -base64 32`. |
| `NEXT_PUBLIC_BASE_URL` | Public URL of the site. Use `http://localhost:3000` for local development. |

### Running the development server

```sh
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the
site. The page will reload automatically as you edit files.

> **Note:** The site will look empty until you sync data (next step). That's
> normal — the events, groups, and sponsors all come from Firestore.

### Syncing data

Groups and sponsors are read directly from `data/groups.json` and `data/sponsors.json`.
Events are synced from Meetup iCal feeds into Firebase Firestore. To populate
events for local development, run:

```sh
npm run sync
```

(or `npm run sync:events`). Refresh the browser and you should see the full site.

These scripts automatically read `SYNC_SECRET` from your `.env.local` file.

## Other scripts

Build for production (also runs TypeScript type checking):

```sh
npm run build
```

Verify your code passes linting rules:

```sh
npm run lint
```

## Deployments

After a pull request is reviewed and merged to `main`, Netlify automatically
builds and publishes the site. The Netlify scheduled function runs every 2 hours
to sync the latest Meetup events into Firestore.

For both staging and production, Netlify runs `npm run build` and deploys the
resulting `.next` directory via `@netlify/plugin-nextjs`.

## Troubleshooting

**"Firebase credentials are missing" error on startup**
Make sure all three `FIREBASE_*` variables are set in `.env.local`. The
`FIREBASE_PRIVATE_KEY` value must be wrapped in double quotes.

**Sync returns 401 Unauthorized**
Check that `SYNC_SECRET` in `.env.local` matches what the sync scripts send.
Regenerate it with `openssl rand -base64 32` if needed, and restart the dev
server after changing `.env.local`.

**Node version errors**
This project requires Node.js 20 or later. Check your version with
`node --version`. If you use nvm, run `nvm install 20` and `nvm use 20`.

**Site looks empty after starting dev server**
You need to sync data first. Run `npm run sync` in a second terminal while the
dev server is running (see [Syncing data](#syncing-data) above).

## Contribution

You are welcome and encouraged to make changes to this website by submitting
pull requests or forking our code to make your own community website! See the
[Contributing Guide](.github/CONTRIBUTING.md) for details.

## License

[Hippocratic 2.1](https://firstdonoharm.dev)

Copyright (c) 2015-Present, Humanity Codes LLC
