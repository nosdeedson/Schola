import { Test, TestingModule } from '@nestjs/testing';
import { TeacherController } from './teacher.controller';
import { TeacherListClassesUsecase } from '../../../../application/usecases/teacher-list-classes-usecase/teacher-list-classes-usecase'
import { RepositoryFactoryService } from '../../../factory/repositiry-factory/repository-factory.service'
import { DataBaseConnectionModule } from '../../../data-base-connection/data-base-connection.module';
import { setEnv } from '../../../../../tests/mocks/env/env.mock';
import { ClassesOfTeacherDto } from '../../../../application/usecases/teacher-list-classes-usecase/classes-of-teacher-dto';
import { mockClassesOfTeacherDto, mockTeacherClassRatingDto } from '../../../../../tests/mocks/mock-dtos/mock-dtos';
import { FindTeacherClassRatingUsecase } from '../../../../application/usecases/find-teacher-class-rating-usecase/find-teacher-class-rating-usecase';
import { TeacherClassRatingDto } from '../../../../application/usecases/find-teacher-class-rating-usecase/find-teacher-class-rating-dto';

describe('TeacherController', () => {
  let controller: TeacherController;
  let module: TestingModule;
  let teacherListClassesUsecase: { execute: jest.Mock; }
  let findTeacherClassRatingUsecase: { execute: jest.Mock; }

  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [TeacherController],
      providers: [
        {
          provide: TeacherListClassesUsecase,
          useValue: { execute: jest.fn() }
        },
        {
          provide: FindTeacherClassRatingUsecase,
          useValue: { execute: jest.fn() }
        }
      ],
    }).compile();

    controller = module.get<TeacherController>(TeacherController);
    teacherListClassesUsecase = module.get(TeacherListClassesUsecase);
    findTeacherClassRatingUsecase = module.get(FindTeacherClassRatingUsecase);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  })

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('TeacherListClassesUsecase', () => {
    it('should return an empty array', async () => {
      const listOfClasses: ClassesOfTeacherDto[] = [];
      teacherListClassesUsecase.execute.mockResolvedValue(listOfClasses);
      const teacherId = 'a16703c8-b4d8-402a-90c1-02ce0314c36f';
      const result = await controller.findTeacherClasses(teacherId);
      expect(result).toBeDefined();
      expect(result).toHaveLength(0);
      expect(result).toEqual([]);
      expect(teacherListClassesUsecase.execute).toHaveBeenCalledTimes(1);
      expect(teacherListClassesUsecase.execute).toHaveBeenCalledWith(teacherId);
    });

    it('should find one class', async () => {
      const listOfClasses = mockClassesOfTeacherDto();
      teacherListClassesUsecase.execute.mockResolvedValue([listOfClasses]);
      const teacherId = '680e0134-7619-49ac-b0d8-31d0c31558fa';
      const result = await controller.findTeacherClasses(teacherId);
      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0].students).toHaveLength(2);
      expect(result[0].daysOfClass).toHaveLength(2);
      expect(teacherListClassesUsecase.execute).toHaveBeenCalledTimes(1);
      expect(teacherListClassesUsecase.execute).toHaveBeenCalledWith(teacherId);
    });
  });

  describe('FindTeacherClassRatingUsecase', () => {

    it('should return a TeacherClassRatingDto empty', async () => {
      const dto = new TeacherClassRatingDto(null as any, null as any);
      findTeacherClassRatingUsecase.execute.mockResolvedValue(dto);
      const teacherId = '560774b6-3366-474f-84ca-54a83bd7eb31';
      const classId = '8480c18c-d4ae-4b18-a53d-e4a5e9ccb409';
      const result = await controller.findTeacherClassRating(teacherId, classId);
      expect(result).toBeInstanceOf(TeacherClassRatingDto);
      expect(result.teacherId).toBeUndefined();
      expect(result.classId).toBeUndefined();
      expect(findTeacherClassRatingUsecase.execute).toHaveBeenCalledTimes(1);
      expect(findTeacherClassRatingUsecase.execute).toHaveBeenCalledWith(teacherId, classId);
    });

    it('should return a valid TeacherClassRatingDto', async () => {
      const dto = mockTeacherClassRatingDto() as TeacherClassRatingDto;
      findTeacherClassRatingUsecase.execute.mockResolvedValue(dto);
      const teacherId = '560774b6-3366-474f-84ca-54a83bd7eb31';
      const classId = '8480c18c-d4ae-4b18-a53d-e4a5e9ccb409';
      const result = await controller.findTeacherClassRating(teacherId, classId);
      expect(result.teacherId).toBe(dto.teacherId);
      expect(result.classId).toBe(dto.classId);
      expect(result.students).toStrictEqual(dto.students);
      expect(findTeacherClassRatingUsecase.execute).toHaveBeenCalledTimes(1);
      expect(findTeacherClassRatingUsecase.execute).toHaveBeenCalledWith(teacherId, classId);
    });

  });

});
