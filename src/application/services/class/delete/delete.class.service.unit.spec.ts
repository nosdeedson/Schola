import { mockClass } from "../../../../../tests/mocks/domain/class.mocks";
import { MockRepositoriesForUnitTest } from "../../../../../tests/mocks/mock-repositories/mockRepositories";
import { DeleteClassService } from './delete.class.service';


describe('delete class service unit test', () =>{
    
    it('should delete a class', async () => {
        let schoolGroup = mockClass();
        let classRepository = await MockRepositoriesForUnitTest.mockRepositories();
        const service = new DeleteClassService(classRepository);
        expect(await service.execute(schoolGroup.getId())).toBe(void 0);
        expect(classRepository.delete).toHaveBeenCalledTimes(1);
        expect(classRepository.delete).toHaveBeenCalledWith(schoolGroup.getId());
    });

    it('given an invalid id should not throw an error', async () => {
        let classRepository = await MockRepositoriesForUnitTest.mockRepositories();
        const service = new DeleteClassService(classRepository);
        const invalidId = "1234";
        expect(await service.execute(invalidId)).toBe(void 0);
        expect(classRepository.delete).toHaveBeenCalledTimes(1);
        expect(classRepository.delete).toHaveBeenCalledWith(invalidId);
    });

});