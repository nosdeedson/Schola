import { QueryFailedError, Repository } from "typeorm";
import { ParentEntity } from "../../../../infrastructure/entities/parent/parent.entity";
import { StudentEntity } from "../../../../infrastructure/entities/student/student.entity";
import { ParentRepository } from "../../../../infrastructure/repositories/parent/parent.repository";
import { StudentRepository } from "../../../../infrastructure/repositories/student/student.repository";
import { DeleteStudentService } from "../delete/delete.student.service";
import { TestDataSource } from "../../../../infrastructure/repositories/config-test/test.datasource";
import { mockStudent } from '../../../../../tests/mocks/domain/student.mocks';
import { StudentMapper } from "@/infrastructure/mappers/student/student-mapper";
import { Student } from "@/domain/student/student";

describe('DeleteStudentService integration tests', () => {
    let studentRepository: StudentRepository;
    let parentRepository: ParentRepository;

    beforeAll(() => {
        studentRepository = new StudentRepository(TestDataSource);
        parentRepository = new ParentRepository(TestDataSource);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('repositories must be instantiated', () => {
        expect(studentRepository).toBeDefined();
        expect(parentRepository).toBeDefined();
    });

    it('should not throw a SystemError if id does not exist', async () => {
        let student = mockStudent();
        let studentEntity = StudentMapper.fromDomain(student);
        expect(await studentRepository.create(studentEntity)).toBeInstanceOf(Student);
        let noExixtentId = 'ddb5186b-9a8d-4c5d-8086-2cccc0499c11';
        const service = new DeleteStudentService(studentRepository);
        expect(await service.execute(noExixtentId)).toBe(void 0);
    });

    it('should delete a student', async () => {
        let student = mockStudent();
        let studentEntity = StudentMapper.fromDomain(student);
        expect(await studentRepository.create(studentEntity)).toBeInstanceOf(Student);

        let wantedId = student.getId();
        const service = new DeleteStudentService(studentRepository);
        expect(await service.execute(wantedId)).toBe(void 0);

        const fromBD = await studentRepository.find(student.getId());
        expect(fromBD).toBeNull();
    });

    it('should throw an QueryFailedError invalid UUID', async () => {
        let wantedId = '1234';
        const service = new DeleteStudentService(studentRepository);
        await expect(service.execute(wantedId)).rejects.toThrow(QueryFailedError);
    });
});
