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
    const { federationVersion } = this.rootModuleOptions;
    const { resolversClasses, container, orphanedTypes, referenceResolvers } =
      this.optionsPreparatorService.prepareOptions(
        TYPEGRAPHQL_FEATURE_MODULE_OPTIONS,
      );

    const isFederatedModule =
      federationVersion === 1 || federationVersion === 2;

    let schema = await buildSchema({
      ...this.rootModuleOptions,
      resolvers: resolversClasses as NonEmptyArray<ClassType>,
      orphanedTypes,
      container,
    });

    if (isFederatedModule) {
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
