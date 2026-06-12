import { Test, TestingModule } from '@nestjs/testing';
import { setEnv } from '../../../../tests/mocks/env/env.mock';
import { DataBaseConnectionModule } from '../../../infrastructure/data-base-connection/data-base-connection.module';
import { AcademicSemesterEntity } from '../../../infrastructure/entities/academic-semester/academic.semester.entity';
import { ClassEntity } from '../../../infrastructure/entities/class/class.entity';
import { RepositoryFactoryService } from '../../../infrastructure/factory/repositiry-factory/repository-factory.service';
import { FindCurrentSemesterService } from '../../services/academic-semester/find-current/find-current-semester.service';
import { FindTeacherClassRatingService } from '../../services/class/find-teacher-class-rating/find-teacher-class-rating';
import { TeacherClassRatingDto } from './find-teacher-class-rating-dto';
import { FindTeacherClassRatingUsecase } from './find-teacher-class-rating-usecase';
import { mockSemester } from '../../../../tests/mocks/domain/semester.mocks';
import { mockClass } from '../../../../tests/mocks/domain/class.mocks';
import { mockWorker } from '../../../../tests/mocks/domain/worker.mock';
import { mockStudent } from '../../../../tests/mocks/domain/student.mocks';
import { SystemError } from '@/application/services/@shared/system-error';
import { ExceptionHandler } from '@/infrastructure/utils/exception-handler/exception-handler';
import { BadRequestException } from '@nestjs/common';
import { MockRepositoriesForUnitTest } from '../../../../tests/mocks/mock-repositories/mockRepositories';
import { AcademicSemesterMapper } from '@/infrastructure/mappers/semester/academic-semester-mapper';

describe('FindTeacherClassRatingUsecase unit test', () => {

    afterEach(async () => {
        jest.clearAllMocks();
    });

    it('should return an TeacherClassRatingDto with all atributes undefined', async () => {
        const classRepository = MockRepositoriesForUnitTest.mockRepositories();
        const semesterRepository = MockRepositoriesForUnitTest.mockRepositories();
        const findTeacherClassRating = jest.spyOn(FindTeacherClassRatingService.prototype, 'execute')
            .mockResolvedValue(Promise.resolve(null));
        const currentSemester = jest.spyOn(FindCurrentSemesterService.prototype, 'execute')
            .mockResolvedValue(Promise.resolve(null));

        const teacherId = '78186565-e234-4eef-8e37-aa7f03f6b68a';
        const classId = '37250f2d-e5ea-4b07-98ae-cf0b703768e6';
        const usecase = new FindTeacherClassRatingUsecase(classRepository, semesterRepository);
        const result = await usecase.execute(teacherId, classId);
        expect(result).toBeInstanceOf(TeacherClassRatingDto);
        expect(findTeacherClassRating).toHaveBeenCalledTimes(1);
        expect(findTeacherClassRating).toHaveBeenCalledWith(teacherId, classId);
        expect(currentSemester).toHaveBeenCalledTimes(1);
        expect(result.teacherId).toBeUndefined();
        expect(result.classId).toBeUndefined();
        expect(result.semester).toBeUndefined();
        expect(result.students).toHaveLength(0);
    });

    it('should return an TeacherClassRatingDto of a class', async () => {
        const classRepository = MockRepositoriesForUnitTest.mockRepositories();
        const semesterRepository = MockRepositoriesForUnitTest.mockRepositories();
        const classModel = mockClass();
        const teacher = mockWorker();
        classModel.setTeacher(teacher);
        classModel.setStudent(mockStudent());
        const classEntity = ClassMapper.fromDomain(classModel);
        const semester = mockSemester();
        const semesterEntity = AcademicSemesterMapper.fromDomain(semester);

        const findTeacherClassRating = jest.spyOn(FindTeacherClassRatingService.prototype, 'execute')
            .mockResolvedValue(Promise.resolve(classEntity));
        const currentSemester = jest.spyOn(FindCurrentSemesterService.prototype, 'execute')
            .mockResolvedValue(Promise.resolve(semesterEntity));

        const teacherId = teacher.getId();
        const classId = classModel.getId();
        const usecase = new FindTeacherClassRatingUsecase(classRepository, semesterRepository);
        const result = await usecase.execute(teacherId, classId);
        expect(result).toBeInstanceOf(TeacherClassRatingDto);
        expect(findTeacherClassRating).toHaveBeenCalledTimes(1);
        expect(findTeacherClassRating).toHaveBeenCalledWith(teacherId, classId);
        expect(currentSemester).toHaveBeenCalledTimes(1);
        expect(result.teacherId).toBe(teacherId);
        expect(result.classId).toBe(classId);
        expect(result.semester.current).toBeTruthy();
        expect(result.students).toHaveLength(1);
    });

    it('should throw an error while find a class to rate', async () => {
        const findTeacherClassRatingService = jest.spyOn(FindTeacherClassRatingService.prototype, 'execute')
            .mockImplementation(() => { throw new SystemError([{ context: "class", message: "class not found." }], 404) });
        const exceptionHandler = jest.spyOn(ExceptionHandler, 'exceptionHandler')
            .mockImplementation(() => { throw new BadRequestException("class not found") });
        const semesterSErvice = jest.spyOn(FindCurrentSemesterService.prototype, 'execute')
            .mockImplementation(() => Promise.resolve(AcademicSemesterMapper.fromDomain(mockSemester())));

        const classRepository = MockRepositoriesForUnitTest.mockRepositories();
        const semesterRepository = MockRepositoriesForUnitTest.mockRepositories();
        const usecase = new FindTeacherClassRatingUsecase(classRepository, semesterRepository);
        await expect(usecase.execute("123", '123')).rejects.toThrow(BadRequestException);
        expect(findTeacherClassRatingService).toHaveBeenCalledTimes(1);
        expect(semesterSErvice).toHaveBeenCalledTimes(0);
        expect(exceptionHandler).toHaveBeenCalledTimes(1);
    });

    it('should throw an error while find the semester', async () => {
        const findTeacherClassRatingService = jest.spyOn(FindTeacherClassRatingService.prototype, 'execute')
            .mockImplementation(() => Promise.resolve(ClassMapper.fromDomain(mockClass())));
        const exceptionHandler = jest.spyOn(ExceptionHandler, 'exceptionHandler')
            .mockImplementation(() => { throw new BadRequestException("semester not found") });

        const semesterService = jest.spyOn(FindCurrentSemesterService.prototype, 'execute')
            .mockImplementation(() => { throw new SystemError([{ context: 'semester', message: 'semester not found' }], 404) })

        const classRepository = MockRepositoriesForUnitTest.mockRepositories();

        const semesterRepository = MockRepositoriesForUnitTest.mockRepositories();
        const usecase = new FindTeacherClassRatingUsecase(classRepository, semesterRepository);
        await expect(usecase.execute("123", '123')).rejects.toThrow(BadRequestException);
        expect(findTeacherClassRatingService).toHaveBeenCalledTimes(1);
        expect(exceptionHandler).toHaveBeenCalledTimes(1);
        expect(semesterService).toHaveBeenCalledTimes(1);
    });

});
