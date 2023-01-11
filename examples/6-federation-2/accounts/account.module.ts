import { Module } from "@nestjs/common";
import { TypeGraphQLModule } from "../../../src";

import AccountsResolver from "./resolver";
import User from "./user";
import { resolveUserReference } from "./user-reference";

@Module({
  imports: [
    TypeGraphQLModule.forFeature({
      orphanedTypes: [User],
      referenceResolvers: {
        User: {
          __resolveReference: resolveUserReference,
        },
      },
    }),
  ],
  providers: [AccountsResolver],
})
export default class AccountModule { }
