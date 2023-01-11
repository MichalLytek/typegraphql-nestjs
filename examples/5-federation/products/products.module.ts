import { Module } from "@nestjs/common";
import { TypeGraphQLModule } from "../../../src";

import Product from "./product";
import { resolveProductReference } from "./product-reference";
import ProductsResolver from "./resolver";

@Module({
  imports: [
    TypeGraphQLModule.forFeature({
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
export default class ProductsModule { }
