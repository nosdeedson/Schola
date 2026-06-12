import { MockRepositoriesForUnitTest } from "../../../../../tests/mocks/mock-repositories/mockRepositories"
import { AcademicSemesterEntity } from "../../../../infrastructure/entities/academic-semester/academic.semester.entity";
import { UpdateAcademicSemesterDto } from "./udpate.academic-semester.dto";
import { UpdateAcademicSemesterService } from "./update.academic-semester.service";
import { mockSemester } from '../../../../../tests/mocks/domain/semester.mocks';
import { AcademicSemesterMapper } from "@/infrastructure/mappers/semester/academic-semester-mapper";

describe('AcademicSemester unit tests', () => {

    afterEach(async () => {
        jest.clearAllMocks();
    })

    it('should update semester changing secondQuarter to current', async () => {
        const semesterRepository = MockRepositoriesForUnitTest.mockRepositories();
        const semester = mockSemester({ currentSemester: true });
        const dto = new UpdateAcademicSemesterDto({
            id: semester.getId(),
            updatingQuarter: true,
            updatingSemester: false,
        });
        semesterRepository.find = jest.fn()
            .mockReturnValue(await Promise.resolve(semester));
        semesterRepository.update = jest.fn()
            .mockResolvedValue(void 0);

        const service = new UpdateAcademicSemesterService(semesterRepository);
        expect(await service.execute(dto)).toBe(void 0);
        expect(semesterRepository.update).toHaveBeenCalled();
        expect(semesterRepository.update).toHaveBeenCalledWith(AcademicSemesterMapper.fromDomain(semester));
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
        await expect(service.execute(dto)).rejects.toMatchObject({
            errors: [
                { context: 'semester', message: 'semester not found' }
            ]
        });
        expect(semesterRepository.update).toHaveBeenCalledTimes(0);
    });
});
