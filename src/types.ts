import { GqlModuleOptions } from "@nestjs/graphql";
import { BuildSchemaOptions } from "type-graphql";

export type TypeGraphQLFeatureModuleOptions = Pick<
  BuildSchemaOptions,
  "orphanedTypes"
>;

export type TypeGraphQLRootModuleOptions = Omit<
  GqlModuleOptions,
  "schema" | "autoSchemaFile" | "buildSchemaOptions"
> &
  Omit<BuildSchemaOptions, "resolvers" | "orphanedTypes" | "container">;
