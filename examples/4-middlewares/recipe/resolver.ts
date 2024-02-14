import { Injectable } from "@nestjs/common";
import { Resolver, Query, Mutation, Arg, UseMiddleware } from "type-graphql";

import RecipeService from "./service";
import Recipe from "./type";
import { LocalLoggingMiddleware } from "../logging/local-logging-middleware";

@Injectable()
@Resolver()
export default class RecipeResolver {
  constructor(private readonly recipeService: RecipeService) {}

  @Query(returns => [Recipe])
  recipes() {
    return this.recipeService.getRecipes();
  }

  @UseMiddleware(LocalLoggingMiddleware)
  @Mutation(returns => Recipe)
  addRecipe(@Arg("input") recipe: Recipe) {
    this.recipeService.addRecipe(recipe);
    return recipe;
  }
}
