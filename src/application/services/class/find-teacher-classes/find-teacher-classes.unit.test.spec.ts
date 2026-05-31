import { FindTeacherClassesService } from "./find.teacher-classes";
import { ClassesOfTeacherDto } from '../../../usecases/teacher-list-classes-usecase/classes-of-teacher-dto';
import { MockRepositoriesForUnitTest } from "../../../../../tests/mocks/mock-repositories/mockRepositories";
import { ClassEntity } from "../../../../infrastructure/entities/class/class.entity";
import { mockClassesOfTeacherDto } from "../../../../../tests/mocks/mock-dtos/mock-dtos";
import { mockClass } from "../../../../../tests/mocks/domain/class.mocks";
import { QueryFailedError } from "typeorm";

describe('FindTeacherClassesService unit test', () => {

    afterEach(async () => {
        jest.clearAllMocks();
    });

    it('should return an empty list by teacher id', async () => {
        const repository = MockRepositoriesForUnitTest.mockRepositories();
        const classes: ClassEntity[] = [];
        repository.findByTeacherId = jest.fn()
            .mockImplementation(() => classes);
        const dto: ClassesOfTeacherDto[] = [];
        const classOfTeacherDto = jest.spyOn(ClassesOfTeacherDto, 'toClassesOfTeacher')
            .mockReturnValue(dto);
        const wantedTeacherId = '8cff5e68-ac09-4c05-b49d-3c70ffdc3511';
        const service = new FindTeacherClassesService(repository);
        const result = await service.execute(wantedTeacherId);
        expect(result).toBeInstanceOf(Array);
        expect(repository.findByTeacherId).toHaveBeenCalledWith('8cff5e68-ac09-4c05-b49d-3c70ffdc3511');
        expect(repository.findByTeacherId).toHaveBeenCalledTimes(1);
        expect(result).toHaveLength(0);
    });

    it('should return one class by teacher id', async () => {
        const repository = MockRepositoriesForUnitTest.mockRepositories();
        const classModel = mockClass();
        const classEntity = ClassEntity.toClassEntity(classModel);
        repository.findByTeacherId = jest.fn()
            .mockImplementation(() => [classEntity]);
        const dto = mockClassesOfTeacherDto()
        const classOfTeacherDto = jest.spyOn(ClassesOfTeacherDto, 'toClassesOfTeacher')
            .mockReturnValue([dto]);
        const wantedTeacherId = classEntity.id;
        const service = new FindTeacherClassesService(repository);
        const result = await service.execute(wantedTeacherId);
        expect(result).toBeInstanceOf(Array);
        expect(result[0]).toEqual(dto)
        expect(repository.findByTeacherId).toHaveBeenCalledWith(wantedTeacherId);
        expect(repository.findByTeacherId).toHaveBeenCalledTimes(1);
        expect(result).toHaveLength(1);
    });

    it('should throw an erro while finding a class', async () => {
        const repository = MockRepositoriesForUnitTest.mockRepositories();
        repository.findByTeacherId = jest.fn()
            .mockImplementation(() => { throw new QueryFailedError(null, null, new Error('failed')) });
        const dto = mockClassesOfTeacherDto()
        const wantedTeacherId = '1234';
        const service = new FindTeacherClassesService(repository);
        await expect(service.execute(wantedTeacherId)).rejects.toThrow(QueryFailedError);
    });


});
