import { ParentStudentEntity } from "@/infrastructure/entities/parent-student/parent.student.entity";
import { PeronRepositoryInterface } from "../@shared/repository/person.repository.interface";

export interface ParentStudentRepositoryInterface extends PeronRepositoryInterface<ParentStudentEntity>{}