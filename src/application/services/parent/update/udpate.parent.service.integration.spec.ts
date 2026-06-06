import { Repository } from "typeorm";
import { ParentEntity } from "../../../../infrastructure/entities/parent/parent.entity";
import { StudentEntity } from "../../../../infrastructure/entities/student/student.entity";
import { ParentRepository } from "../../../../infrastructure/repositories/parent/parent.repository";
import { StudentRepository } from "../../../../infrastructure/repositories/student/student.repository";
import { UpdateParentService } from "./update.parent.service";
import { TestDataSource } from "@/infrastructure/repositories/config-test/test.datasource";
import { mockStudent } from "../../../../../tests/mocks/domain/student.mocks";
import { mockParent } from "../../../../../tests/mocks/domain/parent.mocks";

describe('UpdateParentService integration tests', () => {

    let parentEntity: Repository<ParentEntity>;
    let parentRepository: ParentRepository;

    let studentEntity: Repository<StudentEntity>;
    let studentRepository: StudentRepository;

    beforeEach(async () => {
        parentEntity = TestDataSource.getRepository(ParentEntity);
        parentRepository = new ParentRepository(TestDataSource);

        studentEntity = TestDataSource.getRepository(StudentEntity);
        studentRepository = new StudentRepository(TestDataSource);
    });

    afterEach(async () => {
        jest.clearAllMocks();
    });

    it('repositories and entities must be instantiated', async () => {
        expect(parentEntity).toBeDefined();
        expect(parentRepository).toBeDefined();
        expect(studentEntity).toBeDefined();
        expect(studentRepository).toBeDefined();
    });

    it('should throw an SystemError when using a non-existent id to update a parent', async () => {
        const noExistentParentId = '65b7d0ff-4f7f-4402-be23-2eb809a7bebc';
        const service = new UpdateParentService(parentRepository);
        await expect(service.execute(new Date(), 'any name', noExistentParentId))
            .rejects.toMatchObject({
                errors: [{
                    context: 'parent',
                    message: 'Parent not found'
                }]
            });
    });

    it('should update a parent with birthday', async () => {
        const parent = mockParent();
        const parentEntity = ParentEntity.toParentEntity(parent);
        parentEntity.birthday = null as any;
        expect(await parentRepository.create(parentEntity)).toBeInstanceOf(ParentEntity);

        let results = await parentRepository.findAll();
        expect(results.length).toBe(1);
        const wantedParentId = results[0].id;
        const service = new UpdateParentService(parentRepository);
        const wantedName = parent.getName();
        const wantedBirthday = new Date();
        expect(await service.execute(wantedBirthday, wantedName, wantedParentId));
        results = await parentRepository.findAll();
        expect(results[0].fullName).toBe(wantedName);
        expect(results[0].birthday.getTime()).toBe(wantedBirthday.getTime());
    });

});
