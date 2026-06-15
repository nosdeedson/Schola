import { DeleteClassService } from "@/application/services/class/delete/delete.class.service";
import { MockRepositoriesForUnitTest } from "../../../../../tests/mocks/mock-repositories/mockRepositories"
import { DeleteSchoolgroupUsecase } from "./delete-schoolgroup-usecase";

describe('DeleteSchoolgroupUsecase', () =>{

    afterEach(async () => jest.clearAllMocks())

    it('should not throw an error if class does not exist', async () => {
        const classRepository = MockRepositoriesForUnitTest.mockRepositories();
        const deleteClassServie = jest.spyOn(DeleteClassService.prototype, 'execute')
            .mockImplementation(() => Promise.resolve(void 0));
        const wantedId = '123456';
        const usecase = new DeleteSchoolgroupUsecase(classRepository);
        expect(await usecase.execute(wantedId)).toBe(void 0);
        expect(deleteClassServie).toHaveBeenCalledTimes(1);
        expect(deleteClassServie).toHaveBeenCalledWith(wantedId);
    });

        it('should delete a schoolgroup', async () => {
        const classRepository = MockRepositoriesForUnitTest.mockRepositories();
        const deleteClassServie = jest.spyOn(DeleteClassService.prototype, 'execute')
            .mockImplementation(() => Promise.resolve(void 0));
        const wantedId = '123456';
        const usecase = new DeleteSchoolgroupUsecase(classRepository);
        expect(await usecase.execute(wantedId)).toBe(void 0);
        expect(deleteClassServie).toHaveBeenCalledTimes(1);
        expect(deleteClassServie).toHaveBeenCalledWith(wantedId);
    });
});