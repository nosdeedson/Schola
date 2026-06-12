import { QueryFailedError, Repository } from "typeorm";
import { ParentEntity } from "../../../../infrastructure/entities/parent/parent.entity";
import { StudentEntity } from "../../../../infrastructure/entities/student/student.entity";
import { ParentRepository } from "../../../../infrastructure/repositories/parent/parent.repository";
import { StudentRepository } from "../../../../infrastructure/repositories/student/student.repository";
import { CreateParentDto } from './create.parent.dto';
import { CreateParentService } from './create.parent.service';
import { ParentStudentEntity } from "../../../../infrastructure/entities/parent-student/parent.student.entity";
import { ParentStudentRepository } from "../../../../infrastructure/repositories/parent-student/parent.student.repositoy";
import { TestDataSource } from "@/infrastructure/repositories/config-test/test.datasource";
import { mockStudent } from "../../../../../tests/mocks/domain/student.mocks";
import { mockParent } from "../../../../../tests/mocks/domain/parent.mocks";

describe('CreateParentService integration tests', () => {

    let parentEntity: Repository<ParentEntity>;
    let parentRepository: ParentRepository;

    let studentEntity: Repository<StudentEntity>;
    let studentRepository: StudentRepository;

    let parentStudentEntity: Repository<ParentStudentEntity>;
    let parentStudentRepository: ParentStudentRepository;

    beforeAll(async () => {

        parentEntity = TestDataSource.getRepository(ParentEntity);
        parentRepository = new ParentRepository(TestDataSource);

        studentEntity = TestDataSource.getRepository(StudentEntity);
        studentRepository = new StudentRepository(TestDataSource);

        parentStudentEntity = TestDataSource.getRepository(ParentStudentEntity);
        parentStudentRepository = new ParentStudentRepository(TestDataSource);
    });

    afterEach(async () => {
        jest.clearAllMocks();
    });

    it('entities and repositories must be stantiated', async () => {
        expect(parentEntity).toBeDefined();
        expect(parentRepository).toBeDefined();
        expect(studentEntity).toBeDefined();
        expect(studentRepository).toBeDefined();
        expect(parentStudentEntity).toBeDefined();
        expect(parentStudentRepository).toBeDefined();
    });

    it('should update parent with previously created by the student', async () => {
        const student = mockStudent();
        const studentEntity = StudentMapper.fromDomain(student);
        expect(await studentRepository.create(studentEntity)).toBeInstanceOf(StudentEntity);
        const parent = mockParent();
        parent.setStudents([]);
        const parentEntity = ParentMapper.fromDomain(parent);
        expect(await parentRepository.create(parentEntity)).toBeInstanceOf(ParentEntity);
        const parentStudentEntity = ParentStudentMapper.fromDomain(parentEntity, studentEntity);
        expect(await parentStudentRepository.create(parentStudentEntity)).toBeInstanceOf(ParentStudentEntity);
        const expectBirthday = new Date();
        let input = new CreateParentDto(expectBirthday, parent.getName(), [student.getName()]);
        let service = new CreateParentService(parentRepository);
        const result = await service.execute(input);
        expect(result).toBeInstanceOf(ParentEntity);
        const parentUpdated = await parentRepository.findAll();
        expect(parentUpdated).toBeDefined();
        expect(parentUpdated[0].birthday.getTime()).toBe(expectBirthday.getTime());
    });

    it('should save a parent', async () => {
        let parent = mockParent()
        let input = new CreateParentDto(parent.getBirthday(), parent.getName(), ['jose']);
        const service = new CreateParentService(parentRepository);
        const result = await service.execute(input);
        expect(result).toBeInstanceOf(ParentEntity);
        const parentSaved = await parentRepository.findAll();
        expect(parentSaved).toBeDefined();
        expect(parentSaved.length).toBe(1);
        expect(parentSaved[0].birthday.getTime()).toBe(parent.getBirthday().getTime());
        expect(parentSaved[0].fullName).toBe(parent.getName());
    });

    it("should throw an error", async () => {
        let parent = mockParent();
        parent.setName(null as any);
        parent.setBirthDay(null as any);
        let input = new CreateParentDto(parent.getBirthday(), parent.getName(), ["no one"]);
        const service = new CreateParentService(parentRepository);
        await expect(service.execute(input)).rejects.toMatchObject({
            errors: [
                { context: 'parent', message: 'Name should not be null' },
                { context: 'parent', message: 'Birthday should not be null' },
            ],
        });
    });

    it("should throw an error while trying to find the parent", async () => {
        let parent = mockParent();
        parent.setName(null as any);
        parent.setBirthDay(null as any);
        let input = new CreateParentDto(parent.getBirthday(), parent.getName(), []);
        const service = new CreateParentService(parentRepository);
        expect(service.execute(input)).rejects.toThrow(QueryFailedError)
    });
});
