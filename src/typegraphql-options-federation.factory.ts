import { buildFederatedSchema, printSchema } from "@apollo/federation";
import federationDirectives from "@apollo/federation/dist/directives";
import { Inject, Injectable } from "@nestjs/common";
import { GqlModuleOptions, GqlOptionsFactory } from "@nestjs/graphql";
import { GraphQLResolverMap, addResolversToSchema } from "apollo-graphql";
import { specifiedDirectives } from "graphql";
import gql from "graphql-tag";
import {
  buildSchema,
  ClassType,
  createResolversMap,
  NonEmptyArray,
} from "type-graphql";

import OptionsPreparatorService from "./prepare-options.service";
import {
  TYPEGRAPHQL_FEATURE_FEDERATION_MODULE_OPTIONS,
  TYPEGRAPHQL_ROOT_FEDERATION_MODULE_OPTIONS,
} from "./constants";
import {
  TypeGraphQLRootFederationModuleOptions,
  TypeGraphQLFeatureFedarationModuleOptions,
} from "./types";

@Injectable()
export default class TypeGraphQLFederationOptionsFactory
  implements GqlOptionsFactory {
  constructor(
    @Inject(TYPEGRAPHQL_ROOT_FEDERATION_MODULE_OPTIONS)
    private readonly rootModuleOptions: TypeGraphQLRootFederationModuleOptions,
    private readonly optionsPreparatorService: OptionsPreparatorService,
  ) {}

  async createGqlOptions(): Promise<GqlModuleOptions> {
    const {
      resolversClasses,
      container,
      orphanedTypes,
      featureModuleOptionsArray,
    } = this.optionsPreparatorService.prepareOptions<TypeGraphQLFeatureFedarationModuleOptions>(
      TYPEGRAPHQL_FEATURE_FEDERATION_MODULE_OPTIONS,
    );

    const referenceResolversArray = [...featureModuleOptionsArray].filter(
      it => it.referenceResolvers,
    );

    const referenceResolvers =
      referenceResolversArray.length > 0
        ? Object.fromEntries(
            referenceResolversArray.flatMap(it =>
              Object.entries(it.referenceResolvers!),
            ),
          )
        : undefined;

    const baseSchema = await buildSchema({
      ...this.rootModuleOptions,
      directives: [...specifiedDirectives, ...federationDirectives],
      resolvers: resolversClasses as NonEmptyArray<ClassType>,
      orphanedTypes,
      container,
    });

    const schema = buildFederatedSchema({
      typeDefs: gql(printSchema(baseSchema)),
      resolvers: createResolversMap(baseSchema) as GraphQLResolverMap<any>,
    });

    if (referenceResolvers) {
      addResolversToSchema(schema, referenceResolvers);
    }

    return {
      ...this.rootModuleOptions,
      schema,
    };
  }
}
