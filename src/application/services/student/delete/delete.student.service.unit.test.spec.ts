import { DeleteStudentService } from '../delete/delete.student.service';
import { MockRepositoriesForUnitTest } from '../../../../../tests/mocks/mock-repositories/mockRepositories';


describe('DeleteStudentService unit test', () =>{

    it('should not throw an error if id is invalid', async () => {
        const studentRepository = MockRepositoriesForUnitTest.mockRepositories();
        studentRepository.delete = jest.fn().mockImplementationOnce(() => {
            return void 0;
        });
        const service = new DeleteStudentService(studentRepository);
        expect(await service.execute('123')).toBe(void 0)
    });

    it('should delete a student with a valid Id', async () => {
        const studentRepository = MockRepositoriesForUnitTest.mockRepositories();
        studentRepository.delete = jest.fn().mockImplementationOnce(() => {
            return void 0;
        });
        const service = new DeleteStudentService(studentRepository);
        expect(await service.execute('03529796-3960-4d01-8e51-6fcde97ccf60')).toBe(void 0)
    })

})