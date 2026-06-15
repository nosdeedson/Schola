import { CreateSemesterUsecase } from './create-semester-usecase';
import { mockCreateSemesterDto } from '../../../../../tests/mocks/domain-dto/create-semester-dto.mocks';
import { CreateAcademicSemesterService } from '../../../services/academic-semester/create/create.academic-semester.service';
import { SystemError } from '../../../services/@shared/system-error';
import { mockQuarterDto } from "../../../../../tests/mocks/domain-dto/quarter-dto.mocks";
import { ExceptionHandler } from "../../../../infrastructure/utils/exception-handler/exception-handler";
import { BadRequestException } from "@nestjs/common";
import { MockRepositoriesForUnitTest } from "../../../../../tests/mocks/mock-repositories/mockRepositories";

describe('CreateSemesterUsecase', () => {

    afterEach(async () => {
        jest.clearAllMocks();
    });

    it('should create a semester', async () => {
        const semesterRepository = MockRepositoriesForUnitTest.mockRepositories();
        const dto = mockCreateSemesterDto();
        const executeSpy = jest.spyOn(CreateAcademicSemesterService.prototype, 'execute')
            .mockResolvedValue(void 0);
        const createSemesterUsecase = new CreateSemesterUsecase(semesterRepository);
        expect(await createSemesterUsecase.execute(dto)).toBe(void 0);
        expect(executeSpy).toHaveBeenCalledWith(dto);
    });

    it('should handle errors', async () => {
        const semesterRepository = MockRepositoriesForUnitTest.mockRepositories();
        const dto = mockCreateSemesterDto({
            firstQuarter: mockQuarterDto({ beginningDate: new Date(), endingDate: new Date(), currentQuarter: true }),
            secondQuarter: mockQuarterDto({ beginningDate: new Date(), endingDate: new Date(), currentQuarter: true })
        });
        const executeSpy = jest.spyOn(CreateAcademicSemesterService.prototype, 'execute')
            .mockImplementation(async () => Promise.reject(
                new SystemError([{ context: 'academicSemester', message: 'Academic Semester not found' }], 404)
            ));
        const tratarErros = jest.spyOn(ExceptionHandler, 'exceptionHandler')
            .mockImplementation(async () => Promise.resolve(new BadRequestException('Academic Semester not found')));
        const createSemesterUsecase = new CreateSemesterUsecase(semesterRepository);
        await createSemesterUsecase.execute(dto);
        expect(executeSpy).toHaveBeenCalledWith(dto);
        expect(tratarErros).toHaveBeenCalled();
    });

});
