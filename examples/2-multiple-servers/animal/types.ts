import { ObjectType, Field, Int, InputType } from "type-graphql";

@ObjectType()
@InputType("AnimalInput")
export class Animal {
  @Field()
  name!: string;

  @Field(type => Int)
  weight!: number;
}

@ObjectType()
export class SuperAnimal extends Animal {
  @Field()
  isSuperHero!: boolean;
}
