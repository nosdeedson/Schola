import { StudentRepository } from "../../../../infrastructure/repositories/student/student.repository";
import { FindAllStudentService } from "./findAll.student.service";
import { FindAllStudentDto } from "./findAll.student.dto";
import { ParentRepository } from "../../../../infrastructure/repositories/parent/parent.repository";
import { TestDataSource } from "@/infrastructure/repositories/config-test/test.datasource";
import { mockStudent } from "../../../../../tests/mocks/domain/student.mocks";
import { StudentMapper } from "@/infrastructure/mappers/student/student-mapper";
import { Student } from "@/domain/student/student";


describe('FindAllStudents', () => {

    let studentRepository: StudentRepository;
    let parentRepository: ParentRepository;

    beforeAll(async () => {
        studentRepository = new StudentRepository(TestDataSource);
        parentRepository = new ParentRepository(TestDataSource);
    });

    afterEach(async () => {
        jest.clearAllMocks();
    })

    it('should repositories be instantiated', () => {
        expect(studentRepository).toBeDefined();
        expect(parentRepository).toBeDefined();
    });

    it("should find all students", async () => {
        let student = mockStudent();
        let studentEntity = StudentMapper.fromDomain(student);
        expect(await studentRepository.create(studentEntity)).toBeInstanceOf(Student);
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
