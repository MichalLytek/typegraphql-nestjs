<p align="center">
  <img alt="typegraphql logo" src="https://raw.githubusercontent.com/MichalLytek/typegraphql-nestjs/master/typegraphql-logo.png" width="300" height="200">
  <img alt="nest logo" src="https://nestjs.com/img/logo_text.svg" width="300" height="200">
</p>

# TypeGraphQL NestJS Module

Basic integration of [TypeGraphQL](https://typegraphql.com/) in [NestJS](https://nestjs.com/).

Allows to use TypeGraphQL features while integrating with NestJS modules system and dependency injector.

## Installation

```sh
npm i typegraphql-nestjs @nestjs/graphql
```

or

```sh
yarn add typegraphql-nestjs @nestjs/graphql
```

## How to use?

The `typegraphql-nestjs` package exports `TypeGraphQLModule` dynamic module, which is based on the official NestJS `GraphQLModule`.

It exposes two static methods. The first one is `TypeGraphQLModule.forRoot()` which you should call on your root module, just like with `GraphQLModule`.

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

## Caveats

While this integration provides a way to use TypeGraphQL with NestJS modules and dependency injector, for now it doesn't support [other NestJS features](https://docs.nestjs.com/graphql/tooling) like guards, interceptors, filters and pipes.

To achieve the same goals, you can use standard TypeGraphQL equivalents - middlewares, custom decorators, built-in authorization and validation.

Moreover, with `typegraphql-nestjs` you can also take advantage of additional features (comparing to `@nestjs/graphql`) like [inline field resolvers](https://typegraphql.com/docs/resolvers.html#field-resolvers), [interface args and resolvers](https://typegraphql.com/docs/next/interfaces.html#resolvers-and-arguments), [query complexity](https://typegraphql.com/docs/complexity.html) or [Prisma 2 integration](https://github.com/MichalLytek/type-graphql/blob/prisma/Readme.md).

## Examples

You can see some examples of the integration in this repo:

1. [Basics](https://github.com/MichalLytek/typegraphql-nestjs/tree/master/examples/1-basics)

   Basics of the integration, like `TypeGraphQLModule.forRoot` usage

1. [Multiple Servers](https://github.com/MichalLytek/typegraphql-nestjs/tree/master/examples/2-multiple-servers)

   Advanced usage of multiple schemas inside single NestJS app - demonstration of schema isolation in modules and `TypeGraphQLModule.forFeature` usage

1. [Request scoped dependencies](https://github.com/MichalLytek/typegraphql-nestjs/tree/master/examples/3-request-scoped)

   Usage of request scoped dependencies - retrieving fresh instances of resolver and service classes on every request (query/mutation)

You can run them by using `ts-node`, like `npx ts-node ./examples/1-basics/index.ts`.

All examples folders contain a `query.gql` file with some examples operations you can perform on the GraphQL servers.
