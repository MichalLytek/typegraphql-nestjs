import { Injectable, Scope } from "@nestjs/common";

import { Recipe } from "./types";

@Injectable({ scope: Scope.REQUEST })
export default class RecipeService {
  private readonly recipes: Recipe[] = [];

  getRecipes() {
    return this.recipes;
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
  }
}
