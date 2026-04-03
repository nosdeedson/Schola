import { QuarterEntity } from "@/infrastructure/entities/quarter/quarter.entity";
import { RepositoryInterface } from "../@shared/repository/repository.interface";

export interface QuarterRepository extends RepositoryInterface<QuarterEntity> {
}