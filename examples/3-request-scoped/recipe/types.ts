import { ObjectType, Field, InputType } from "type-graphql";

@ObjectType()
@InputType("RecipeInput")
export class Recipe {
  @Field()
  title!: string;

  @Field({ nullable: true })
  description?: string;
}

@ObjectType()
export class AddRecipeResult {
  @Field(type => [Recipe])
  recipes!: Recipe[];
}
