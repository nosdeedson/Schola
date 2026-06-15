import { FindAllClassService } from "@/application/services/class/findAll/findAll.class.service";
import { FindAllClassDto } from "@/application/services/class/findAll/findAll.class.dto";
import { mockClass } from "../../../../../tests/mocks/domain/class.mocks";
import { MockRepositoriesForUnitTest } from "../../../../../tests/mocks/mock-repositories/mockRepositories";
import { FindAllSchoolgroupUsecase } from "./find-all-schoolgroup-usecase";

describe('FindAllSchoolgroupUsecase', () => {

    afterEach(async () => {
        jest.clearAllMocks();
    });
    
    it("should find classes", async () => {
        const class1 = mockClass();
        const class2 = mockClass();
        const entities = new FindAllClassDto([class1, class2]);
        const classService = jest.spyOn(FindAllClassService.prototype, 'execute')
            .mockImplementation(() => Promise.resolve(entities));
        const classRepository = MockRepositoriesForUnitTest.mockRepositories();
        const useCase = new FindAllSchoolgroupUsecase(classRepository);
        const result = await useCase.execute();
        expect(result).toBeDefined();
        expect([class1.getId(), class2.getId()].includes(result.all[0].id)).toBeTruthy();
        expect([class1.getId(), class2.getId()].includes(result.all[1].id)).toBeTruthy();
        expect(result.all).toHaveLength(2);
        expect(classService).toHaveBeenCalledTimes(1);
    });

    it("should find an empty array", async () => {
        const entities = new FindAllClassDto([]);
        const classService = jest.spyOn(FindAllClassService.prototype, 'execute')
            .mockImplementation(() => Promise.resolve(entities));
        const classRepository = MockRepositoriesForUnitTest.mockRepositories();
        const useCase = new FindAllSchoolgroupUsecase(classRepository);
        const result = await useCase.execute();
        expect(result).toBeDefined();
        expect(result.all).toHaveLength(0);
        expect(classService).toHaveBeenCalledTimes(1);
    });
});