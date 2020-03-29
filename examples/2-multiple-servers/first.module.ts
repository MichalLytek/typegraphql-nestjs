import { Module } from "@nestjs/common";
import path from "path";
import { TypeGraphQLModule } from "../../src";

import RecipeModule from "./recipe/module";

@Module({
  imports: [
    TypeGraphQLModule.forRoot({
      emitSchemaFile: path.resolve(__dirname, "first-schema.graphql"),
      validate: false,
    }),
    RecipeModule,
  ],
})
export default class FirstAppModule {}
