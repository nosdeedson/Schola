import { AppDataSource } from "../../../../infrastructure/repositories/config-test/appDataSource";
import { ClassEntity } from "../../../../infrastructure/entities/class/class.entity";
import { StudentEntity } from "../../../../infrastructure/entities/student/student.entity";
import { ClassRepository } from "../../../../infrastructure/repositories/class/class.repository";
import { StudentRepository } from "../../../../infrastructure/repositories/student/student.repository";
import { CreateStudentService } from "../create/create.student.service";
import { CreateStudentDto } from '../create/create.student.dto';
import { ParentEntity } from "../../../../infrastructure/entities/parent/parent.entity";
import { ParentRepository } from "../../../../infrastructure/repositories/parent/parent.repository";
import { DomainMocks } from "../../../../infrastructure/__mocks__/mocks";
import { DataSource } from "typeorm";
import { ParentStudentRepository } from "../../../../infrastructure/repositories/parent-student/parent.student.repositoy";
import { ParentStudentEntity } from "../../../../infrastructure/entities/parent-student/parent.student.entity";
describe('CreateStudentService integration tests', () => {
    let appDataSource: DataSource;
    let studentEntity;
    let studentRepository: StudentRepository;
    let schoolGroupEntity;
    let schoolGroupRepository: ClassRepository;
    let parentEntity;
    let parentRepository: ParentRepository;
    let parentStudentyEntity;
    let parentStudentRepository: ParentStudentRepository;

    beforeEach(async () => {
        appDataSource = AppDataSource.getAppDataSource();
        await appDataSource.initialize()
            .catch(error => console.log(error));

        studentEntity = appDataSource.getRepository(StudentEntity);
        studentRepository = new StudentRepository(studentEntity, appDataSource);
        schoolGroupEntity = appDataSource.getRepository(ClassEntity);
        schoolGroupRepository = new ClassRepository(appDataSource);
        parentEntity = appDataSource.getRepository(ParentEntity);
        parentRepository = new ParentRepository(parentEntity, appDataSource);
        parentStudentyEntity = appDataSource.getRepository(ParentStudentEntity);
        parentStudentRepository = new ParentStudentRepository(parentStudentyEntity);
    });

    afterEach(async () => {
        await appDataSource.createQueryBuilder().delete().from(ParentStudentEntity).execute();
        await appDataSource.createQueryBuilder().delete().from(StudentEntity).execute();
        await appDataSource.createQueryBuilder().delete().from(ParentEntity).execute();
        await appDataSource.createQueryBuilder().delete().from(ClassEntity).execute();
        await appDataSource.destroy();
    });

    it('repositories must be instantiated', () => {
        expect(studentRepository).toBeDefined();
        expect(schoolGroupRepository).toBeDefined();
        expect(parentRepository).toBeDefined();
        expect(parentStudentRepository).toBeDefined();
    });

    it('should throw a SystemError if schollgroup not found', async () => {
        let dto = new CreateStudentDto(new Date(), 'edson', '123', ['marie']);
        const service = new CreateStudentService(studentRepository, schoolGroupRepository);
        await expect(service.execute(dto)).rejects
            .toMatchObject({ errors: [{ context: 'student', message: 'Schoolgroup not found' }] });
    });

    it('should update a student with birthday', async () => {
        // class 
        let schoogroup = DomainMocks.mockSchoolGroup();
        let sgEntity = ClassEntity.toClassEntity(schoogroup);
        expect(await schoolGroupRepository.create(sgEntity)).toBeInstanceOf(ClassEntity);

        const parent = DomainMocks.mockParentWithoutStudent();
        const parentEntity = ParentEntity.toParentEntity(parent);
        expect(await parentRepository.create(parentEntity)).toBeInstanceOf(ParentEntity);

        let student = DomainMocks.mockStudentWithoutParent();
        student.setSchoolGroup(schoogroup)
        let studentEntity = StudentEntity.toStudentEntity(student);
        studentEntity.birthday = null as any;
        expect(await studentRepository.create(studentEntity)).toBeInstanceOf(StudentEntity);

        const parentStudent = ParentStudentEntity.toParentStudentEntity(parentEntity, studentEntity);
        expect(await parentStudentRepository.create(parentStudent)).toBeInstanceOf(ParentStudentEntity);

        let dto = new CreateStudentDto(new Date(1980, 6, 30, 23, 59, 59), student.getName(), sgEntity.classCode, [parent.getName()]);
        const service = new CreateStudentService(studentRepository, schoolGroupRepository);
        expect(await service.execute(dto)).toBeInstanceOf(StudentEntity);
        const results = await studentRepository.findAll();
        expect(results[0].birthday).toStrictEqual(new Date(1980, 6, 30, 23, 59, 59));
        expect(results[0].fullName).toBe('julio');
    });

    it('should create a student', async () => {
        let parent = DomainMocks.mockParent();
        parent.setStudents([]);
        let parentModel = ParentEntity.toParentEntity(parent);

        let schoogroup = DomainMocks.mockSchoolGroup();
        let sgEntity = ClassEntity.toClassEntity(schoogroup);
        expect(await schoolGroupRepository.create(sgEntity)).toBeInstanceOf(ClassEntity);

        let dto = new CreateStudentDto(new Date(), 'edson', schoogroup.getClassCode(), [parent.getId()]);
        const service = new CreateStudentService(studentRepository, schoolGroupRepository);
        expect(await service.execute(dto)).toBeInstanceOf(StudentEntity);

    });

});
