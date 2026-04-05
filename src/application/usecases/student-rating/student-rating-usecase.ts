import { FindRatingByStudent } from "@/application/services/rating/find-rating-by-student/find-rating-by-student.service";
import { RatingRepositoryInterface } from "@/domain/rating/rating.repository.interface";
import { StudentRatingUsecaseDtoOut } from "./stdent-rating-usecase-dto-out";
import { Injectable } from "@nestjs/common";
import { RepositoryFactoryService } from "@/infrastructure/factory/repositiry-factory/repository-factory.service";
import { TypeRepository } from "@/infrastructure/factory/repositiry-factory/type-repository";

@Injectable()
export class StudentRantingUsecase {

    private ratingRepository: RatingRepositoryInterface;

    constructor(private repositoryFactory: RepositoryFactoryService) {
        this.ratingRepository = repositoryFactory.createRepository(TypeRepository.RATING);
    }

    async execute(studentId: string): Promise<any> {
        const service = new FindRatingByStudent(this.ratingRepository);
        const result = await service.findRatingByStudent(studentId);
        return StudentRatingUsecaseDtoOut.toDto(result);
    }

}
