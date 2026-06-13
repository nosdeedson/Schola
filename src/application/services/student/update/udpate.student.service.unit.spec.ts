import { UpdateStudentDto } from './udpate.student.dto';
import { UpdateStudentService } from './udpate.student.service';
import { MockRepositoriesForUnitTest } from '../../../../../tests/mocks/mock-repositories/mockRepositories';
import { mockStudent } from '../../../../../tests/mocks/domain/student.mocks';
import { StudentMapper } from '@/infrastructure/mappers/student/student-mapper';

describe('UpdateStudentService unit test', () => {

    it('should throw a SystemError if student not found', async () => {
        const studentRepository = MockRepositoriesForUnitTest.mockRepositories();
        studentRepository.find = jest.fn().mockImplementationOnce(() => { return null });
        const service = new UpdateStudentService(studentRepository);
        const dto = new UpdateStudentDto('123', '1234');
        await expect(service.execute(dto)).rejects
            .toMatchObject({ errors: [{ context: 'student', message: 'student not found' }] });
    });

    it('should update a student', async () => {
        const studentRepository = MockRepositoriesForUnitTest.mockRepositories();
        const student = mockStudent();

        let wantedEnrolled = '43321';
        studentRepository.update = jest.fn().mockImplementationOnce(() => {
            student.setEnrolled(wantedEnrolled);
            return void 0;
        });
        studentRepository.find = jest.fn().mockImplementationOnce(() => { return student })
        let dto = new UpdateStudentDto(student.getId(), '43321');

        const service = new UpdateStudentService(studentRepository);
        expect(await service.execute(dto)).toBe(void 0);
        expect(studentRepository.update).toHaveBeenCalledTimes(1);
        expect(studentRepository.find).toHaveBeenCalledTimes(1);
        expect(studentRepository.find).toHaveBeenCalledWith(dto.id);
    });
});
