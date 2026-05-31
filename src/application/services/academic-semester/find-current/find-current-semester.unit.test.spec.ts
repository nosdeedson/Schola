import { AcademicSemesterEntity } from '../../../../infrastructure/entities/academic-semester/academic.semester.entity';
import { MockRepositoriesForUnitTest } from '../../../../../tests/mocks/mock-repositories/mockRepositories';
import { FindCurrentSemesterService } from './find-current-semester.service';
import { mockSemester } from "../../../../../tests/mocks/domain/semester.mocks";
import { SystemError } from '../../@shared/system-error';

describe('FindCurrentSemesterService unit test', () => {

    it('should find the current semester', async () => {
        const semester = mockSemester()
        const semesterEntity = AcademicSemesterEntity.toEntity(semester);
        const repository = MockRepositoriesForUnitTest.mockRepositories();
        repository.findCurrentSemester = jest.fn().mockImplementation(() => Promise.resolve(semesterEntity));
        const service = new FindCurrentSemesterService(repository);
        const result = await service.execute();
        expect(result).toBeInstanceOf(AcademicSemesterEntity);
        expect(result.current).toBeTruthy();
    });

    it('should not find the current semester', async () => {
        const repository = MockRepositoriesForUnitTest.mockRepositories();
        repository.findCurrentSemester = jest.fn().mockImplementation(() => Promise.resolve(null));
        const service = new FindCurrentSemesterService(repository);
        await expect(service.execute()).rejects.toMatchObject(new SystemError([
            { context: 'semester', message: 'semester not found' }],
            404
        ));
    });
});
