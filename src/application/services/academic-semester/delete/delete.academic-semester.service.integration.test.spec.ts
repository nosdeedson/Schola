import { Repository } from "typeorm";
import { mockSemester } from "../../../../../tests/mocks/domain/semester.mocks";
import { AcademicSemester } from "../../../../domain/academc-semester/academic.semester";
import { AcademicSemesterEntity } from "../../../../infrastructure/entities/academic-semester/academic.semester.entity";
import { AcademicSemesterRepository } from "../../../../infrastructure/repositories/academic-semester/academic-semester.repository";
import { TestDataSource } from "../../../../infrastructure/repositories/config-test/test.datasource";
import { DeleteAcademicSemesterService } from './delete.academic-semester.service';


describe('academic semester integration test', () => {

    let semesterEntity: Repository<AcademicSemesterEntity>;
    let semesterRepository: AcademicSemesterRepository;

    let semester: AcademicSemester;

    beforeAll(async () => {
        semesterEntity = TestDataSource.getRepository(AcademicSemesterEntity);
        semesterRepository = new AcademicSemesterRepository(TestDataSource);
    });

    afterEach(async () => {
        jest.clearAllMocks();
    });

    it('semester repository must be instantiated', async () => {
        expect(semesterRepository).toBeDefined();
        expect(semesterEntity).toBeDefined();
    });

    it('should delete an academic semester from BD', async () => {
        const semester = mockSemester();
        const entity = AcademicSemesterEntity.toEntity(semester);
        expect(await semesterRepository.create(entity)).toBeInstanceOf(AcademicSemesterEntity);
        const idToDelete = semester.getId();
        const hasOne = await semesterRepository.find(idToDelete);
        expect(hasOne).toBeDefined();
        const service = new DeleteAcademicSemesterService(semesterRepository);
        expect(await service.execute(idToDelete)).toBe(void 0);
        const results = await semesterRepository.findAll();
        expect(results.length).toBe(0);
    })

    it('should not delete an academic semester from BD if id does not exist', async () => {
        const results = await semesterRepository.findAll();
        expect(results.length).toBe(0);
        const service = new DeleteAcademicSemesterService(semesterRepository);
        expect(await service.execute('4558243c-c380-4a0d-8739-05a403bfec90')).toBe(void 0);
    });

});