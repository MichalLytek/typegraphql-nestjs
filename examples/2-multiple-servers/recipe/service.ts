import { Injectable } from "@nestjs/common";

import { Recipe } from "./types";

@Injectable()
export default class RecipeService {
  private readonly recipes: Recipe[] = [];

  getRecipes() {
    return this.recipes;
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
  }
}
