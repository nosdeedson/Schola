import { UpdateStudentDto } from './udpate.student.dto';
import { UpdateStudentService } from './udpate.student.service';
import { StudentEntity } from '../../../../infrastructure/entities/student/student.entity';
import { MockRepositoriesForUnitTest } from '../../../../../tests/mocks/mock-repositories/mockRepositories';
import { DomainMocks } from '../../../../infrastructure/__mocks__/mocks';

describe('UpdateStudentService unit test', () =>{

    it('should throw a SystemError if student not found', async () =>{
        const studentRepository = MockRepositoriesForUnitTest.mockRepositories();
        studentRepository.find = jest.fn().mockImplementationOnce(() => {return null});
        const service = new UpdateStudentService(studentRepository);
        const dto = new UpdateStudentDto('123', '1234');
        try {
            await service.execute(dto);
        } catch (error) {
            expect(error).toBeDefined();
            //@ts-ignore
            expect(error.errors.length).toBe(1);
            //@ts-ignore
            expect(error.errors).toMatchObject([{context: 'student', message: 'student not found'}]);
        }
    });

    it('should update a student', async () =>{
        const studentRepository = MockRepositoriesForUnitTest.mockRepositories();
        const student = DomainMocks.mockStudent();
        const studentEntity = StudentEntity.toStudentEntity(student);

        let wantedEnrolled = '43321';
        studentRepository.update = jest.fn().mockImplementationOnce(() => {
            studentEntity.enrolled = wantedEnrolled;
            return void 0;
        });
        studentRepository.find = jest.fn().mockImplementationOnce(() => {return studentEntity})
        let dto = new UpdateStudentDto(student.getId(), '43321');

        const service = new UpdateStudentService(studentRepository);
        expect(await service.execute(dto)).toBe(void 0);
        expect(studentRepository.update).toHaveBeenCalledTimes(1);
        expect(studentRepository.update).toHaveBeenCalledWith(studentEntity);
        expect(studentRepository.find).toHaveBeenCalledTimes(1);
        expect(studentRepository.find).toHaveBeenCalledWith(dto.id);
    })


})