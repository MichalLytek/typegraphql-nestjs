import { Module } from "@nestjs/common";
import { TypeGraphQLFederationModule } from "../../../src";

import Product from "./product";
import { resolveProductReference } from "./product-reference";
import ProductsResolver from "./resolver";

@Module({
  imports: [
    TypeGraphQLFederationModule.forFeature({
      orphanedTypes: [Product],
      referenceResolvers: {
        Product: {
          __resolveReference: resolveProductReference,
        },
      },
    }),
  ],
  providers: [ProductsResolver],
})
export default class ProductsModule {}
