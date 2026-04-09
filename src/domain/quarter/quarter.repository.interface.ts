import { QuarterEntity } from "@/infrastructure/entities/quarter/quarter.entity";
import { RepositoryInterface } from "../@shared/repository/repository.interface";

export interface QuarterRepositoryInterface extends RepositoryInterface<QuarterEntity> {
}