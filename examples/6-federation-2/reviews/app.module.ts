import { ApolloFederationDriver } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { TypeGraphQLModule } from "../../../src";

import ReviewModule from "./reviews.module";

@Module({
  imports: [
    TypeGraphQLModule.forRoot({
      driver: ApolloFederationDriver,
      federationVersion: 2,
      skipCheck: true,
    }),
    ReviewModule,
  ],
})
export default class AppModule {}
