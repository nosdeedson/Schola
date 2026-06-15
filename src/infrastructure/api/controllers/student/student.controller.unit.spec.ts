import { Test, TestingModule } from '@nestjs/testing';
import { StudentController } from './student.controller';
import { setEnv } from '../../../../../tests/mocks/env/env.mock';
import { FindStudentRantingUsecase } from '@/application/usecases/find-student-rating/find-student-rating-usecase';
import { mockStudentRatingUsecaseDtoOut } from '../../../../../tests/mocks/usecases/student-rating-usecase-dto.mocks';
import { mockRating } from '../../../../../tests/mocks/domain/rating.mocks';
import { RatingEntity } from '@/infrastructure/entities/rating/rating.entity';
import { TransferStudentsAnotherClassUsecase } from '@/application/usecases/transfer-students/transfer-students-another-class.usecase';
import { mockTransferStudendtsRequestDto } from '../../../../../tests/mocks/controller/transfer-students-request-dto-mock';
import { NotFoundException } from '@nestjs/common';
import { mockComment } from '../../../../../tests/mocks/domain/comment.mocks';
import { TransferStudendtsRequestDto } from './dto/transfer-students-request-dto';
import { RatingMapper } from '@/infrastructure/mappers/rating/rating-mapper';
import { CommentMapper } from '@/infrastructure/mappers/comment/comment-mapper';

describe('StudentController', () => {
  let controller: StudentController;
  let module: TestingModule;
  let findStudentRatingUsecase: { execute: jest.Mock; }
  let transferStudentUsecase: { execute: jest.Mock; }

  beforeAll(async () => {
    setEnv();
    module = await Test.createTestingModule({
      controllers: [StudentController],
      providers: [
        {
          provide: FindStudentRantingUsecase,
          useValue: { execute: jest.fn() }
        },
        {
          provide: TransferStudentsAnotherClassUsecase,
          useValue: { execute: jest.fn() }
        }
      ],
    }).compile();

    controller = module.get<StudentController>(StudentController);
    findStudentRatingUsecase = module.get(FindStudentRantingUsecase);
    transferStudentUsecase = module.get(TransferStudentsAnotherClassUsecase)
  });

  afterEach(async () => {
    jest.clearAllMocks();
  })

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should not find a rating', async () => {
    const wanteId = '12345';
    findStudentRatingUsecase.execute.mockResolvedValue(null)
    const result = await controller.findRatingStudent(wanteId);
    expect(result).toBeNull();
    expect(findStudentRatingUsecase.execute).toHaveBeenCalledTimes(1);
    expect(findStudentRatingUsecase.execute).toHaveBeenCalledWith(wanteId)
  });

  it('should find a rating', async () => {
    const rating = mockRating();
    const ratingEntity = RatingMapper.fromDomain(rating);
    ratingEntity.comments = CommentMapper.toCommentsEntity([mockComment()], rating);
    const wantedId = ratingEntity.id;
    const out = mockStudentRatingUsecaseDtoOut(ratingEntity);
    findStudentRatingUsecase.execute.mockResolvedValue([out])
    const result = await controller.findRatingStudent(wantedId);
    expect(result).toBeDefined();
    expect(result[0].id).toBe(ratingEntity.id);
    expect(result[0].studentId).toBe(out.studentId);
    expect(result[0].comments).toBe(out.comments);
    expect(result[0].studentId).toBe(out.studentId);
    expect(findStudentRatingUsecase.execute).toHaveBeenCalledTimes(1);
    expect(findStudentRatingUsecase.execute).toHaveBeenCalledWith(wantedId);
  });

  it('should throw an error if class not found', async () => {
    const dto = mockTransferStudendtsRequestDto();
    transferStudentUsecase.execute.mockRejectedValue(new NotFoundException('class not found'));
    await expect(controller.transferStudentsAnotherClass(dto))
      .rejects.toThrow(NotFoundException);
    expect(transferStudentUsecase.execute).toHaveBeenCalledTimes(1);
    expect(transferStudentUsecase.execute).toHaveBeenCalledWith(TransferStudendtsRequestDto.toUsecaseDto(dto));
  });

  it('should update students', async () => {
    const dto = mockTransferStudendtsRequestDto();
    transferStudentUsecase.execute.mockResolvedValue(void 0);
    expect(await controller.transferStudentsAnotherClass(dto)).toBe(void 0);
    expect(transferStudentUsecase.execute).toHaveBeenCalledTimes(1);
    expect(transferStudentUsecase.execute).toHaveBeenCalledWith(TransferStudendtsRequestDto.toUsecaseDto(dto));
  });
});
