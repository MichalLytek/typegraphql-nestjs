import { Module, DynamicModule } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";

import {
  TYPEGRAPHQL_ROOT_MODULE_OPTIONS,
  TYPEGRAPHQL_FEATURE_MODULE_OPTIONS,
} from "./constants";
import TypeGraphQLOptionsFactory from "./typegraphql-options.factory";
import {
  TypeGraphQLFeatureModuleOptions,
  TypeGraphQLRootModuleOptions,
} from "./types";

@Module({})
export class TypeGraphQLModule {
  private static forFeatureIndex = 1;

  static forFeature(
    options: TypeGraphQLFeatureModuleOptions = {},
  ): DynamicModule {
    const token = `${TYPEGRAPHQL_FEATURE_MODULE_OPTIONS}_${this
      .forFeatureIndex++}`;
    return {
      module: TypeGraphQLModule,
      providers: [{ provide: token, useValue: options }],
      exports: [token],
    };
  }

  static forRoot(options: TypeGraphQLRootModuleOptions = {}): DynamicModule {
    const dynamicGraphQLModule = GraphQLModule.forRootAsync({
      useClass: TypeGraphQLOptionsFactory,
    });
    return {
      ...dynamicGraphQLModule,
      providers: [
        ...dynamicGraphQLModule.providers!,
        {
          provide: TYPEGRAPHQL_ROOT_MODULE_OPTIONS,
          useValue: options,
        },
      ],
    };
  }
}
