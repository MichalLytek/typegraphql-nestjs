import { ApolloDriver } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { TypeGraphQLModule } from "../../src";

import RecipeModule from "./recipe/module";

@Module({
  imports: [
    TypeGraphQLModule.forRoot({
      driver: ApolloDriver,
      emitSchemaFile: true,
    }),
    RecipeModule,
  ],
})
export default class AppModule {}
