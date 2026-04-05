import { Test, TestingModule } from "@nestjs/testing";
import { StudentRantingUsecase } from "./student-rating-usecase";
import { setEnv } from "@/infrastructure/__mocks__/env.mock";
import { DataBaseConnectionModule } from "@/infrastructure/data-base-connection/data-base-connection.module";
import { RepositoryFactoryService } from "@/infrastructure/factory/repositiry-factory/repository-factory.service";
import { FindRatingByStudent } from "@/application/services/rating/find-rating-by-student/find-rating-by-student.service";
import { mockRating } from "../../../../tests/mocks/domain/rating.mocks";
import { RatingEntity } from "@/infrastructure/entities/rating/rating.entity";
import { StudentRatingUsecaseDtoOut } from "./stdent-rating-usecase-dto-out";

describe('studentRatingUsecase', () => {
    let usecase: StudentRantingUsecase;
    let module: TestingModule;

    beforeAll(async () => {
        setEnv();
        module = await Test.createTestingModule({
            imports: [DataBaseConnectionModule],
            providers: [
                StudentRantingUsecase,
                RepositoryFactoryService
            ]
        }).compile();
        usecase = module.get<StudentRantingUsecase>(StudentRantingUsecase);
    });

    afterEach(async () => {
        jest.clearAllMocks();
    });

    it("should be defined", async () => {
        expect(usecase).toBeDefined();
    });

    it("should find a ranting of a student", async () => {
        const id = "22ac66ab-fae4-4666-82b9-cf0c774f54ed";
        const ratingEntity = RatingEntity.toRatingEntity(mockRating());
        const studentRatingUsecase = jest.spyOn(FindRatingByStudent.prototype, 'findRatingByStudent')
            .mockResolvedValue(ratingEntity);
        const result = await usecase.execute(id);
        expect(result).toBeInstanceOf(StudentRatingUsecaseDtoOut);
        expect(result).toBeDefined();
        expect(studentRatingUsecase).toHaveBeenCalledTimes(1);
        expect(studentRatingUsecase).toHaveBeenCalledWith(id);
    });

    it('should not find a rating of a student', async () => {
        const id = 'a4b5d267-9f5e-4878-b2f2-f5d84746fc6e';
        const studentRatingUsecase = jest.spyOn(FindRatingByStudent.prototype, 'findRatingByStudent')
            .mockResolvedValue(null);
        const result = await usecase.execute(id);
        expect(studentRatingUsecase).toHaveBeenCalledTimes(1);
        expect(studentRatingUsecase).toHaveBeenCalledWith(id);
        expect(result).toBeNull();
    });
});
