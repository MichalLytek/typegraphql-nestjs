import { ApolloDriver } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import path from "path";
import { TypeGraphQLModule } from "../../src";

import AnimalModule from "./animal/module";

@Module({
  imports: [
    TypeGraphQLModule.forRoot({
      driver: ApolloDriver,
      emitSchemaFile: path.resolve(__dirname, "second-schema.graphql"),
    }),
    AnimalModule,
  ],
})
export default class SecondAppModule {}
