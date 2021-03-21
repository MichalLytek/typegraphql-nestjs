import { Module } from "@nestjs/common";
import { TypeGraphQLFederationModule } from "../../../src";

import InventoryModule from "./inventory.module";

@Module({
  imports: [
    TypeGraphQLFederationModule.forRoot({
      validate: false,
      skipCheck: true,
    }),
    InventoryModule,
  ],
})
export default class AppModule {}
