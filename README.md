# Cheeseria

This app lists products and allows a user to add them to an order.

https://d74rqe477cov7.cloudfront.net

<img width="1182" alt="image" src="https://github.com/rorber/cheeseria/assets/19149315/0ad64663-0fe3-4ff1-af59-47b5f8038ae7">

## Installation and running locally

1. Install pnpm
2. From the root workspace run `pnpm build`
3. Rename env.example to .env
4. In 2 separate shells:
  1. from the services/core-api directory run `pnpm dev`
  2. from the ui/pos directory run `pnpm vite`

## API docs

Access tRPC Panel (similar to Swagger / Open API) locally via http://localhost:4321/offline/api or hosted on https://0pvs4emdil.execute-api.ap-southeast-2.amazonaws.com/dev/api

## Improvements

Following the steel thread methodology, my goal was getting something simple working end-to-end. Further improvements are not limited to:
- adding unit / integration testing to the UI (Jest)
- adding integration testing to the API (Supertest)
- adding E2E testing (Playwright)
- adding the above testing to build pipelines
- adding responsive design for various screen sizes, ensuring consistency across major browsers
- Introduce Redux / other state layer to reduce duplicate api calls, improve inter-component data comms, simplify code
- replacing json files with a proper persistence layer (e.g. Postgres DB) and abstracting interaction logic so the API services can call CRUD repository methods
- creating more reusable UI components and add them to a new workspace so they can be shared between UI apps if/when required
- adding error handling / boundaries to the UI
- adding alarms and other observability mechanisms to the UI and API
- adding auth layer, securing API endpoints, associating users with orders
