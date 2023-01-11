import { ApolloFederationDriver } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { TypeGraphQLModule } from "../../../src";

import InventoryModule from "./inventory.module";

@Module({
  imports: [
    TypeGraphQLModule.forRoot({
      driver: ApolloFederationDriver,
      federationVersion: 1,
      validate: false,
      skipCheck: true,
    }),
    InventoryModule,
  ],
})
export default class AppModule {}
