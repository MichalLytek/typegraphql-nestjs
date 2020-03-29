import { Module } from "@nestjs/common";
import { TypeGraphQLModule } from "../../src";

import RecipeModule from "./recipe/module";

@Module({
  imports: [
    TypeGraphQLModule.forRoot({
      emitSchemaFile: true,
      validate: false,
    }),
    RecipeModule,
  ],
})
export default class AppModule {}
