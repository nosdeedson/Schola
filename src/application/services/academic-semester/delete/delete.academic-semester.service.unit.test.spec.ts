import { MockRepositoriesForUnitTest } from '../../../../infrastructure/__mocks__/mockRepositories'
import { DeleteAcademicSemesterService } from '../../academic-semester/delete/delete.academic-semester.service';

describe('delete academic semester unit test', () =>{

    it('should delete an academic semester', async () => {
        const semesterRepository = await MockRepositoriesForUnitTest.mockRepositories();
        const service = new DeleteAcademicSemesterService(semesterRepository);
        const idToDelete = '95cdc2ed-7e1e-4a16-bd4b-9a4ba9a112e3';
        expect(await service.execute(idToDelete)).toBe(void 0);
        expect(semesterRepository.delete).toHaveBeenCalledTimes(1)
        expect(semesterRepository.delete).toHaveBeenCalledWith(idToDelete);
    });

});