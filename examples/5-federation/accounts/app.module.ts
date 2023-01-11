import { ApolloFederationDriver } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { TypeGraphQLModule } from "../../../src";

import AccountModule from "./account.module";

@Module({
  imports: [
    TypeGraphQLModule.forRoot({
      driver: ApolloFederationDriver,
      federationVersion: 1,
      validate: false,
      skipCheck: true,
    }),
    AccountModule,
  ],
})
export default class AppModule {}
