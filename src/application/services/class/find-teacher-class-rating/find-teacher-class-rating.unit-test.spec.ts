import { QueryFailedError } from "typeorm";
import { RoleEnum } from "../../../../domain/worker/roleEnum";
import { MockRepositoriesForUnitTest } from "../../../../../tests/mocks/mock-repositories/mockRepositories";
import { DomainMocks } from "../../../../infrastructure/__mocks__/mocks";
import { ClassEntity } from "../../../../infrastructure/entities/class/class.entity";
import { WorkerEntity } from "../../../../infrastructure/entities/worker/worker.entity";
import { FindTeacherClassRatingService } from './find-teacher-class-rating';

describe('FindTeacherClassRating', () => {

    afterEach(async () => {
        jest.clearAllMocks();
    });

    it('should return null if teacherId and classId do not exist', async () => {
        const classRepository = MockRepositoriesForUnitTest.mockRepositories();
        const classEntity = null;
        classRepository.findByTeacherIdAndClassId = jest.fn().mockImplementation(() => classEntity);
        const wrongClassId = '607658c13b2c940015a57123';
        const wrondTeacherId = '607658c13b2c940015a57133';
        const findClassRating = new FindTeacherClassRatingService(classRepository);
        const result = await findClassRating.execute(wrondTeacherId, wrongClassId);
        expect(result).toBeNull();
        expect(classRepository.findByTeacherIdAndClassId).toHaveBeenCalledTimes(1);
        expect(classRepository.findByTeacherIdAndClassId).toHaveBeenCalledWith(wrondTeacherId, wrongClassId);
    });

    it('should return class rating if teacherId and classId exist', async () => {
        const classRepository = MockRepositoriesForUnitTest.mockRepositories();
        classRepository.findByTeacherIdAndClassId = jest.fn().mockImplementation(() => classEntity);
        const classModel = DomainMocks.mockSchoolGroup();
        const classEntity = ClassEntity.toClassEntity(classModel);
        const teacher = DomainMocks.mockWorker(RoleEnum.TEACHER);
        const teacherEntity = WorkerEntity.toWorkerEntity(teacher);
        const findClassRating = new FindTeacherClassRatingService(classRepository);
        classEntity.teacher = teacherEntity;

        const result = await findClassRating.execute(classEntity.teacher.id, classEntity.id);
        expect(result).toBeDefined();
        expect(classRepository.findByTeacherIdAndClassId).toHaveBeenCalledTimes(1);
        expect(classRepository.findByTeacherIdAndClassId).toHaveBeenCalledWith(classEntity.teacher.id, classEntity.id);
    });

    it('should throw QueryFailedError error', async () => {
        const classRepository = MockRepositoriesForUnitTest.mockRepositories();
        const classEntity = null;
        classRepository.findByTeacherIdAndClassId = jest.fn()
            .mockImplementation(() => {
                throw new QueryFailedError('error', [], new Error('error'));
            });
        const wrongClassId = '607658c13b2c940015a57123';
        const wrondTeacherId = '607658c13b2c940015a57133';
        const findClassRating = new FindTeacherClassRatingService(classRepository);
        await expect(findClassRating.execute(wrondTeacherId, wrongClassId)).rejects.toThrow(QueryFailedError);
    });
});