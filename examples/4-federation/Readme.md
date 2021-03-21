## Apollo Federation

Showcase of Apollo Federation approach, using the `TypeGraphQLFederationModule` and `GraphQLGatewayModule`.

### How to run?

This example is a bit more complex than the other ones.

Apart from running the main `index.ts` file by e.g. `npx ts-node ./examples/4-federation/index.ts`, you also need to run all the other services first:

- `npx ts-node ./examples/4-federation/accounts/index.ts`
- `npx ts-node ./examples/4-federation/inventory/index.ts`
- `npx ts-node ./examples/4-federation/products/index.ts`
- `npx ts-node ./examples/4-federation/reviews/index.ts`

They will be listening on ports 3001-3004 and the main script on port 3000.
