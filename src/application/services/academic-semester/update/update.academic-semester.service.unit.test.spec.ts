import { MockRepositoriesForUnitTest } from "../../../../infrastructure/__mocks__/mockRepositories"
import { AcademicSemesterEntity } from "../../../../infrastructure/entities/academic-semester/academic.semester.entity";
import { UpdateAcademicSemesterDto } from "./udpate.academic-semester.dto";
import { UpdateAcademicSemesterService } from "./update.academic-semester.service";
import { mockSemester } from '../../../../../tests/mocks/domain/semester.mocks';

describe('AcademicSemester unit tests', () => {

    afterEach(async () => {
        jest.clearAllMocks();
    })

    it('should update semester changing secondQuarter to current', async () => {
        const semesterRepository = MockRepositoriesForUnitTest.mockRepositories();
        const entity = AcademicSemesterEntity.toEntity(mockSemester({ currentSemester: true }));
        const dto = new UpdateAcademicSemesterDto({
            id: entity.id,
            updatingQuarter: true,
            updatingSemester: false,
        });
        semesterRepository.find = jest.fn()
            .mockReturnValue(await Promise.resolve(entity));
        semesterRepository.update = jest.fn()
            .mockResolvedValue(void 0);

        const service = new UpdateAcademicSemesterService(semesterRepository);
        expect(await service.execute(dto)).toBe(void 0);
        expect(semesterRepository.update).toHaveBeenCalled();
        expect(semesterRepository.update).toHaveBeenCalledWith(entity);
        expect(semesterRepository.find).toHaveBeenCalledWith(dto.id);
    });

    it('if semester not found should throw error', async () => {
        const semesterRepository = MockRepositoriesForUnitTest.mockRepositories();
        const dto = new UpdateAcademicSemesterDto({
            id: '123',
            updatingQuarter: true,
            updatingSemester: false,
        });
        semesterRepository.find = jest.fn()
            .mockReturnValue(await Promise.resolve(null));
        semesterRepository.update = jest.fn()
            .mockResolvedValue(void 0);

        const service = new UpdateAcademicSemesterService(semesterRepository);
        await expect( service.execute(dto)).rejects.toMatchObject({errors: [
            {context: 'semester', message: 'semester not found'}
        ]});
        expect(semesterRepository.update).toHaveBeenCalledTimes(0);
    });
});