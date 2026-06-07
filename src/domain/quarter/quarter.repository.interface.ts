import { QuarterEntity } from "@/infrastructure/entities/quarter/quarter.entity";
import { RepositoryInterface } from "../@shared/repository/repository.interface";
import { Quarter } from "./quarter";

export interface QuarterRepositoryInterface extends RepositoryInterface<QuarterEntity, Quarter> {
}
