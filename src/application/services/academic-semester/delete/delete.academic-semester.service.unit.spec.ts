import { QueryFailedError } from 'typeorm';
import { MockRepositoriesForUnitTest } from '../../../../../tests/mocks/mock-repositories/mockRepositories'
import { DeleteAcademicSemesterService } from './delete.academic-semester.service';

describe('delete academic semester unit test', () => {

    it('should delete an academic semester', async () => {
        const semesterRepository = await MockRepositoriesForUnitTest.mockRepositories();
        const service = new DeleteAcademicSemesterService(semesterRepository);
        const idToDelete = '95cdc2ed-7e1e-4a16-bd4b-9a4ba9a112e3';
        expect(await service.execute(idToDelete)).toBe(void 0);
        expect(semesterRepository.delete).toHaveBeenCalledTimes(1)
        expect(semesterRepository.delete).toHaveBeenCalledWith(idToDelete);
    });

    it('should throw an error while deleting a semester with invalid uuid', async () => {
        const semesterRepository = await MockRepositoriesForUnitTest.mockRepositories();
        semesterRepository.delete = jest.fn().mockImplementation(() => {
            throw new
                QueryFailedError(null, null, new Error("failed"))
        });
        const service = new DeleteAcademicSemesterService(semesterRepository);
        const idToDelete = '1234';
        await expect(service.execute(idToDelete)).rejects.toThrow(QueryFailedError);
    });

});
