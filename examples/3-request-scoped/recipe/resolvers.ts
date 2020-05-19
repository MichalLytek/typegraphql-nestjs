import { Injectable, Scope } from "@nestjs/common";
import { Resolver, Query, Mutation, Arg, FieldResolver } from "type-graphql";

import RecipeService from "./service";
import { Recipe, AddRecipeResult } from "./types";

@Injectable({ scope: Scope.REQUEST })
@Resolver()
export class RecipeResolver {
  constructor(private readonly recipeService: RecipeService) {}

  @Query(returns => [Recipe])
  recipes() {
    return this.recipeService.getRecipes();
  }

  @Mutation(returns => AddRecipeResult)
  addRecipe(@Arg("input") recipe: Recipe) {
    this.recipeService.addRecipe(recipe);
    return recipe;
  }
}

@Injectable()
@Resolver(of => AddRecipeResult)
export class AddRecipeResultResolver {
  constructor(private readonly recipeService: RecipeService) {}

  @FieldResolver()
  recipes() {
    return this.recipeService.getRecipes();
  }
}
