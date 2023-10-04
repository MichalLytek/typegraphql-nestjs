import { Directive, ObjectType, Field, ID } from "type-graphql";

@Directive(`@key(fields: "id")`)
@ObjectType()
export default class User {
  @Field(type => ID)
  id!: string;

  @Directive("@external")
  @Field()
  username!: string;
}
