import { Module } from "@nestjs/common";
import { TypeGraphQLModule } from "../../../src";

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
