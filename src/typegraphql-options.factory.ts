import { Injectable, Inject, flatten } from "@nestjs/common";
import { GqlOptionsFactory, GqlModuleOptions } from "@nestjs/graphql";
import { ModulesContainer, ModuleRef } from "@nestjs/core";
import {
  buildSchema,
  ClassType,
  ContainerType,
  getMetadataStorage,
  NonEmptyArray,
} from "type-graphql";

import {
  TYPEGRAPHQL_ROOT_MODULE_OPTIONS,
  TYPEGRAPHQL_FEATURE_MODULE_OPTIONS,
} from "./constants";
import {
  TypeGraphQLRootModuleOptions,
  TypeGraphQLFeatureModuleOptions,
} from "./types";

@Injectable()
export default class TypeGraphQLOptionsFactory implements GqlOptionsFactory {
  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly modulesContainer: ModulesContainer,
    @Inject(TYPEGRAPHQL_ROOT_MODULE_OPTIONS)
    private readonly rootModuleOptions: TypeGraphQLRootModuleOptions,
  ) {}

  async createGqlOptions(): Promise<GqlModuleOptions> {
    const globalResolvers = getMetadataStorage().resolverClasses.map(
      metadata => metadata.target,
    );

    const featureModuleOptionsArray: TypeGraphQLFeatureModuleOptions[] = [];
    const resolvers: ClassType[] = [];

    for (const module of this.modulesContainer.values()) {
      for (const provider of module.providers.values()) {
        if (
          typeof provider.name === "string" &&
          provider.name.includes(TYPEGRAPHQL_FEATURE_MODULE_OPTIONS)
        ) {
          featureModuleOptionsArray.push(
            provider.instance as TypeGraphQLFeatureModuleOptions,
          );
        }
        if (globalResolvers.includes(provider.metatype)) {
          resolvers.push(provider.metatype as ClassType);
        }
      }
    }

    const orphanedTypes = flatten(
      featureModuleOptionsArray.map(it => it.orphanedTypes),
    );
    const container: ContainerType = {
      get: cls => this.moduleRef.get(cls, { strict: false }),
    };

    const schema = await buildSchema({
      ...this.rootModuleOptions,
      resolvers: resolvers as NonEmptyArray<ClassType>,
      orphanedTypes,
      container,
    });

    return {
      ...this.rootModuleOptions,
      schema,
    };
  }
}
