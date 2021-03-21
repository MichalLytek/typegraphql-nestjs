import { DynamicModule, Module } from "@nestjs/common";
import { GraphQLFederationModule } from "@nestjs/graphql";

import OptionsPreparatorService from "./prepare-options.service";
import {
  TYPEGRAPHQL_FEATURE_FEDERATION_MODULE_OPTIONS,
  TYPEGRAPHQL_ROOT_FEDERATION_MODULE_OPTIONS,
} from "./constants";
import TypeGraphQLFederationOptionsFactory from "./typegraphql-options-federation.factory";
import {
  TypeGraphQLFeatureFedarationModuleOptions,
  TypeGraphQLRootFederationModuleOptions,
  TypeGraphQLRootFederationModuleAsyncOptions,
} from "./types";

@Module({})
export class TypeGraphQLFederationModule {
  private static forFeatureIndex = 1;

  static forFeature(
    options: TypeGraphQLFeatureFedarationModuleOptions = {},
  ): DynamicModule {
    const token = `${TYPEGRAPHQL_FEATURE_FEDERATION_MODULE_OPTIONS}_${this
      .forFeatureIndex++}`;
    return {
      module: TypeGraphQLFederationModule,
      providers: [{ provide: token, useValue: options }],
      exports: [token],
    };
  }

  static forRoot(
    options: TypeGraphQLRootFederationModuleOptions = {},
  ): DynamicModule {
    const dynamicGraphQLModule = GraphQLFederationModule.forRootAsync({
      useClass: TypeGraphQLFederationOptionsFactory,
    });
    return {
      ...dynamicGraphQLModule,
      providers: [
        ...dynamicGraphQLModule.providers!,
        OptionsPreparatorService,
        {
          provide: TYPEGRAPHQL_ROOT_FEDERATION_MODULE_OPTIONS,
          useValue: options,
        },
      ],
    };
  }

  static forRootAsync(
    options: TypeGraphQLRootFederationModuleAsyncOptions,
  ): DynamicModule {
    const dynamicGraphQLModule = GraphQLFederationModule.forRootAsync({
      imports: options.imports,
      useClass: TypeGraphQLFederationOptionsFactory,
    });
    return {
      ...dynamicGraphQLModule,
      providers: [
        ...dynamicGraphQLModule.providers!,
        OptionsPreparatorService,
        {
          inject: options.inject,
          provide: TYPEGRAPHQL_ROOT_FEDERATION_MODULE_OPTIONS,
          useFactory: options.useFactory,
        },
      ],
    };
  }
}
