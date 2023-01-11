import { Injectable, Inject } from "@nestjs/common";
import { GqlOptionsFactory, GqlModuleOptions } from "@nestjs/graphql";
import {
  buildSchema,
  ClassType,
  createResolversMap,
  NonEmptyArray,
} from "type-graphql";
import deepMerge from "lodash.merge";
import { buildSubgraphSchema } from "@apollo/subgraph";
import gql from "graphql-tag";
import { ApolloFederationDriver } from "@nestjs/apollo";

import {
  TYPEGRAPHQL_ROOT_MODULE_OPTIONS,
  TYPEGRAPHQL_FEATURE_MODULE_OPTIONS,
} from "./constants";
import { TypeGraphQLRootModuleOptions } from "./types";
import OptionsPreparatorService from "./prepare-options.service";
import { printSubgraphSchema } from "./helpers";

@Injectable()
export default class TypeGraphQLOptionsFactory implements GqlOptionsFactory {
  constructor(
    @Inject(TYPEGRAPHQL_ROOT_MODULE_OPTIONS)
    private readonly rootModuleOptions: TypeGraphQLRootModuleOptions,
    private readonly optionsPreparatorService: OptionsPreparatorService,
  ) {}

  async createGqlOptions(): Promise<GqlModuleOptions> {
    const { globalMiddlewares, driver, federationVersion } =
      this.rootModuleOptions;
    const { resolversClasses, container, orphanedTypes, referenceResolvers } =
      this.optionsPreparatorService.prepareOptions(
        TYPEGRAPHQL_FEATURE_MODULE_OPTIONS,
        globalMiddlewares,
      );

    const isFederatedModule = driver === ApolloFederationDriver;

    let schema = await buildSchema({
      ...this.rootModuleOptions,
      resolvers: resolversClasses as NonEmptyArray<ClassType>,
      orphanedTypes,
      container,
    });

    if (isFederatedModule) {
      if (!federationVersion) {
        throw new Error(
          "You need to provide `federationVersion` option to `TypeGraphQLModule.forRoot()` when using `ApolloFederationDriver`",
        );
      }

      // build Apollo Subgraph schema
      const federatedSchema = buildSubgraphSchema({
        typeDefs: gql(printSubgraphSchema(schema, federationVersion)),
        // merge schema's resolvers with reference resolvers
        resolvers: deepMerge(
          createResolversMap(schema) as any,
          referenceResolvers,
        ),
      });

      return {
        ...this.rootModuleOptions,
        schema: federatedSchema,
      };
    }

    return {
      ...this.rootModuleOptions,
      schema,
    };
  }
}
