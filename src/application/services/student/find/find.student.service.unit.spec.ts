import { FindStudentService } from './find.student.service';
import { MockRepositoriesForUnitTest } from '../../../../../tests/mocks/mock-repositories/mockRepositories'
import { mockStudent } from '../../../../../tests/mocks/domain/student.mocks';

describe('FindStudentService unit tests', () => {

    it('should throw a SystemErro if student does not exist', async () => {
        const studentRepository = MockRepositoriesForUnitTest.mockRepositories();
        studentRepository.find = jest.fn().mockImplementationOnce(() => { return null });
        const service = new FindStudentService(studentRepository);

        await expect(service.execute('123')).rejects
            .toMatchObject({ errors: [{ context: 'student', message: 'student not found' }] });
    });

    it('should find a student', async () => {
        let student = mockStudent();
        const studentRepository = MockRepositoriesForUnitTest.mockRepositories();
        studentRepository.find = jest.fn().mockImplementationOnce(() => { return student });
        const service = new FindStudentService(studentRepository);
        const result = await service.execute(student.getId());
        expect(result).toBeDefined();
        expect(result.getId()).toBe(student.getId());
        expect(result.getCreatedAt()).toEqual(student.getCreatedAt());
        expect(result.getName()).toEqual(student.getName());
    });

});
