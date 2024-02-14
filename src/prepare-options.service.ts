import { Injectable, flatten } from "@nestjs/common";
import { ModulesContainer, ModuleRef, ContextIdFactory } from "@nestjs/core";
import { REQUEST_CONTEXT_ID } from "@nestjs/core/router/request/request-constants";
import { InstanceWrapper } from "@nestjs/core/injector/instance-wrapper";
import { ClassType, ContainerType, getMetadataStorage } from "type-graphql";

import { TypeGraphQLFeatureModuleOptions } from "./types";

@Injectable()
export default class OptionsPreparatorService {
  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly modulesContainer: ModulesContainer,
  ) {}

  prepareOptions(featureModuleToken: string) {
    const globalResolvers = getMetadataStorage().resolverClasses.map(
      metadata => metadata.target,
    );
    const featureModuleOptionsArray: TypeGraphQLFeatureModuleOptions[] = [];
    const resolversClasses: ClassType[] = [];
    const providersMetadataMap = new Map<Function, InstanceWrapper<any>>();

    for (const module of this.modulesContainer.values()) {
      for (const provider of module.providers.values()) {
        if (
          typeof provider.name === "string" &&
          provider.name.includes(featureModuleToken)
        ) {
          featureModuleOptionsArray.push(
            provider.instance as TypeGraphQLFeatureModuleOptions,
          );
        }
        if (globalResolvers.includes(provider.metatype)) {
          resolversClasses.push(provider.metatype as ClassType);
        }
        providersMetadataMap.set(provider.metatype, provider);
      }
    }

    const orphanedTypes = flatten(
      featureModuleOptionsArray.map(it => it.orphanedTypes),
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

    return {
      resolversClasses,
      orphanedTypes,
      container,
      featureModuleOptionsArray,
      referenceResolvers,
    };
  }
}
