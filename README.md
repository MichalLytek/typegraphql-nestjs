<p align="center">
  <img alt="typegraphql logo" src="https://raw.githubusercontent.com/MichalLytek/typegraphql-nestjs/master/typegraphql-logo.png" width="300" height="200">
  <img alt="nest logo" src="https://nestjs.com/img/logo_text.svg" width="300" height="200">
</p>

# TypeGraphQL NestJS Module

Basic integration of [TypeGraphQL](https://typegraphql.com/) in [NestJS](https://nestjs.com/).

Allows to use TypeGraphQL features while integrating with NestJS modules system and dependency injector.

## Installation

First, you need to instal the `typegraphql-nestjs` module along with `@nestjs/graphql`:

```sh
npm i typegraphql-nestjs @nestjs/graphql
```

If you haven't installed it yet, it's time to add `type-graphql` into the project:

```sh
npm i type-graphql
```

## How to use?

The `typegraphql-nestjs` package exports `TypeGraphQLModule` dynamic module, which is based on the official NestJS `GraphQLModule`. It exposes three static methods:

### `.forRoot()`

The first one is `TypeGraphQLModule.forRoot()` which you should call on your root module, just like with the official `GraphQLModule`.

The only difference is that as its argument you can provide [typical TypeGraphQL `buildSchema` options](https://typegraphql.com/docs/bootstrap.html) like `emitSchemaFile` or `authChecker` apart from the [standard `GqlModuleOptions` from `@nestjs/graphql`](https://docs.nestjs.com/graphql/quick-start#installation) like `installSubscriptionHandlers` or `context`:

```ts
import { Module } from "@nestjs/common";
import { TypeGraphQLModule } from "typegraphql-nestjs";

import RecipeModule from "./recipe/module";
import { authChecker } from "./auth";

@Module({
  imports: [
    TypeGraphQLModule.forRoot({
      emitSchemaFile: true,
      validate: false,
      authChecker,
      dateScalarMode: "timestamp",
      context: ({ req }) => ({ currentUser: req.user }),
    }),
    RecipeModule,
  ],
})
export default class AppModule {}
```

Then, inside the imported modules (like `RecipeModule`) you just need to register the resolvers classes in the module `providers` array:

```ts
import { Module } from "@nestjs/common";

import RecipeResolver from "./resolver";
import RecipeService from "./service";

@Module({
  providers: [RecipeResolver, RecipeService],
})
export default class RecipeModule {}
```

And that's it! 😁

Notice that the resolvers classes are automatically inferred from your submodules `providers` array, so you don't need to specify `resolvers` property from TypeGraphQL `buildSchema` options inside `TypeGraphQLModule.forRoot()`.

### `.forFeature()`

In case of need to provide `orphanedTypes` setting, you should use `TypeGraphQLModule.forFeature()`. The recommended place for that is in the module where the orphaned type (like `SuperRecipe`) belongs:

```ts
import { Module } from "@nestjs/common";
import { TypeGraphQLModule } from "typegraphql-nestjs";

import RecipeResolver from "./resolver";
import RecipeService from "./service";
import { SuperRecipe } from "./types";

@Module({
  imports: [
    TypeGraphQLModule.forFeature({
      orphanedTypes: [SuperRecipe],
    }),
  ],
  providers: [RecipeResolver, RecipeService],
})
export default class RecipeModule {}
```

Using `.forFeature()` ensures proper schemas isolation and automatically supply `orphanedTypes` option for underlying `buildSchema` from TypeGraphQL - again, there's no need to provide it manually in `.forRoot()` options.

### `.forRootAsync()`

If you need to access some services to construct the `TypeGraphQLModule` options, you might be interested in the `TypeGraphQLModule.forRootAsync()` method. It allows you to define your own `useFactory` implementation where you have injected services from `imports` option.

Example of using the config service to generate `TypeGraphQLModule` options:

```ts
@Module({
  imports: [
    ConfigModule,
    RecipeModule,
    TypeGraphQLModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        cors: true,
        debug: config.isDevelopmentMode,
        playground: !config.isDevelopmentMode,
        validate: false,
        dateScalarMode: "timestamp",
        emitSchemaFile:
          config.isDevelopmentMode && path.resolve(__dirname, "schema.gql"),
      }),
    }),
  ],
})
export default class AppModule {}
```

### `TypeGraphQLFederationModule`

`typegraphql-nestjs` has also support for [Apollo Federation](https://www.apollographql.com/docs/federation/).

However, Apollo Federation requires building a federated GraphQL schema, hence you need to use the `TypeGraphQLFederationModule` module, designed specially for that case.

The usage is really similar to the basic `TypeGraphQLModule` - the only different is that `.forFeature()` method has an option to provide `referenceResolvers` object which is needed in some cases of Apollo Federation:

```ts
function resolveUserReference(
  reference: Pick<User, "id">,
): Promise<User | undefined> {
  return db.users.find({ id: reference.id });
}

@Module({
  imports: [
    TypeGraphQLFederationModule.forFeature({
      orphanedTypes: [User],
      referenceResolvers: {
        User: {
          __resolveReference: resolveUserReference,
        },
      },
    }),
  ],
  providers: [AccountsResolver],
})
export default class AccountModule {}
```

The `.forRoot()` method has no differences but you should provide the `skipCheck: true` option as federated schema can violate the standard GraphQL schema rules like at least one query defined:

```ts
@Module({
  imports: [
    TypeGraphQLFederationModule.forRoot({
      validate: false,
      skipCheck: true,
    }),
    AccountModule,
  ],
})
export default class AppModule {}
```

> Be aware that you cannot mix `TypeGraphQLFederationModule.forRoot()` with the base `TypeGraphQLModule.forFeature()` one.
> You need to consistently use only `TypeGraphQLFederationModule` across all modules.

Then, for exposing the federated schema using Apollo Gateway, you should use the standard NestJS [GraphQLGatewayModule](https://docs.nestjs.com/graphql/federation#federated-example-gateway).

## Caveats

While this integration provides a way to use TypeGraphQL with NestJS modules and dependency injector, for now it doesn't support [other NestJS features](https://docs.nestjs.com/graphql/tooling) like guards, interceptors, filters and pipes.

To achieve the same goals, you can use standard TypeGraphQL equivalents - middlewares, custom decorators, built-in authorization and validation.

Moreover, with `typegraphql-nestjs` you can also take advantage of additional features (comparing to `@nestjs/graphql`) like [inline field resolvers](https://typegraphql.com/docs/resolvers.html#field-resolvers), [Prisma 2 integration](https://github.com/MichalLytek/typegraphql-prisma/blob/main/Readme.md) or up-to-date capabilities like deprecating input fields and args (thanks to always synced with latests `graphql-js`).

## Examples

You can see some examples of the integration in this repo:

1. [Basics](https://github.com/MichalLytek/typegraphql-nestjs/tree/master/examples/1-basics)

   Basics of the integration, like `TypeGraphQLModule.forRoot` usage

1. [Multiple Servers](https://github.com/MichalLytek/typegraphql-nestjs/tree/master/examples/2-multiple-servers)

   Advanced usage of multiple schemas inside single NestJS app - demonstration of schema isolation in modules and `TypeGraphQLModule.forFeature` usage

1. [Request scoped dependencies](https://github.com/MichalLytek/typegraphql-nestjs/tree/master/examples/3-request-scoped)

   Usage of request scoped dependencies - retrieving fresh instances of resolver and service classes on every request (query/mutation)

1. [Apollo Federation](https://github.com/MichalLytek/typegraphql-nestjs/tree/master/examples/4-federation)

   Showcase of Apollo Federation approach, using the `TypeGraphQLFederationModule` and `GraphQLGatewayModule`.

1. [Middlewares](https://github.com/MichalLytek/typegraphql-nestjs/tree/master/examples/5-middlewares)

   Usage of class-based middlewares - modules, providers and schema options

You can run them by using `ts-node`, like `npx ts-node ./examples/1-basics/index.ts`.

All examples folders contain a `query.gql` file with some examples operations you can perform on the GraphQL servers.
