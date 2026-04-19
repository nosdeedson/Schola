import { SaveRatingUsecase } from "./save-rating-usecase"
import { saveRatingUsecaseDtoMock } from "../../../../tests/mocks/usecases/save-rating-usecase.dto.mocks";
import { FindCurrentSemesterService } from "@/application/services/academic-semester/find-current/find-current-semester.service";
import { FindStudentService } from "@/application/services/student/find/find.student.service";
import { CreateRatingService } from "@/application/services/rating/create/create.rating.service";
import { BadRequestException } from "@nestjs/common";
import { TrataErros } from "@/infrastructure/utils/trata-erros/trata-erros";
import { AcademicSemesterEntity } from "@/infrastructure/entities/academic-semester/academic.semester.entity";
import { mockSemester } from "../../../../tests/mocks/domain/semester.mocks";
import { mockStudent } from "../../../../tests/mocks/domain/student.mocks";
import { StudentEntity } from "@/infrastructure/entities/student/student.entity";
import { MockRepositoriesForUnitTest } from "@/infrastructure/__mocks__/mockRepositories";

describe('SaveRatingUsecase', () => {

    afterEach(async () => {
        jest.clearAllMocks();
    });

    it('should throw a systemError execption if student not found', async () => {
        const dto = saveRatingUsecaseDtoMock();
        const semesterEntity = AcademicSemesterEntity.toEntity(mockSemester({ currentSemester: true }));
        const semesterService = jest.spyOn(FindCurrentSemesterService.prototype, 'execute')
            .mockImplementation(() => Promise.resolve(semesterEntity));
        const findStudentService = jest.spyOn(FindStudentService.prototype, 'execute')
            .mockImplementation(() => Promise.resolve(null));
        const saveRating = jest.spyOn(CreateRatingService.prototype, 'execute')
            .mockImplementation(() => Promise.resolve(void 0));
        const tratarErros = jest.spyOn(TrataErros, 'tratarErrorsBadRequest')
            .mockImplementation(() => { throw new BadRequestException("student not found.") });
        const ratingRepository = MockRepositoriesForUnitTest.mockRepositories();
        const semesterRepository = MockRepositoriesForUnitTest.mockRepositories();
        const studentRepository = MockRepositoriesForUnitTest.mockRepositories();
        const usecase = new SaveRatingUsecase(ratingRepository, semesterRepository, studentRepository);
        await expect(usecase.execute(dto)).rejects.toMatchObject(
            new BadRequestException("student not found.")
        );
        expect(semesterService).toHaveBeenCalledTimes(1);
        expect(findStudentService).toHaveBeenCalledTimes(1);
        expect(findStudentService).toHaveBeenCalledWith(dto.studentId);
        expect(saveRating).toHaveBeenCalledTimes(0);
        expect(tratarErros).toHaveBeenCalledTimes(1);
    });

    it('should save a rating', async () => {
        const dto = saveRatingUsecaseDtoMock();
        const semesterEntity = AcademicSemesterEntity.toEntity(mockSemester({ currentSemester: true }));
        const semesterService = jest.spyOn(FindCurrentSemesterService.prototype, 'execute')
            .mockImplementation(() => Promise.resolve(semesterEntity));
        const findStudentService = jest.spyOn(FindStudentService.prototype, 'execute')
            .mockImplementation(() => Promise.resolve(StudentEntity.toStudentEntity(mockStudent())));
        const saveRating = jest.spyOn(CreateRatingService.prototype, 'execute')
            .mockImplementation(() => Promise.resolve(void 0));
        const ratingRepository = MockRepositoriesForUnitTest.mockRepositories();
        const semesterRepository = MockRepositoriesForUnitTest.mockRepositories();
        const studentRepository = MockRepositoriesForUnitTest.mockRepositories();
        const usecase = new SaveRatingUsecase(ratingRepository, semesterRepository, studentRepository);
        expect(await usecase.execute(dto)).toBe(void 0);
        expect(semesterService).toHaveBeenCalledTimes(1);
        expect(findStudentService).toHaveBeenCalledTimes(1);
        expect(findStudentService).toHaveBeenCalledWith(dto.studentId);
        expect(saveRating).toHaveBeenCalledTimes(1);
    });
})
