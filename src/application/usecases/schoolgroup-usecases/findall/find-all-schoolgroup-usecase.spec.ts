import { FindAllClassService } from "@/application/services/class/findAll/findAll.class.service";
import { mockFindClassDto } from "../../../../../tests/mocks/controller/find-class-dto-mock";
import { FindAllClassDto } from "@/application/services/class/findAll/findAll.class.dto";
import { ClassEntity } from "@/infrastructure/entities/class/class.entity";
import { mockClass } from "../../../../../tests/mocks/domain/class.mocks";
import { MockRepositoriesForUnitTest } from "@/infrastructure/__mocks__/mockRepositories";

describe('FindAllSchoolgroupUsecase', () => {

    afterEach(async () => {
        jest.clearAllMocks();
    });
    
    it("should find classes", async () => {
        const entity1 = ClassEntity.toClassEntity(mockClass());
        const entity2 = ClassEntity.toClassEntity(mockClass());
        const entities = new FindAllClassDto([entity1, entity2]);
        const classService = jest.spyOn(FindAllClassService.prototype, 'execute')
            .mockImplementation(() => Promise.resolve(entities));
        const classRepository = MockRepositoriesForUnitTest.mockRepositories();
        const useCase = new FindAllClassService(classRepository);
        const result = await useCase.execute();
        expect(result).toBeDefined();
        expect([entity1.id, entity2.id].includes(result.all[0].id)).toBeTruthy();
        expect([entity1.id, entity2.id].includes(result.all[1].id)).toBeTruthy();
        expect(result.all).toHaveLength(2);
        expect(classService).toHaveBeenCalledTimes(1);
    });

    it("should find an empty array", async () => {
        const entities = new FindAllClassDto([]);
        const classService = jest.spyOn(FindAllClassService.prototype, 'execute')
            .mockImplementation(() => Promise.resolve(entities));
        const classRepository = MockRepositoriesForUnitTest.mockRepositories();
        const useCase = new FindAllClassService(classRepository);
        const result = await useCase.execute();
        expect(result).toBeDefined();
        expect(result.all).toHaveLength(0);
        expect(classService).toHaveBeenCalledTimes(1);
    });
})