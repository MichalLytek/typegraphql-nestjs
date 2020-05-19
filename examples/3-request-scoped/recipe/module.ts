import { Module } from "@nestjs/common";

import { RecipeResolver, AddRecipeResultResolver } from "./resolvers";
import RecipeService from "./service";

@Module({
  providers: [RecipeResolver, AddRecipeResultResolver, RecipeService],
})
export default class RecipeModule {}
