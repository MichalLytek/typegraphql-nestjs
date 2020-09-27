import { BuildSchemaOptions } from "type-graphql";
import { GqlModuleOptions } from "@nestjs/graphql";
import { FactoryProvider, ModuleMetadata } from "@nestjs/common/interfaces";

export type TypeGraphQLFeatureModuleOptions = Pick<
  BuildSchemaOptions,
  "orphanedTypes"
>;

export type TypeGraphQLRootModuleOptions = Omit<
  GqlModuleOptions,
  "schema" | "autoSchemaFile" | "buildSchemaOptions"
> &
  Omit<BuildSchemaOptions, "resolvers" | "orphanedTypes" | "container">;

export interface TypeGraphQLRootModuleAsyncOptions
  extends Pick<ModuleMetadata, "imports">,
    Pick<
      FactoryProvider<
        Promise<TypeGraphQLRootModuleOptions> | TypeGraphQLRootModuleOptions
      >,
      "inject" | "useFactory"
    > {}
