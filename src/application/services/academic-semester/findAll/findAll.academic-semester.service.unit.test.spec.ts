import { MockRepositoriesForUnitTest } from "../../../../infrastructure/__mocks__/mockRepositories";
import { FindAllAcademicSemesterService } from './findAll.academic-semester.service';
import { mockSemester } from '../../../../../tests/mocks/domain/semester.mocks';
import { mockQuarter } from '../../../../../tests/mocks/domain/quarter.mocks';
import { AcademicSemesterEntity } from '../../../../infrastructure/entities/academic-semester/academic.semester.entity';

describe('findAll service unit tests', () =>{
    
    it('should receive an empty array of semester', async () =>{
        const semesterRepository = await MockRepositoriesForUnitTest.mockRepositories();
        semesterRepository.findAll = jest.fn()
            .mockImplementationOnce(() =>{
                return []
            })
        const service = new FindAllAcademicSemesterService(semesterRepository);
        let results = await service.execute();
        expect(results.all.length).toBe(0);
        expect(semesterRepository.findAll).toHaveBeenCalledTimes(1)
    })

    it('should receive an array of semester', async () =>{
        const semester1 = mockSemester({currentSemester: true});
        const entity1 = AcademicSemesterEntity.toEntity(semester1)
        const thirdQuarter = mockQuarter({
            currentQuarter: false,
            beginningDate: new Date(2026, 7, 1, 0, 0, 0),
            endingDate: new Date(2026, 8, 30, 23, 59, 59),
        });
        const forth = mockQuarter({
            currentQuarter: false,
            beginningDate: new Date(2026, 9, 1, 0, 0, 0),
            endingDate: new Date(2026, 10, 30, 23, 59, 59),
        });
        const semester2 = mockSemester({
            currentSemester: false,
            firstQuarter: thirdQuarter,
            secondQuarter: forth
        });
        const entity2 = AcademicSemesterEntity.toEntity(semester2);
        const semesterRepository = await MockRepositoriesForUnitTest.mockRepositories();
        semesterRepository.findAll = jest.fn()
            .mockImplementationOnce(() =>{
                return [
                    entity1,
                    entity2
                ]
            })
        const service = new FindAllAcademicSemesterService(semesterRepository);
        let results = await service.execute();
        expect(results.all.length).toBe(2);
        expect(results.all[0].id).toBe(semester1.getId());
        expect(results.all[1].id).toBe(semester2.getId());
        expect(semesterRepository.findAll).toHaveBeenCalledTimes(1)
    })
})