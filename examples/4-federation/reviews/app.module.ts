import { Module } from "@nestjs/common";
import { TypeGraphQLFederationModule } from "../../../src";

import ReviewModule from "./reviews.module";

@Module({
  imports: [
    TypeGraphQLFederationModule.forRoot({
      validate: false,
      skipCheck: true,
    }),
    ReviewModule,
  ],
})
export default class AppModule {}
