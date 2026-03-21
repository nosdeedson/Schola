import { Repository } from "typeorm";
import { AcademicSemesterEntity } from "../../../../infrastructure/entities/academic-semester/academic.semester.entity";
import { AcademicSemesterRepository } from "../../../../infrastructure/repositories/academic-semester/academic-semester.repository";
import { TestDataSource } from "../../../../infrastructure/repositories/config-test/test.datasource";
import { mockSemester } from "../../../../../tests/mocks/domains/semester.mocks";

describe('FindCurrentSemesterService integration test', () => {

    let semesterEntity: Repository<AcademicSemesterEntity>;
    let semesterRepository: AcademicSemesterRepository;

    beforeAll( async () => {
        semesterEntity = TestDataSource.getRepository(AcademicSemesterEntity);
        semesterRepository = new AcademicSemesterRepository(semesterEntity, TestDataSource);
    });

    it('repository should be defined', async () => {
        expect(semesterRepository).toBeDefined();
    });

    it('should find the current semester', async () => {
        const semester = mockSemester({currentSemester: true});
        const entity = AcademicSemesterEntity.toEntity(semester)
        expect(await semesterRepository.create(entity)).toBeInstanceOf(AcademicSemesterEntity);

        const result = await semesterRepository.findCurrentSemester();
        expect(result).toBeInstanceOf(AcademicSemesterEntity);
        expect(result.current).toBeTruthy();
    });

});