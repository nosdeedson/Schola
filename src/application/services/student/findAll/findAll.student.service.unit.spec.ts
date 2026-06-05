import { mockStudent } from '../../../../../tests/mocks/domain/student.mocks';
import { MockRepositoriesForUnitTest } from '../../../../../tests/mocks/mock-repositories/mockRepositories';
import { StudentEntity } from '../../../../infrastructure/entities/student/student.entity';
import { FindAllStudentService } from './findAll.student.service';

describe('FindAllSudentService unit test', () =>{

    it('should return an empty array', async () =>{
        const studentRepository = MockRepositoriesForUnitTest.mockRepositories();
        studentRepository.findAll = jest.fn().mockImplementationOnce(() => {return []});
        const service = new FindAllStudentService(studentRepository);
        const results = await service.execute();
        expect(results).toBeDefined();
        expect(results.all.length).toBe(0);
    });

    it('should find one student', async () =>{
        const student = mockStudent();
        const studentEntity = StudentEntity.toStudentEntity(student);
        const studentRepository = MockRepositoriesForUnitTest.mockRepositories();
        studentRepository.findAll = jest.fn().mockImplementationOnce(() => {return [studentEntity]});
        const service = new FindAllStudentService(studentRepository);
        const results = await service.execute();
        expect(results).toBeDefined();
        expect(results.all.length).toBe(1);
        expect(results.all[0].id).toEqual(student.getId());
    })

})