import { ApolloFederationDriver } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { TypeGraphQLModule } from "../../../src";

import ProductsModule from "./products.module";

@Module({
  imports: [
    TypeGraphQLModule.forRoot({
      driver: ApolloFederationDriver,
      federationVersion: 2,
      skipCheck: true,
    }),
    ProductsModule,
  ],
})
export default class AppModule {}
