import { DataSource, QueryFailedError, Repository } from "typeorm";
import { AppDataSource } from "../../../../infrastructure/repositories/config-test/appDataSource";
import { DomainMocks } from "../../../../infrastructure/__mocks__/mocks";
import { ParentEntity } from "../../../../infrastructure/entities/parent/parent.entity";
import { StudentEntity } from "../../../../infrastructure/entities/student/student.entity";
import { ParentRepository } from "../../../../infrastructure/repositories/parent/parent.repository";
import { StudentRepository } from "../../../../infrastructure/repositories/student/student.repository";
import { CreateParentDto } from './create.parent.dto';
import { CreateParentService } from './create.parent.service';
import { ParentStudentEntity } from "../../../../infrastructure/entities/parent-student/parent.student.entity";
import { ParentStudentRepository } from "../../../../infrastructure/repositories/parent-student/parent.student.repositoy";

describe('CreateParentService integration tests', () => {

    let appDataSource: DataSource;

    let parentEntity: Repository<ParentEntity>;
    let parentRepository: ParentRepository;

    let studentEntity: Repository<StudentEntity>;
    let studentRepository: StudentRepository;

    let parentStudentEntity: Repository<ParentStudentEntity>;
    let parentStudentRepository: ParentStudentRepository;

    beforeEach(async () => {
        appDataSource = AppDataSource.getAppDataSource();
        await appDataSource.initialize()
            .catch(error => console.log(error));

        parentEntity = appDataSource.getRepository(ParentEntity);
        parentRepository = new ParentRepository(parentEntity, appDataSource);

        studentEntity = appDataSource.getRepository(StudentEntity);
        studentRepository = new StudentRepository(studentEntity, appDataSource);

        parentStudentEntity = appDataSource.getRepository(ParentStudentEntity);
        parentStudentRepository = new ParentStudentRepository(parentStudentEntity);
    });

    afterEach(async () => {
        await appDataSource.createQueryBuilder().delete().from(StudentEntity).execute();
        await appDataSource.createQueryBuilder().delete().from(ParentEntity).execute();
        await appDataSource.destroy();
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
        const student = DomainMocks.mockStudent();
        const studentEntity = StudentEntity.toStudentEntity(student);
        expect(await studentRepository.create(studentEntity)).toBeInstanceOf(StudentEntity);
        const parent = DomainMocks.mockParentWithoutStudent();
        parent.setStudents([]);
        const parentEntity = ParentEntity.toParentEntity(parent);
        expect(await parentRepository.create(parentEntity)).toBeInstanceOf(ParentEntity);
        const parentStudentEntity = ParentStudentEntity.toParentStudentEntity(parentEntity, studentEntity);
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
        let parent = DomainMocks.mockParentWithoutStudent()
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
        let parent = DomainMocks.mockParentWithoutStudent();
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
        let parent = DomainMocks.mockParentWithoutStudent();
        parent.setName(null as any);
        parent.setBirthDay(null as any);
        let input = new CreateParentDto(parent.getBirthday(), parent.getName(), []);
        const service = new CreateParentService(parentRepository);
        expect(service.execute(input)).rejects.toThrow(QueryFailedError)
    });
});