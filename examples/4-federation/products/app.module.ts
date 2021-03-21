import { Module } from "@nestjs/common";
import { TypeGraphQLFederationModule } from "../../../src";

import ProductsModule from "./products.module";

@Module({
  imports: [
    TypeGraphQLFederationModule.forRoot({
      validate: false,
      skipCheck: true,
    }),
    ProductsModule,
  ],
})
export default class AppModule {}
