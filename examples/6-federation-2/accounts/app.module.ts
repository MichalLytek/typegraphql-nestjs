import { ApolloFederationDriver } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { TypeGraphQLModule } from "../../../src";

import AccountModule from "./account.module";

@Module({
  imports: [
    TypeGraphQLModule.forRoot({
      driver: ApolloFederationDriver,
      federationVersion: 2,
      skipCheck: true,
    }),
    AccountModule,
  ],
})
export default class AppModule {}
