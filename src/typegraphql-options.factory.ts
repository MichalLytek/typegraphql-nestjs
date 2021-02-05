import { flatten, Inject, Injectable } from "@nestjs/common";
import { ContextIdFactory, ModuleRef, ModulesContainer } from "@nestjs/core";
import { InstanceWrapper } from "@nestjs/core/injector/instance-wrapper";
import { REQUEST_CONTEXT_ID } from "@nestjs/core/router/request/request-constants";
import { GqlModuleOptions, GqlOptionsFactory } from "@nestjs/graphql";
import {
  buildSchema,
  ClassType,
  ContainerType,
  getMetadataStorage,
  NonEmptyArray,
} from "type-graphql";
import {
  TYPEGRAPHQL_FEATURE_MODULE_OPTIONS,
  TYPEGRAPHQL_ROOT_MODULE_OPTIONS,
} from "./constants";
import {
  TypeGraphQLFeatureModuleOptions,
  TypeGraphQLRootModuleOptions,
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
    const providersMetadataMap = new Map<Function, InstanceWrapper<any>>();

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
          providersMetadataMap.set(provider.metatype, provider);
          resolvers.push(provider.metatype as ClassType);
        }
      }
    }

    const orphanedTypes = flatten(
      featureModuleOptionsArray.map(it => it.orphanedTypes),
    );
    const container: ContainerType = {
      get: (cls, { context }) => {
        let contextId = context[REQUEST_CONTEXT_ID];
        if (!contextId) {
          contextId = ContextIdFactory.create();
          context[REQUEST_CONTEXT_ID] = contextId;
        }
        const providerMetadata = providersMetadataMap.get(cls)!;
        if (
          providerMetadata.isDependencyTreeStatic() &&
          !providerMetadata.isTransient
        ) {
          return this.moduleRef.get(cls, { strict: false });
        }
        return this.moduleRef.resolve(cls, contextId, { strict: false });
      },
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
