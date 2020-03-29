import { Module } from "@nestjs/common";
import { TypeGraphQLModule } from "../../../src";

import AnimalResolver from "./resolver";
import AnimalService from "./service";
import { SuperAnimal } from "./types";

@Module({
  imports: [
    TypeGraphQLModule.forFeature({
      orphanedTypes: [SuperAnimal],
    }),
  ],
  providers: [AnimalResolver, AnimalService],
})
export default class AnimalModule {}
