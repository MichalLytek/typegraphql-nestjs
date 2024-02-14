import { Module } from "@nestjs/common";
import { ApolloDriver } from "@nestjs/apollo";
import { TypeGraphQLModule } from "../../src";

import { AppContext } from "./context";
import RecipeModule from "./recipe/module";
import LoggingModule from "./logging/module";
import { GlobalLoggingMiddleware } from "./logging/global-logging-middleware";

@Module({
  imports: [
    TypeGraphQLModule.forRoot({
      driver: ApolloDriver,
      emitSchemaFile: true,
      // register middlewares in settings
      globalMiddlewares: [GlobalLoggingMiddleware],
      // use fake context
      context: (): AppContext => ({ user: "Johny Debugger" }),
    }),
    RecipeModule,
    // import module with middleware provider
    LoggingModule,
  ],
})
export default class AppModule {}
