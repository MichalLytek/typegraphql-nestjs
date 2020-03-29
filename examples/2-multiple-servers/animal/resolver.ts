import { Injectable } from "@nestjs/common";
import { Resolver, Query, Mutation, Arg } from "type-graphql";

import AnimalService from "./service";
import { Animal } from "./types";

@Injectable()
@Resolver()
export default class AnimalResolver {
  constructor(private readonly animalService: AnimalService) {}

  @Query(returns => [Animal])
  animals() {
    return this.animalService.getAnimals();
  }

  @Mutation(returns => Animal)
  addAnimal(@Arg("input") animal: Animal) {
    this.animalService.addAnimal(animal);
    return animal;
  }
}
