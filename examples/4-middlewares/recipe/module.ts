import { Module } from "@nestjs/common";

import RecipeResolver from "./resolver";
import RecipeService from "./service";

@Module({
  providers: [RecipeResolver, RecipeService],
})
export default class RecipeModule {}
