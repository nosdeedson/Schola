import { TypeRepository } from "@/infrastructure/factory/repositiry-factory/type-repository";

export interface RepositoryFactoryInterface {
    createRepository(whichRepository: TypeRepository): any;
}