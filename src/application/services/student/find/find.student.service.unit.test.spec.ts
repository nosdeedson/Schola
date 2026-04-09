import { FindStudentService } from '../find/find.student.service';
import { DomainMocks} from '../../../../infrastructure/__mocks__/mocks'
import { MockRepositoriesForUnitTest } from '../../../../infrastructure/__mocks__/mockRepositories'
import { StudentEntity } from '../../../../infrastructure/entities/student/student.entity';

describe('FindStudentService unit tests', () =>{

    it('should throw a SystemErro if student does not exist', async () => {
        const studentRepository = MockRepositoriesForUnitTest.mockRepositories();
        studentRepository.find = jest.fn().mockImplementationOnce(() => {return null});
        const service = new FindStudentService(studentRepository);

        try {
            await service.execute('123')
        } catch (error) {
            expect(error).toBeDefined();
            //@ts-ignore
            expect(error.errors).toMatchObject([{context: 'student', message: 'student not found'}]);
            expect(studentRepository.find).toHaveBeenCalledTimes(1);
            expect(studentRepository.find).toHaveBeenCalledWith('123');
        }
    });

    it('should find a student', async () =>{
        let student = DomainMocks.mockStudent();
        let studentEntity = StudentEntity.toStudentEntity(student);
        const studentRepository = MockRepositoriesForUnitTest.mockRepositories();
        studentRepository.find = jest.fn().mockImplementationOnce(() => { return studentEntity});
        const service = new FindStudentService(studentRepository);
        const result = await service.execute(student.getId());
        expect(result).toBeDefined();
        expect(result.id).toBe(student.getId());
        expect(result.createdAt).toEqual(student.getCreatedAt());
        expect(result.fullName).toEqual(student.getName());        
    });

});