# [Scre.ws](https://scre.ws)

Screws is a URL shortening service made with Next.js and Mongo DB.

## Getting Started

Before doing anything, clone this repository to your local machine.

Create a cluster and database on MongoDB Atlas, add a user with read/write access for the application to use, and whitelist your IP address. Adding users can be done from the `Database Access` link on the left panel, and whitelisting IPs can be found just below as `Network Access`.

Click the `Clusters` tab on the left then the `CONNECT` button from the cluster details pane. Select the `Connect your application` option and copy the connection URL string. Make sure to swap out all placeholders for `<user>`, `<password>`, etc, with the data you used in the previous step. This will be added to the `.env.local` file in a couple steps.

Log into the Discord Developer Portal and create an application. The Client ID and Client Secret values will be added to `.env.local` as well. This Discord application integration is used to allow Discord users with administrator privileges to log in on the website using oauth to perform basic moderation tasks.

Now, create a file `.env.local` at the project root next to the `.env` file. Copy the contents of `.env`, and replace them with valid values. Example:

```
URL_COLLECTION_NAME=urls // Optional
NEXT_PUBLIC_BASE_URL=https://example.com // Optional
NEXTAUTH_URL=https://example.com // Base URL: http:localhost:3000 for dev, deploy URL for production
NEXTAUTH_SECRET= // Secret key used for signing JWT and other authentication stuff

DISCORD_SERVER_ID=1234567890 // ID of support server
DISCORD_CLIENT_ID=1234567890 // Client ID for Discord Application
DISCORD_CLIENT_SECRET=1234567890 // Client Secret for Discord Application
DISCORD_LOGS_WEBHOOK_URL=https://discordapp.com/api/webhooks/ // For admin logs

DB_CONNECTION_STRING=mongodb+srv://<user>:<password>@<clustername>.xxxxx.azure.mongodb.net/<dbname>?retryWrites=true&w=majority
```

Optional variables have defaults:
`URL_COLLECION_NAME` defaults to `urls`. `NEXT_PUBLIC_BASE_URL` defaults to Vercel's `VERCEL_URL` or `http://localhost:3000`.

Customize any values you'd like in `/config.index.ts`, like choosing whether to use random words or random characters for generating URL codes.

Finally, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to try it out!.

## Deploy on Vercel

The easiest way to deploy this application is to use the [Vercel Platform](https://vercel.com/import) from the creators of Next.js.

Enter the same environment variables into the Vercel dashboard, (or any other way for your hosting provider).

If you use Vercel, you can use the system variable they provide, `VERCEL_URL`, instead of using `BASE_URL`. _To enable `VERCEL_URL`, add it with no value and Vercel does the rest_.
