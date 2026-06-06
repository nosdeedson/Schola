import { DeleteAcademicSemesterService } from "@/application/services/academic-semester/delete/delete.academic-semester.service";
import { MockRepositoriesForUnitTest } from "../../../../../tests/mocks/mock-repositories/mockRepositories";
import { DeleteSemesterUsecase } from "./delete-semester-usecase";

describe('DeleteSemesterUsecase', () => {

    it('should delete a semester', async () => {
        const deleteService = jest.spyOn(DeleteAcademicSemesterService.prototype, 'execute')
            .mockImplementation(() => Promise.resolve(void 0));
        const repository = MockRepositoriesForUnitTest.mockRepositories();
        const usecase = new DeleteSemesterUsecase(repository);
        const wantedId = '3857d77a-a515-4ec0-93e3-a053ac587283';
        expect(await usecase.execute(wantedId)).toBe(void 0);
        expect(deleteService).toHaveBeenCalledTimes(1);
        expect(deleteService).toHaveBeenCalledWith(wantedId);
    });
})
