import { PersonEntity } from "@/infrastructure/entities/@shared/person.entity";
import { RepositoryInterface } from "./repository.interface";
import { Person } from "../person";

export interface PeronRepositoryInterface<T> extends RepositoryInterface<PersonEntity, Person> { }
