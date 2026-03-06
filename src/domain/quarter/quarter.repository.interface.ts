import { QuarterEntity } from "src/infrastructure/entities/quarter/quarter.entity";
import { RepositoryInterface } from "../@shared/repository/repository.interface";

export interface QuarterRepository extends RepositoryInterface<QuarterEntity> {

}