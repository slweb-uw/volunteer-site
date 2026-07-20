# volunteer-site

WWAMI volunteer catalog and sign-ups. Made with NextJS (React) and TypeScript.

## Requirements

- **Node** 18+ (Next.js 14 requires Node 18.17 or newer)
- **npm** — this project uses npm. Don't use yarn or pnpm: mixing package
  managers causes dependency versions to drift out of sync (it has broken
  production before). A `preinstall` guard will stop the install if you use
  the wrong one.
  Set up: npm install

## Setup

Run:

````bash
npm install

This installs the exact versions pinned in the committed package-lock.json.
Always commit changes to package-lock.json so everyone — and Vercel — builds
the same dependency tree.

Configuration:

To configure environment variables, follow these steps:

1. **Create a `.env.development.local` file in the root of the project directory:**
2. **Add your environment variables to the `.env` file:**
   `plaintext
   # Sample .env file
   NEXT_PUBLIC_API_KEY=your-api-key-here
   ...
   FB_PRIVATE_KEY=your-secret-key-here
   ...
   `**Note:** Never commit your`.env`file to version control. Add it to your`.gitignore` file to prevent accidental commits:

```plaintext
  # .gitignore
  .env.development.local
````

Development: Run `npm run dev` in the root

Structure: NextJS automatically handles page routing. The app is server-side
rendered (meaning we render the page on the server and send the result to the
client), backend logic held the `api` folder and in `getServerSideProps` is
hidden from the client. We use our secret API keys here and it is important that
these are not leaked. Typescript is used as the language.

Types: types are mostly global and stored in `/next-env.d.ts`
