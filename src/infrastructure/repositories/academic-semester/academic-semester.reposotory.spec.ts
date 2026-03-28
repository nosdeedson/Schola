import { mockQuarter } from "../../../../tests/mocks/domain/quarter.mocks";
import { mockSemester } from "../../../../tests/mocks/domain/semester.mocks";
import { AcademicSemesterEntity } from "../../entities/academic-semester/academic.semester.entity";
import { TestDataSource } from '../config-test/test.datasource';
import { AcademicSemesterRepository } from './academic-semester.repository';

describe('AcademicSemesterRepository unit tests', () => {

    let repository: AcademicSemesterRepository;

    beforeAll(() => {
        const academicSemesterModel = TestDataSource.getRepository(AcademicSemesterEntity);
        repository = new AcademicSemesterRepository(academicSemesterModel, TestDataSource);
    });

    it('acacemicSemester should be instantiated', () => {
        expect(repository).toBeDefined();
    })

    it('should save an acacemicSemester on BD', async () => {
        let firstQuarter = mockQuarter({ currentQuarter: true });
        let secondQuarter = mockQuarter({ beginningDate: new Date(2026, 3, 1, 23, 59, 59), endingDate: new Date(2026, 7, 30, 23, 59, 59) });
        let semester = mockSemester({ secondQuarter, currentSemester: true })
        let entity = AcademicSemesterEntity.toEntity(semester);
        let wantedId = semester.getId();
        expect(await repository.create(entity)).toBeInstanceOf(AcademicSemesterEntity);
        let result = await repository.find(wantedId);
        expect(result).toBeDefined()
        expect(result.id).toEqual(wantedId);
        expect(result.current).toBeTruthy();
        expect(result.quarters[0].beginningDate.getTime()).toEqual(semester.firstQuarter.beginningDate.getTime());
        expect(result.quarters[0].endingDate.getTime()).toEqual(semester.firstQuarter.endingDate.getTime());
        expect(result.quarters[1].beginningDate.getTime()).toEqual(semester.secondQuarter.beginningDate.getTime());
        expect(result.quarters[1].endingDate.getTime()).toEqual(semester.secondQuarter.endingDate.getTime());

    });

    it('should delete an academicSemester', async () => {
        let secondQuarter = mockQuarter({ beginningDate: new Date(2026, 3, 1, 23, 59, 59), endingDate: new Date(2026, 7, 30, 23, 59, 59) });
        let semester = mockSemester({ secondQuarter, currentSemester: false })
        let entity = AcademicSemesterEntity.toEntity(semester);
        let wantedId = semester.getId();
        expect(await repository.create(entity)).toBeInstanceOf(AcademicSemesterEntity);
        expect(await repository.delete(wantedId)).toBe(void 0);
        let all = await repository.findAll();
        expect(all).toHaveLength(0);
    })

    it('should not throw an error if passed an id that does not existe', async () => {
        let secondQuarter = mockQuarter({beginningDate: new Date(2026, 3, 1, 23, 59,59), endingDate: new Date(2026,7, 30, 23,59,59)});
        let semester = mockSemester({secondQuarter, currentSemester: false} )
        let entity = AcademicSemesterEntity.toEntity(semester);
        expect(await repository.create(entity)).toBeInstanceOf(AcademicSemesterEntity);
        let wantedId = '85e71875-289c-48b1-82b1-8c4f9ae16104'
        expect(await repository.delete(wantedId)).toBe(void 0);
    })

    it('should find an academicSemester on BD', async () => {
        let secondQuarter = mockQuarter({beginningDate: new Date(2026, 3, 1, 23, 59,59), endingDate: new Date(2026,7, 30, 23,59,59)});
        let semester = mockSemester({secondQuarter, currentSemester: true} )
        let entity = AcademicSemesterEntity.toEntity(semester);
        expect(await repository.create(entity)).toBeInstanceOf(AcademicSemesterEntity);
        let wantedId = semester.getId();
        let result = await repository.find(wantedId);
        expect(result).toBeDefined();
        expect(result.id).toEqual(wantedId);
        expect(result.current).toBeTruthy();
    })

    it('should find all academicSemester on BD', async () => {
        let secondQuarter = mockQuarter({beginningDate: new Date(2026, 3, 1, 23, 59,59), endingDate: new Date(2026,7, 30, 23,59,59)});
        let semester = mockSemester({secondQuarter, currentSemester: true} )
        let entity = AcademicSemesterEntity.toEntity(semester);
        const wantedId = 'acd72d81-1703-4313-b3f4-f4c6f8233433';
        entity.id = wantedId;
        expect(await repository.create(entity)).toBeInstanceOf(AcademicSemesterEntity);

        let firstQuarter = mockQuarter({beginningDate: new Date(2026, 7, 3, 23, 59,59), endingDate: new Date(2026, 8, 30, 23,59,59)});
        let secondQuarter2 = mockQuarter({beginningDate: new Date(2026, 9, 1, 23, 59,59), endingDate: new Date(2026, 11, 4, 23,59,59)});
        let semester2 = mockSemester({firstQuarter, secondQuarter: secondQuarter2, currentSemester: false} )
        let entity2 = AcademicSemesterEntity.toEntity(semester2);
        expect(await repository.create(entity2)).toBeInstanceOf(AcademicSemesterEntity);
        let results = await repository.findAll();
        expect(results).toBeDefined();
        expect(results.length).toBe(2);
        expect(results[0].current).toBeTruthy();
        expect(results[1].current).toBeFalsy();
        expect(results[0].id).toEqual(entity.id);
        expect(results[1].id).toEqual(entity2.id);
    });

    it('should update current in academicSemester to false', async () => {
        let secondQuarter = mockQuarter({beginningDate: new Date(2026, 3, 1, 23, 59,59), endingDate: new Date(2026,7, 30, 23,59,59)});
        let semester = mockSemester({secondQuarter, currentSemester: false} )
        let entity = AcademicSemesterEntity.toEntity(semester);
        entity.createdAt = new Date(2026,2, 1, 23,59,59);
        expect(await repository.create(entity)).toBeInstanceOf(AcademicSemesterEntity);
        const wantedId = entity.id;

        let wantedActual = false;
        entity.current = wantedActual;
        entity.quarters[0].currentQuarter = false;
        entity.quarters[1].currentQuarter = true;
        entity.updatedAt = new Date();
        await repository.update(entity);
        let result = await repository.find(wantedId);
        expect(result).toBeDefined();
        expect(result.current).toBeFalsy();
        expect(result.updatedAt.getTime()).toBeGreaterThan(semester.getCreatedAt().getTime());
    });

    it('should find the current semester', async () => {
        let secondQuarter = mockQuarter({beginningDate: new Date(2026, 3, 1, 23, 59,59), endingDate: new Date(2026,7, 30, 23,59,59)});
        let semester = mockSemester({secondQuarter, currentSemester: true} )
        let entity = AcademicSemesterEntity.toEntity(semester);
        expect(await repository.create(entity)).toBeInstanceOf(AcademicSemesterEntity);
        const result = await repository.findCurrentSemester();
        expect(result).toBeDefined();
        expect(result.current).toBeTruthy();
    });

});