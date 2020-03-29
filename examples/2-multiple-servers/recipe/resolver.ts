import { Injectable } from "@nestjs/common";
import { Resolver, Query, Mutation, Arg } from "type-graphql";

import RecipeService from "./service";
import { Recipe } from "./types";

@Injectable()
@Resolver()
export default class RecipeResolver {
  constructor(private readonly recipeService: RecipeService) {}

  @Query(returns => [Recipe])
  recipes() {
    return this.recipeService.getRecipes();
  }

  @Mutation(returns => Recipe)
  addRecipe(@Arg("input") recipe: Recipe) {
    this.recipeService.addRecipe(recipe);
    return recipe;
  }
}
