import {
  buildFederatedSchema as buildApolloFederationSchema,
  printSchema,
} from "@apollo/federation";
import federationDirectives from "@apollo/federation/dist/directives";
import { flatten, Inject, Injectable } from "@nestjs/common";
import { ContextIdFactory, ModuleRef, ModulesContainer } from "@nestjs/core";
import { InstanceWrapper } from "@nestjs/core/injector/instance-wrapper";
import { REQUEST_CONTEXT_ID } from "@nestjs/core/router/request/request-constants";
import { GqlModuleOptions, GqlOptionsFactory } from "@nestjs/graphql";
import { specifiedDirectives } from "graphql";
import gql from "graphql-tag";
import {
  buildSchema,
  ClassType,
  ContainerType,
  createResolversMap,
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
export default class TypeGraphQLOptionsFactorytoryFederation
  implements GqlOptionsFactory {
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
    // eslint-disable-next-line @typescript-eslint/ban-types
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

    const schemaOrig = await buildSchema({
      ...this.rootModuleOptions,
      directives: [...specifiedDirectives, ...federationDirectives, ...[]],
      resolvers: resolvers as NonEmptyArray<ClassType>,
      orphanedTypes,
      container,
    });

    const schema = buildApolloFederationSchema({
      typeDefs: gql(printSchema(schemaOrig)),
      resolvers: createResolversMap(schemaOrig) as any,
    });

    return {
      ...this.rootModuleOptions,
      schema,
    };
  }
}
