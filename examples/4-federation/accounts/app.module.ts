import { Module } from "@nestjs/common";
import { TypeGraphQLFederationModule } from "../../../src";

import AccountModule from "./account.module";

@Module({
  imports: [
    TypeGraphQLFederationModule.forRoot({
      validate: false,
      skipCheck: true,
    }),
    AccountModule,
  ],
})
export default class AppModule {}
