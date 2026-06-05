import { Test, TestingModule } from '@nestjs/testing';
import { TeacherListClassesUsecase } from './teacher-list-classes-usecase';
import { setEnv } from '../../../../tests/mocks/env/env.mock';
import { DataBaseConnectionModule } from '../../../infrastructure/data-base-connection/data-base-connection.module';
import { RepositoryFactoryService } from '../../../infrastructure/factory/repositiry-factory/repository-factory.service';
import { FindTeacherClassesService } from '../../services/class/find-teacher-classes/find.teacher-classes';
import { mockClassesOfTeacherDto } from '../../../../tests/mocks/mock-dtos/mock-dtos';
import { MockRepositoriesForUnitTest } from '../../../../tests/mocks/mock-repositories/mockRepositories';


describe('teacher list classes usecase', () => {

    let usecase: TeacherListClassesUsecase;

    afterEach(async () => {
        jest.clearAllMocks();
    });

    it('should be return a empty list', async () => {
        const classRepository = MockRepositoriesForUnitTest.mockRepositories();
        const service = jest.spyOn(FindTeacherClassesService.prototype, 'execute')
            .mockResolvedValue(Promise.resolve([]));
        const teacherId = '404f7bfd-9c83-4d6e-8de2-9b16bd917461';
        const usecase = new TeacherListClassesUsecase(classRepository);
        const result = await usecase.execute(teacherId);
        expect(result).toBeInstanceOf(Array);
        expect(result).toHaveLength(0);
        expect(service).toHaveBeenCalledWith(teacherId);
    });

    it('should be return a list with one item', async () => {
        const classRepository = MockRepositoriesForUnitTest.mockRepositories();
        const list = mockClassesOfTeacherDto();
        const service = jest.spyOn(FindTeacherClassesService.prototype, 'execute')
            .mockResolvedValue(Promise.resolve([list]));
        const teacherId = '404f7bfd-9c83-4d6e-8de2-9b16bd917461';
        const usecase = new TeacherListClassesUsecase(classRepository);
        const result = await usecase.execute(teacherId);
        expect(result).toBeInstanceOf(Array);
        expect(result[0].students).toHaveLength(2);
        expect(result[0].daysOfClass).toHaveLength(2);
        expect(result).toHaveLength(1);
        expect(service).toHaveBeenCalledWith(teacherId);
    });

});
