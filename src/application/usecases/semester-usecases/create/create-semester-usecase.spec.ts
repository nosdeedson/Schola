import { Test, TestingModule } from "@nestjs/testing";
import { CreateSemesterUsecase } from './create-semester-usecase';
import { setEnv } from "../../../../infrastructure/__mocks__/env.mock";
import { DataBaseConnectionModule } from "../../../../infrastructure/data-base-connection/data-base-connection.module";
import { RepositoryFactoryService } from "../../../../infrastructure/factory/repositiry-factory/repository-factory.service";
import { mockCreateSemesterDto } from '../../../../../tests/mocks/domain-dto/create-semester-dto.mocks';
import { CreateAcademicSemesterService} from '../../../services/academic-semester/create/create.academic-semester.service';
import { SystemError } from '../../../services/@shared/system-error';
import { mockQuarterDto } from "../../../../../tests/mocks/domain-dto/quarter-dto.mocks";
import { TrataErros } from "../../../../infrastructure/utils/trata-erros/trata-erros";
import { BadRequestException } from "@nestjs/common";

describe('CreateSemesterUsecase', () => {

    let createSemesterUsecase: CreateSemesterUsecase;
    let module: TestingModule;

    beforeEach(async () => {
        setEnv();
        module = await Test.createTestingModule({
            imports: [DataBaseConnectionModule],
            providers: [
                CreateSemesterUsecase,
                RepositoryFactoryService
            ],
        }).compile();

        createSemesterUsecase = module.get<CreateSemesterUsecase>(CreateSemesterUsecase);
    });

    afterEach(async () => {
        jest.clearAllMocks();
        // module.close();
    });

    it('should be defined', () => {
        expect(createSemesterUsecase).toBeDefined();
    });

    it('should create a semester', async () => {
        const dto = mockCreateSemesterDto();
        const executeSpy = jest.spyOn(CreateAcademicSemesterService.prototype, 'execute')
            .mockResolvedValue(void 0);
        await createSemesterUsecase.create(dto);
        expect(executeSpy).toHaveBeenCalledWith(dto);

    });

    it('should handle errors', async () => {
        const dto = mockCreateSemesterDto({
            firstQuarter: mockQuarterDto({beginningDate: new Date(), endingDate: new Date(), currentQuarter: true}),
            secondQuarter: mockQuarterDto({beginningDate: new Date(), endingDate: new Date(), currentQuarter: true})
        });
        const executeSpy = jest.spyOn(CreateAcademicSemesterService.prototype, 'execute')
            .mockImplementation(async () => Promise.reject(
                new SystemError([{context: 'academicSemester', message: 'Academic Semester not found'}])
            ));
        const tratarErros = jest.spyOn( TrataErros, 'tratarErrorsBadRequest')
            .mockImplementation(async () => Promise.resolve(new BadRequestException('Academic Semester not found')));
        await createSemesterUsecase.create(dto);
        expect(executeSpy).toHaveBeenCalledWith(dto);
        expect(tratarErros).toHaveBeenCalled();
    });

});