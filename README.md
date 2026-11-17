# volunteer-site

WWAMI volunteer catalog and sign-ups. Made with NextJS (React)

Development Requirements: Node

Set up: Run `yarn`

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
    `
   **Note:** Never commit your `.env` file to version control. Add it to your `.gitignore` file to prevent accidental commits:

```plaintext
  # .gitignore
  .env.development.local
```

Development: Run `yarn dev` in the root

Testing (Firestore rules): The rules tests in `__tests__` run against the
Firestore emulator, which needs a JRE. Rather than requiring everyone to install
Java, the `Dockerfile` builds an image with Node, a JDK 21 runtime, and a pinned
`firebase-tools`, with the emulator jar baked in at build time.

Build the image once:

```plaintext
docker build -t firebase-emulator .
```

Then start the emulator and run the tests in a second terminal:

```plaintext
docker run --rm -p 8080:8080 -v "$PWD:/app" firebase-emulator
yarn test:rules
```

If you have Java 11+ installed, you can skip Docker. This is what CI runs:

```plaintext
npx firebase-tools@15.27.0 emulators:exec --only firestore --project demo-test "yarn test:rules"
```

The `-v` mount is required: the image ships no application code, so the
container reads `firebase.json` and `firestore.rules` from your working tree.
This means rules edits take effect on container restart with no rebuild. Only
changes to the Dockerfile itself (firebase-tools version, JRE) require one.

Note that `firebase.json` sets the Firestore emulator's host to `0.0.0.0`. The
default of `127.0.0.1` binds to the container's own loopback, which `-p` cannot
reach, so the emulator would appear to start but refuse every connection.

Tests use the project ID `demo-test`. The `demo-` prefix marks it as a fake
project: no credentials are needed, and the Firebase SDKs will error rather than
silently fall back to a real project if the emulator is not running.

The emulator UI is enabled on port 4000 but is not published by default. Add
`-p 4000:4000` and a `"host": "0.0.0.0"` under `emulators.ui` to browse the data.

## CI and running checks locally

Every pull request to `main` or `development` runs the checks in
`.github/workflows/ci.yml`. Run the same commands locally before opening a PR:

| Check | Command | Notes |
| --- | --- | --- |
| Lint | `yarn lint` | Errors fail CI. Warnings don't. |
| Type check | `yarn typecheck` | Fails only if your change adds type errors (see below). |
| Unit tests | `yarn test:unit` | Fast, no emulator or network. Tests live in `__tests__/unit/`. |
| Rules tests | `yarn test:rules` | Needs the Firestore emulator (see Testing above). |
| Build + smoke | `yarn build && bash scripts/smoke.sh` | Starts the built app and checks key pages respond. |

**Why `yarn typecheck` and not `tsc`:** the codebase has a backlog of type
errors, and `next.config.js` lets builds ignore them. `yarn typecheck`
compares error counts per file against `.tsc-baseline.json`, so new errors
fail CI without the old ones blocking anyone. If you fix type errors, run
`yarn typecheck --update` and commit the updated baseline. `yarn tscheck`
still lists every error.

CI uses placeholder Firebase settings and a throwaway key generated for each
run. It never touches a real Firebase project, and no secrets are stored in
GitHub.

Structure: NextJS automatically handles page routing. The app is server-side
rendered (meaning we render the page on the server and send the result to the
client), backend logic held the `api` folder and in `getServerSideProps` is
hidden from the client. We use our secret API keys here and it is important that
these are not leaked. Typescript is used as the language.

Types: types are mostly global and stored in `/next-env.d.ts`
