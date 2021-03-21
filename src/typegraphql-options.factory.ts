import { Injectable, Inject } from "@nestjs/common";
import { GqlOptionsFactory, GqlModuleOptions } from "@nestjs/graphql";
import { buildSchema, ClassType, NonEmptyArray } from "type-graphql";

import {
  TYPEGRAPHQL_ROOT_MODULE_OPTIONS,
  TYPEGRAPHQL_FEATURE_MODULE_OPTIONS,
} from "./constants";
import {
  TypeGraphQLRootModuleOptions,
  TypeGraphQLFeatureModuleOptions,
} from "./types";
import OptionsPreparatorService from "./prepare-options.service";

@Injectable()
export default class TypeGraphQLOptionsFactory implements GqlOptionsFactory {
  constructor(
    @Inject(TYPEGRAPHQL_ROOT_MODULE_OPTIONS)
    private readonly rootModuleOptions: TypeGraphQLRootModuleOptions,
    private readonly optionsPreparatorService: OptionsPreparatorService,
  ) {}

  async createGqlOptions(): Promise<GqlModuleOptions> {
    const {
      resolversClasses,
      container,
      orphanedTypes,
    } = this.optionsPreparatorService.prepareOptions<TypeGraphQLFeatureModuleOptions>(
      TYPEGRAPHQL_FEATURE_MODULE_OPTIONS,
    );

    const schema = await buildSchema({
      ...this.rootModuleOptions,
      resolvers: resolversClasses as NonEmptyArray<ClassType>,
      orphanedTypes,
      container,
    });

    return {
      ...this.rootModuleOptions,
      schema,
    };
  }
}
