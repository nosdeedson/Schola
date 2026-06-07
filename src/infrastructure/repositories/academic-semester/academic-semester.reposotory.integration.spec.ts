import { QueryFailedError } from "typeorm";
import { mockQuarter } from "../../../../tests/mocks/domain/quarter.mocks";
import { mockSemester } from "../../../../tests/mocks/domain/semester.mocks";
import { AcademicSemesterEntity } from "../../entities/academic-semester/academic.semester.entity";
import { TestDataSource } from '../config-test/test.datasource';
import { AcademicSemesterRepository } from './academic-semester.repository';
import { AcademicSemester } from "@/domain/academc-semester/academic.semester";
import { AcademicSemesterMapper } from "@/infrastructure/mappers/semester/academic-semester-mapper";

describe('AcademicSemesterRepository unit tests', () => {

    let repository: AcademicSemesterRepository;

    beforeAll(() => {
        const academicSemesterModel = TestDataSource.getRepository(AcademicSemesterEntity);
        repository = new AcademicSemesterRepository(TestDataSource);
    });

    it('acacemicSemester should be instantiated', () => {
        expect(repository).toBeDefined();
    })

    it('should save an acacemicSemester on BD', async () => {
        let firstQuarter = mockQuarter({ currentQuarter: true });
        let secondQuarter = mockQuarter({ beginningDate: new Date(2026, 3, 1, 23, 59, 59), endingDate: new Date(2026, 7, 30, 23, 59, 59) });
        let semester = mockSemester({ secondQuarter, currentSemester: true })
        let wantedId = semester.getId();
        expect(await repository.create(AcademicSemesterMapper.fromDomain(semester))).toBeInstanceOf(AcademicSemester);
        let result = await repository.find(wantedId);
        expect(result).toBeDefined()
        expect(result.getId()).toEqual(wantedId);
        expect(result.getCurrentSemester()).toBeTruthy();
        expect(result.getFirstQuarter().beginningDate.getTime()).toEqual(semester.firstQuarter.beginningDate.getTime());
        expect(result.getFirstQuarter().endingDate.getTime()).toEqual(semester.firstQuarter.endingDate.getTime());
        expect(result.getSecondQuarter().beginningDate.getTime()).toEqual(semester.secondQuarter.beginningDate.getTime());
        expect(result.getSecondQuarter().endingDate.getTime()).toEqual(semester.secondQuarter.endingDate.getTime());

    });

    it('should delete an academicSemester', async () => {
        let secondQuarter = mockQuarter({ beginningDate: new Date(2026, 3, 1, 23, 59, 59), endingDate: new Date(2026, 7, 30, 23, 59, 59) });
        let semester = mockSemester({ secondQuarter, currentSemester: false })
        let wantedId = semester.getId();
        expect(await repository.create(AcademicSemesterMapper.fromDomain(semester))).toBeInstanceOf(AcademicSemester);
        expect(await repository.delete(wantedId)).toBe(void 0);
        let all = await repository.findAll();
        expect(all).toHaveLength(0);
    })

    it('should not throw an error if passed an id that does not existe', async () => {
        let secondQuarter = mockQuarter({ beginningDate: new Date(2026, 3, 1, 23, 59, 59), endingDate: new Date(2026, 7, 30, 23, 59, 59) });
        let semester = mockSemester({ secondQuarter, currentSemester: false })
        expect(await repository.create(AcademicSemesterMapper.fromDomain(semester))).toBeInstanceOf(AcademicSemester);
        let wantedId = '85e71875-289c-48b1-82b1-8c4f9ae16104'
        expect(await repository.delete(wantedId)).toBe(void 0);
    })

    it('should find an academicSemester on BD', async () => {
        let secondQuarter = mockQuarter({ beginningDate: new Date(2026, 3, 1, 23, 59, 59), endingDate: new Date(2026, 7, 30, 23, 59, 59) });
        let semester = mockSemester({ secondQuarter, currentSemester: true })
        expect(await repository.create(AcademicSemesterMapper.fromDomain(semester))).toBeInstanceOf(AcademicSemester);
        let wantedId = semester.getId();
        let result = await repository.find(wantedId);
        expect(result).toBeDefined();
        expect(result.getId()).toEqual(wantedId);
        expect(result.getCurrentSemester()).toBeTruthy();
    })

    it('should find all academicSemester on BD', async () => {
        let secondQuarter = mockQuarter({ beginningDate: new Date(2026, 3, 1, 23, 59, 59), endingDate: new Date(2026, 7, 30, 23, 59, 59) });
        let semester = mockSemester({ secondQuarter, currentSemester: true })
        expect(await repository.create(AcademicSemesterMapper.fromDomain(semester))).toBeInstanceOf(AcademicSemester);

        let firstQuarter = mockQuarter({ beginningDate: new Date(2026, 7, 3, 23, 59, 59), endingDate: new Date(2026, 8, 30, 23, 59, 59) });
        let secondQuarter2 = mockQuarter({ beginningDate: new Date(2026, 9, 1, 23, 59, 59), endingDate: new Date(2026, 11, 4, 23, 59, 59) });

        let semester2 = mockSemester({ firstQuarter, secondQuarter: secondQuarter2, currentSemester: false })
        expect(await repository.create(AcademicSemesterMapper.fromDomain(semester2))).toBeInstanceOf(AcademicSemester);
        let results = await repository.findAll();
        expect(results).toBeDefined();
        expect(results.length).toBe(2);
        expect(results[0].getCurrentSemester()).toBeTruthy();
        expect(results[1].getCurrentSemester()).toBeFalsy();
        expect(results[0].getId()).toEqual(semester.getId());
        expect(results[1].getId()).toEqual(semester2.getId());
    });

    it('should update current in academicSemester to false', async () => {
        let secondQuarter = mockQuarter({ beginningDate: new Date(2026, 3, 1, 23, 59, 59), endingDate: new Date(2026, 7, 30, 23, 59, 59) });
        let semester = mockSemester({ secondQuarter, currentSemester: false })
        expect(await repository.create(AcademicSemesterMapper.fromDomain(semester))).toBeInstanceOf(AcademicSemester);
        const wantedId = semester.getId();

        let wantedActual = false;
        semester.setCurrentSemester(wantedActual);
        semester.getFirstQuarter().currentQuarter = false;
        semester.getSecondQuarter().currentQuarter = true;
        semester.setUpdatedAt(new Date());
        await repository.update(AcademicSemesterMapper.fromDomain(semester));
        let result = await repository.find(wantedId);
        expect(result).toBeDefined();
        expect(result.getCurrentSemester()).toBeFalsy();
        expect(result.getUpdatedAt().getTime()).toBeGreaterThan(semester.getCreatedAt().getTime());
    });

    it('should find the current semester', async () => {
        let secondQuarter = mockQuarter({ beginningDate: new Date(2026, 3, 1, 23, 59, 59), endingDate: new Date(2026, 7, 30, 23, 59, 59) });
        let semester = mockSemester({ secondQuarter, currentSemester: true })
        expect(await repository.create(AcademicSemesterMapper.fromDomain(semester))).toBeInstanceOf(AcademicSemester);
        const result = await repository.findCurrentSemester();
        expect(result).toBeDefined();
        expect(result.getCurrentSemester()).toBeTruthy();
    });

    it('should throw QueryFailedError error', async () => {
        const entity = new AcademicSemesterEntity();
        await expect(repository.create(entity)).rejects.toThrow(QueryFailedError);
    });

});
