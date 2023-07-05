import { Module } from "@nestjs/common";
import { ApolloDriver } from "@nestjs/apollo";
import { TypeGraphQLModule } from "../../src";
import { LoggingMiddleware } from "./logging/middleware";

import RecipeModule from "./recipe/module";
import LoggingModule from "./logging/module";

@Module({
  imports: [
    TypeGraphQLModule.forRoot({
      driver: ApolloDriver,
      emitSchemaFile: true,
      // register middlewares in settings
      globalMiddlewares: [LoggingMiddleware],
    }),
    RecipeModule,
    // import module with middleware provider
    LoggingModule,
  ],
})
export default class AppModule {}
