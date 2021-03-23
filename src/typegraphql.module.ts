import { Module, DynamicModule } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";

import {
  TYPEGRAPHQL_ROOT_MODULE_OPTIONS,
  TYPEGRAPHQL_FEATURE_MODULE_OPTIONS,
} from "./constants";
import OptionsPreparatorService from "./prepare-options.service";
import TypeGraphQLOptionsFactory from "./typegraphql-options.factory";
import {
  TypeGraphQLFeatureModuleOptions,
  TypeGraphQLRootModuleOptions,
  TypeGraphQLRootModuleAsyncOptions,
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
        OptionsPreparatorService,
        {
          provide: TYPEGRAPHQL_ROOT_MODULE_OPTIONS,
          useValue: options,
        },
      ],
    };
  }

  static forRootAsync(
    options: TypeGraphQLRootModuleAsyncOptions,
  ): DynamicModule {
    const dynamicGraphQLModule = GraphQLModule.forRootAsync({
      imports: options.imports,
      useClass: TypeGraphQLOptionsFactory,
    });
    return {
      ...dynamicGraphQLModule,
      providers: [
        ...dynamicGraphQLModule.providers!,
        OptionsPreparatorService,
        {
          inject: options.inject,
          provide: TYPEGRAPHQL_ROOT_MODULE_OPTIONS,
          useFactory: options.useFactory,
        },
      ],
    };
  }
}
