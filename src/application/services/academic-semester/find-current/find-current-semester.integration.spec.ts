import { Repository } from "typeorm";
import { AcademicSemesterEntity } from "../../../../infrastructure/entities/academic-semester/academic.semester.entity";
import { AcademicSemesterRepository } from "../../../../infrastructure/repositories/academic-semester/academic-semester.repository";
import { TestDataSource } from "../../../../infrastructure/repositories/config-test/test.datasource";
import { mockSemester } from "../../../../../tests/mocks/domain/semester.mocks";
import { AcademicSemesterMapper } from "@/infrastructure/mappers/semester/academic-semester-mapper";
import { AcademicSemester } from "@/domain/academc-semester/academic.semester";

describe('FindCurrentSemesterService integration test', () => {

    let semesterEntity: Repository<AcademicSemesterEntity>;
    let semesterRepository: AcademicSemesterRepository;

    beforeAll(async () => {
        semesterEntity = TestDataSource.getRepository(AcademicSemesterEntity);
        semesterRepository = new AcademicSemesterRepository(TestDataSource);
    });

    it('repository should be defined', async () => {
        expect(semesterRepository).toBeDefined();
    });

    it('should find the current semester', async () => {
        const semester = mockSemester({ currentSemester: true });
        const entity = AcademicSemesterMapper.fromDomain(semester)
        expect(await semesterRepository.create(entity)).toBeInstanceOf(AcademicSemester);

        const result = await semesterRepository.findCurrentSemester();
        expect(result).toBeInstanceOf(AcademicSemester);
        expect(result.getCurrentSemester).toBeTruthy();
    });

    it('should not find the current semester', async () => {
        const semester = mockSemester({ currentSemester: false });
        const entity = AcademicSemesterMapper.fromDomain(semester)
        expect(await semesterRepository.create(entity)).toBeInstanceOf(AcademicSemester);

        const result = await semesterRepository.findCurrentSemester();
        expect(result).toBeNull();
    });

});
