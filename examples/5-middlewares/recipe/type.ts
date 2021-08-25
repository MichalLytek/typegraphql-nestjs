import { ObjectType, Field, InputType } from "type-graphql";

@ObjectType()
@InputType("RecipeInput")
export default class Recipe {
  @Field()
  title!: string;

  @Field({ nullable: true })
  description?: string;
}
