import { Repository } from "typeorm"
import { StudentEntity } from "../../../../infrastructure/entities/student/student.entity";
import { StudentRepository } from "../../../../infrastructure/repositories/student/student.repository";
import { ParentEntity } from "../../../../infrastructure/entities/parent/parent.entity";
import { FindAllStudentService } from "../../../../application/services/student/findAll/findAll.student.service";
import { FindAllStudentDto } from "../../../../application/services/student/findAll/findAll.student.dto";
import { ParentRepository } from "../../../../infrastructure/repositories/parent/parent.repository";
import { TestDataSource } from "@/infrastructure/repositories/config-test/test.datasource";
import { mockStudent } from "../../../../../tests/mocks/domain/student.mocks";


describe('FindAllStudents', () => {

    let studentEntity: Repository<StudentEntity>;
    let studentRepository: StudentRepository;
    let parentEntity: Repository<ParentEntity>;
    let parentRepository: ParentRepository;

    beforeAll(async () => {
        studentEntity = TestDataSource.getRepository(StudentEntity);
        studentRepository = new StudentRepository(TestDataSource);
        parentEntity = TestDataSource.getRepository(ParentEntity);
        parentRepository = new ParentRepository(parentEntity, TestDataSource);
    });

    afterEach(async () => {
        jest.clearAllMocks();
    })

    it('should repositories be instantiated', () => {
        expect(studentEntity).toBeDefined();
        expect(studentRepository).toBeDefined();
    });

    it("should find all students", async () => {
        let student = mockStudent();
        let studentEntity = StudentEntity.toStudentEntity(student);
        expect(await studentRepository.create(studentEntity)).toBeInstanceOf(StudentEntity);
        const service = new FindAllStudentService(studentRepository);
        const students = await service.execute();
        expect(students).toBeInstanceOf(FindAllStudentDto);
        expect(students.all).toBeInstanceOf(Array);
        expect(students.all[0].name).toBe(student.getName());
    });

    it("should find an empty list", async () => {
        const service = new FindAllStudentService(studentRepository);
        const students = await service.execute();
        expect(students).toBeInstanceOf(FindAllStudentDto);
        expect(students.all.length).toBe(0);
    });

});
