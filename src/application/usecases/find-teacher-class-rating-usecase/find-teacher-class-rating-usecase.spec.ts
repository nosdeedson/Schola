import { Test, TestingModule } from '@nestjs/testing';
import { RoleEnum } from '../../../domain/worker/roleEnum';
import { setEnv } from '../../../infrastructure/__mocks__/env.mock';
import { DomainMocks } from '../../../infrastructure/__mocks__/mocks';
import { DataBaseConnectionModule } from '../../../infrastructure/data-base-connection/data-base-connection.module';
import { AcademicSemesterEntity } from '../../../infrastructure/entities/academic-semester/academic.semester.entity';
import { ClassEntity } from '../../../infrastructure/entities/class/class.entity';
import { RepositoryFactoryService } from '../../../infrastructure/factory/repositiry-factory/repository-factory.service';
import { FindCurrentSemesterService } from '../../services/academic-semester/find-current/find-current-semester.service';
import { FindTeacherClassRatingService } from '../../services/class/find-teacher-class-rating/find-teacher-class-rating';
import { TeacherClassRatingDto } from './find-teacher-class-rating-dto';
import { FindTeacherClassRatingUsecase } from './find-teacher-class-rating-usecase';
import { mockSemester } from '../../../../tests/mocks/domain/semester.mocks';

describe('FindTeacherClassRatingUsecase unit test', () =>{

    let usecase: FindTeacherClassRatingUsecase;
    let module: TestingModule;

    beforeAll(async () => {
        setEnv();
        module = await Test.createTestingModule({
            imports: [DataBaseConnectionModule],
            providers: [
                FindTeacherClassRatingUsecase,
                RepositoryFactoryService
            ]
        }).compile();
        usecase = module.get<FindTeacherClassRatingUsecase>(FindTeacherClassRatingUsecase);
    });

    afterAll(async () => {
        await module.close();
    });

    afterEach(async () => {
        jest.clearAllMocks();
    });

    it('usecase should be defined', async () => {
        expect(usecase).toBeDefined();
    });

    it('should return an TeacherClassRatingDto with all atributes undefined', async () => {
        const findTeacherClassRating = jest.spyOn(FindTeacherClassRatingService.prototype, 'execute')
            .mockResolvedValue(Promise.resolve(null));
        const currentSemester = jest.spyOn(FindCurrentSemesterService.prototype, 'execute')
            .mockResolvedValue(Promise.resolve(null));
        
        const teacherId = '78186565-e234-4eef-8e37-aa7f03f6b68a';
        const classId = '37250f2d-e5ea-4b07-98ae-cf0b703768e6';
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
        const classModel = DomainMocks.mockSchoolGroup();
        const teacher = DomainMocks.mockWorker(RoleEnum.TEACHER);
        classModel.setTeacher(teacher);
        classModel.setStudent(DomainMocks.mockStudent());
        const classEntity = ClassEntity.toClassEntity(classModel);
        const semester =  mockSemester();
        const semesterEntity = AcademicSemesterEntity.toEntity(semester);
        
        const findTeacherClassRating = jest.spyOn(FindTeacherClassRatingService.prototype, 'execute')
            .mockResolvedValue(Promise.resolve(classEntity));
        const currentSemester = jest.spyOn(FindCurrentSemesterService.prototype, 'execute')
            .mockResolvedValue(Promise.resolve(semesterEntity));
        
        const teacherId = teacher.getId();
        const classId = classModel.getId();
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

});