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
import { MockRepositoriesForUnitTest } from "../../../../tests/mocks/mock-repositories/mockRepositories";
import { CreateCommentService } from "@/application/services/comment/create/create.comment.service";
import { RatingEntity } from "@/infrastructure/entities/rating/rating.entity";
import { mockRating } from "../../../../tests/mocks/domain/rating.mocks";
import { FindWorkerService } from "@/application/services/worker/find/find.worker.service";
import { mockOutputFindWorkerDto } from "../../../../tests/mocks/mock-dtos/mock-dtos";
import { SystemError } from "@/application/services/@shared/system-error";

describe('SaveRatingUsecase', () => {

    afterEach(async () => {
        jest.clearAllMocks();
    });

    it('should throw a systemError execption if student not found', async () => {
        const dto = saveRatingUsecaseDtoMock();
        const teacher = mockOutputFindWorkerDto();
        const semesterEntity = AcademicSemesterEntity.toEntity(mockSemester({ currentSemester: true }));

        const semesterService = jest.spyOn(FindCurrentSemesterService.prototype, 'execute')
            .mockImplementation(() => Promise.resolve(semesterEntity));

        const findStudentService = jest.spyOn(FindStudentService.prototype, 'execute')
            .mockImplementation(() =>  { throw new SystemError([{ context: 'student', message: 'student not found' }])});

        const saveRating = jest.spyOn(CreateRatingService.prototype, 'execute')
            .mockImplementation(() => Promise.resolve(void 0));

        const commentService = jest.spyOn(CreateCommentService.prototype, 'execute')
            .mockImplementation(() => Promise.resolve(void 0));

        const tratarErros = jest.spyOn(TrataErros, 'tratarErrorsBadRequest')
            .mockImplementation(() => { throw new BadRequestException("student not found.") });

        const workerService = jest.spyOn(FindWorkerService.prototype, 'execute')
            .mockImplementation(() => Promise.resolve(teacher));

        const ratingRepository = MockRepositoriesForUnitTest.mockRepositories();
        const semesterRepository = MockRepositoriesForUnitTest.mockRepositories();
        const studentRepository = MockRepositoriesForUnitTest.mockRepositories();
        const commentRepository = MockRepositoriesForUnitTest.mockRepositories();
        const workerRepo = MockRepositoriesForUnitTest.mockRepositories();

        const usecase = new SaveRatingUsecase(ratingRepository, semesterRepository, studentRepository, commentRepository, workerRepo);
        await expect(usecase.execute(dto)).rejects.toMatchObject(
            new BadRequestException("student not found.")
        );
        expect(semesterService).toHaveBeenCalledTimes(1);
        expect(findStudentService).toHaveBeenCalledTimes(1);
        expect(findStudentService).toHaveBeenCalledWith(dto.studentBeingEvaluatedId);
        expect(saveRating).toHaveBeenCalledTimes(0);
        expect(commentService).toHaveBeenCalledTimes(0);
        expect(tratarErros).toHaveBeenCalledTimes(1);
        expect(workerService).toHaveBeenCalledTimes(0);
    });


    it('should throw a systemError exception if worker not found', async () => {
        const dto = saveRatingUsecaseDtoMock();
        const semesterEntity = AcademicSemesterEntity.toEntity(mockSemester({ currentSemester: true }));

        const semesterService = jest.spyOn(FindCurrentSemesterService.prototype, 'execute')
            .mockImplementation(() => Promise.resolve(semesterEntity));

        const findStudentService = jest.spyOn(FindStudentService.prototype, 'execute')
            .mockImplementation(() => Promise.resolve(StudentEntity.toStudentEntity(mockStudent())));

        const saveRating = jest.spyOn(CreateRatingService.prototype, 'execute')
            .mockImplementation(() => Promise.resolve(void 0));

        const commentService = jest.spyOn(CreateCommentService.prototype, 'execute')
            .mockImplementation(() => Promise.resolve(void 0));

        const tratarErros = jest.spyOn(TrataErros, 'tratarErrorsBadRequest')
            .mockImplementation(() => { throw new BadRequestException("teacher not found.") });

        const workerService = jest.spyOn(FindWorkerService.prototype, 'execute')
            .mockImplementation(() => {throw new SystemError([{ context: "find user", message: "Failed to find the user" }])});

        const ratingRepository = MockRepositoriesForUnitTest.mockRepositories();
        const semesterRepository = MockRepositoriesForUnitTest.mockRepositories();
        const studentRepository = MockRepositoriesForUnitTest.mockRepositories();
        const commentRepository = MockRepositoriesForUnitTest.mockRepositories();
        const workerRepo = MockRepositoriesForUnitTest.mockRepositories();

        const usecase = new SaveRatingUsecase(ratingRepository, semesterRepository, studentRepository, commentRepository, workerRepo);
        await expect(usecase.execute(dto)).rejects.toMatchObject(
            new BadRequestException("teacher not found.")
        );
        expect(semesterService).toHaveBeenCalledTimes(1);
        expect(findStudentService).toHaveBeenCalledTimes(1);
        expect(findStudentService).toHaveBeenCalledWith(dto.studentBeingEvaluatedId);
        expect(saveRating).toHaveBeenCalledTimes(0);
        expect(commentService).toHaveBeenCalledTimes(0);
        expect(tratarErros).toHaveBeenCalledTimes(1);
        expect(workerService).toHaveBeenCalledTimes(1);
        expect(workerService).toHaveBeenCalledWith(dto.teacherId);
    });

    it('should throw a badRequest if current semester is not found', async () => {
        const dto = saveRatingUsecaseDtoMock();
        const teacher = mockOutputFindWorkerDto();

        const semesterService = jest.spyOn(FindCurrentSemesterService.prototype, 'execute')
            .mockImplementation(() => {throw new SystemError([{ context: 'semester', message: 'semester not found' }])});

        const findStudentService = jest.spyOn(FindStudentService.prototype, 'execute')
            .mockImplementation(() => Promise.resolve(StudentEntity.toStudentEntity(mockStudent())));

        const saveRating = jest.spyOn(CreateRatingService.prototype, 'execute')
            .mockImplementation(() => Promise.resolve(void 0));

        const commentService = jest.spyOn(CreateCommentService.prototype, 'execute')
            .mockImplementation(() => Promise.resolve(void 0));

        const tratarErros = jest.spyOn(TrataErros, 'tratarErrorsBadRequest')
            .mockImplementation(() => { throw new BadRequestException("Current semester was not found") });

        const workerService = jest.spyOn(FindWorkerService.prototype, 'execute')
            .mockImplementation(() => Promise.resolve(teacher));

        const ratingRepository = MockRepositoriesForUnitTest.mockRepositories();
        const semesterRepository = MockRepositoriesForUnitTest.mockRepositories();
        const studentRepository = MockRepositoriesForUnitTest.mockRepositories();
        const commentRepository = MockRepositoriesForUnitTest.mockRepositories();
        const workerRepo = MockRepositoriesForUnitTest.mockRepositories();

        const usecase = new SaveRatingUsecase(ratingRepository, semesterRepository, studentRepository, commentRepository, workerRepo);
        await expect(usecase.execute(dto)).rejects.toMatchObject(
            new BadRequestException("Current semester was not found")
        );
        expect(semesterService).toHaveBeenCalledTimes(1);
        expect(findStudentService).toHaveBeenCalledTimes(0);
        expect(saveRating).toHaveBeenCalledTimes(0);
        expect(commentService).toHaveBeenCalledTimes(0);
        expect(tratarErros).toHaveBeenCalledTimes(1);
        expect(workerService).toHaveBeenCalledTimes(0);
    });


    it('should save a rating', async () => {
        const dto = saveRatingUsecaseDtoMock();
        const teacher = mockOutputFindWorkerDto();
        const ratingEntity = RatingEntity.toRatingEntity(mockRating());
        const semesterEntity = AcademicSemesterEntity.toEntity(mockSemester({ currentSemester: true }));
        const semesterService = jest.spyOn(FindCurrentSemesterService.prototype, 'execute')
            .mockImplementation(() => Promise.resolve(semesterEntity));
        const findStudentService = jest.spyOn(FindStudentService.prototype, 'execute')
            .mockImplementation(() => Promise.resolve(StudentEntity.toStudentEntity(mockStudent())));
        const saveRating = jest.spyOn(CreateRatingService.prototype, 'execute')
            .mockImplementation(() => Promise.resolve(ratingEntity));
        const commentService = jest.spyOn(CreateCommentService.prototype, 'execute')
            .mockImplementation(() => Promise.resolve(void 0));
        const workerService = jest.spyOn(FindWorkerService.prototype, 'execute')
            .mockImplementation(() => Promise.resolve(teacher));

        const ratingRepository = MockRepositoriesForUnitTest.mockRepositories();
        const semesterRepository = MockRepositoriesForUnitTest.mockRepositories();
        const studentRepository = MockRepositoriesForUnitTest.mockRepositories();
        const commentRepository = MockRepositoriesForUnitTest.mockRepositories();
        const workerRepo = MockRepositoriesForUnitTest.mockRepositories();

        const usecase = new SaveRatingUsecase(ratingRepository, semesterRepository, studentRepository, commentRepository, workerRepo);
        expect(await usecase.execute(dto)).toBe(void 0);
        expect(semesterService).toHaveBeenCalledTimes(1);
        expect(findStudentService).toHaveBeenCalledTimes(1);
        expect(findStudentService).toHaveBeenCalledWith(dto.studentBeingEvaluatedId);
        expect(saveRating).toHaveBeenCalledTimes(1);
        expect(commentService).toHaveBeenCalledTimes(1);
        expect(workerService).toHaveBeenCalledTimes(1);
        expect(workerService).toHaveBeenCalledWith(dto.teacherId);
    });
})
