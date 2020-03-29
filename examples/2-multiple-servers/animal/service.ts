import { Injectable } from "@nestjs/common";

import { Animal } from "./types";

@Injectable()
export default class AnimalService {
  private readonly animals: Animal[] = [];

  getAnimals() {
    return this.animals;
  }

  addAnimal(animal: Animal) {
    this.animals.push(animal);
  }
}
