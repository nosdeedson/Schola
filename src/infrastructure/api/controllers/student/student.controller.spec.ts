import { Test, TestingModule } from '@nestjs/testing';
import { StudentController } from './student.controller';
import { setEnv } from '@/infrastructure/__mocks__/env.mock';
import { RepositoryFactoryService } from '@/infrastructure/factory/repositiry-factory/repository-factory.service';
import { FindStudentRantingUsecase } from '@/application/usecases/find-student-rating/find-student-rating-usecase';
import { DataBaseConnectionModule } from '@/infrastructure/data-base-connection/data-base-connection.module';
import { mockStudentRatingUsecaseDtoOut } from '../../../../../tests/mocks/usecases/student-rating-usecase-dto.mocks';
import { mockRating } from '../../../../../tests/mocks/domain/rating.mocks';
import { RatingEntity } from '@/infrastructure/entities/rating/rating.entity';
import { TransferStudentsAnotherClassUsecase } from '@/application/usecases/transfer-students/transfer-students-another-class.usecase';

describe('StudentController', () => {
  let controller: StudentController;
  let module: TestingModule;

  beforeEach(async () => {
    setEnv();
    module = await Test.createTestingModule({
      controllers: [StudentController],
      providers: [
        FindStudentRantingUsecase,
        TransferStudentsAnotherClassUsecase,
      ],
      imports: [
        DataBaseConnectionModule
      ]
    }).compile();

    controller = module.get<StudentController>(StudentController);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  })

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should not find a rating', async () => {
    const wanteId = '12345';
    const ratingStudent = jest.spyOn(FindStudentRantingUsecase.prototype, 'execute')
      .mockResolvedValue(null);
    const result = await controller.findRatingStudent(wanteId);
    expect(result).toBeNull();
    expect(ratingStudent).toHaveBeenCalledTimes(1);
    expect(ratingStudent).toHaveBeenCalledWith(wanteId)
  });

  it('should find a rating', async () => {
    const ratingEntity = RatingEntity.toRatingEntity(mockRating());
    const wantedId = ratingEntity.id;
    const out = mockStudentRatingUsecaseDtoOut(ratingEntity);
    const ratingStudentUsecase = jest.spyOn(FindStudentRantingUsecase.prototype, 'execute')
      .mockResolvedValue(out);
    const result = await controller.findRatingStudent(wantedId);
    expect(result).toBeDefined();
    expect(result.id).toBe(ratingEntity.id);
    expect(result.studentId).toBe(out.studentId);
    expect(result.comments).toBe(out.comments);
    expect(result.studentId).toBe(out.studentId);
    expect(ratingStudentUsecase).toHaveBeenCalledTimes(1);
    expect(ratingStudentUsecase).toHaveBeenCalledWith(wantedId);
  });
});
