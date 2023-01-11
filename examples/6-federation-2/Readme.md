## Apollo Federation

Showcase of Apollo Federation approach, using the `ApolloGatewayDriver`.

### How to run?

This example is a bit more complex than the other ones.

Apart from running the main `index.ts` file by e.g. `npx ts-node ./examples/6-federation-2/index.ts`, you also need to run all the other services first:

- `npx ts-node ./examples/6-federation-2/accounts/index.ts`
- `npx ts-node ./examples/6-federation-2/inventory/index.ts`
- `npx ts-node ./examples/6-federation-2/products/index.ts`
- `npx ts-node ./examples/6-federation-2/reviews/index.ts`

They will be listening on ports 3001-3004 and the main script on port 3000.
