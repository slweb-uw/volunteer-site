# orderstatus.tv

SaaS for sharing order status. Made with NextJS. Payments through Stripe

Development Requirements: Node

Set up: Run `npm install` or `yarn`

Development: Run `yarn dev` in the root

Structure: NextJS automatically handles page routing. The app is server-side rendered (meaning we render the page on the server and send the result to the client), backend logic held the `api` folder and in `getServerSideProps` is hidden from the client. We use our secret API keys here and it is important that these are not leaked. Otherwise, pages are a mostly Typescript files, with occasional Javascript files for legacy pages.
