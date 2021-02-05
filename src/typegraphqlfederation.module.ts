import { DynamicModule, Module } from "@nestjs/common";
import { GraphQLFederationModule } from "@nestjs/graphql";
import {
  TYPEGRAPHQL_FEATURE_MODULE_OPTIONS,
  TYPEGRAPHQL_ROOT_MODULE_OPTIONS,
} from "./constants";
import TypeGraphQLOptionsFactorytoryFederation from "./typegraphql-options-federation.factory";
import {
  TypeGraphQLFeatureModuleOptions,
  TypeGraphQLRootModuleAsyncOptions,
  TypeGraphQLRootModuleOptions,
} from "./types";

@Module({})
export class TypeGraphQLFederationModule {
  private static forFeatureIndex = 1;

  static forFeature(
    options: TypeGraphQLFeatureModuleOptions = {},
  ): DynamicModule {
    const token = `${TYPEGRAPHQL_FEATURE_MODULE_OPTIONS}_${this
      .forFeatureIndex++}`;
    return {
      module: TypeGraphQLFederationModule,
      providers: [{ provide: token, useValue: options }],
      exports: [token],
    };
  }

  static forRoot(options: TypeGraphQLRootModuleOptions = {}): DynamicModule {
    const dynamicGraphQLModule = GraphQLFederationModule.forRootAsync({
      useClass: TypeGraphQLOptionsFactorytoryFederation,
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

  static forRootAsync(
    options: TypeGraphQLRootModuleAsyncOptions,
  ): DynamicModule {
    const dynamicGraphQLModule = GraphQLFederationModule.forRootAsync({
      imports: options.imports,
      useClass: TypeGraphQLOptionsFactorytoryFederation,
    });
    return {
      ...dynamicGraphQLModule,
      providers: [
        ...dynamicGraphQLModule.providers!,
        {
          inject: options.inject,
          provide: TYPEGRAPHQL_ROOT_MODULE_OPTIONS,
          useFactory: options.useFactory,
        },
      ],
    };
  }
}
