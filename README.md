# volunteer-site

WWAMI volunteer catalog and sign-ups. Made with NextJS (React)

Development Requirements: Node

Set up: Run `npm install` or `yarn`

Development: Run `yarn dev` in the root

Structure: NextJS automatically handles page routing. The app is server-side
rendered (meaning we render the page on the server and send the result to the
client), backend logic held the `api` folder and in `getServerSideProps` is
hidden from the client. We use our secret API keys here and it is important that
these are not leaked. Typescript is used as the language.

Types: types are mostly global and stored in `/next-env.d.ts`
