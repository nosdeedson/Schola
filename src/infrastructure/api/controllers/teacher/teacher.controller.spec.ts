import { Test, TestingModule } from '@nestjs/testing';
import { TeacherController } from './teacher.controller';
import { TeacherListClassesUsecase } from '../../../../application/usecases/teacher-list-classes-usecase/teacher-list-classes-usecase'
import { RepositoryFactoryService } from '../../../factory/repositiry-factory/repository-factory.service'
import { DataBaseConnectionModule } from '../../../data-base-connection/data-base-connection.module';
import { setEnv } from '../../../../../tests/mocks/env/env.mock';
import { ClassesOfTeacherDto } from '../../../../application/usecases/teacher-list-classes-usecase/classes-of-teacher-dto';
import { mockClassesOfTeacherDto, mockTeacherClassRatingDto } from '../../../__mocks__/mock-dtos/mock-dtos';
import { FindTeacherClassRatingUsecase } from '../../../../application/usecases/find-teacher-class-rating-usecase/find-teacher-class-rating-usecase';
import { TeacherClassRatingDto } from '../../../../application/usecases/find-teacher-class-rating-usecase/find-teacher-class-rating-dto';

describe('TeacherController', () => {
  let controller: TeacherController;
  let module: TestingModule;

  beforeAll(async () => {
    setEnv();
    module = await Test.createTestingModule({
      controllers: [TeacherController],
      providers: [
        TeacherListClassesUsecase,
        RepositoryFactoryService,
        FindTeacherClassRatingUsecase,
      ],
      imports: [DataBaseConnectionModule]
    }).compile();

    controller = module.get<TeacherController>(TeacherController);
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
      const listClassesOfTeacher = jest.spyOn(TeacherListClassesUsecase.prototype, 'execute')
        .mockReturnValue(Promise.resolve(listOfClasses));

      const teacherId = 'a16703c8-b4d8-402a-90c1-02ce0314c36f';

      const result = await controller.findTeacherClasses(teacherId);
      expect(result).toBeDefined();
      expect(result).toHaveLength(0);
      expect(result).toEqual([]);
      expect(listClassesOfTeacher).toHaveBeenCalledTimes(1);
      expect(listClassesOfTeacher).toHaveBeenCalledWith(teacherId);
    });

    it('should find one class', async () => {
      const listOfClasses = mockClassesOfTeacherDto();
      const listClassesOfTeacher = jest.spyOn(TeacherListClassesUsecase.prototype, 'execute')
        .mockReturnValue(Promise.resolve([listOfClasses]));

      const teacherId = '680e0134-7619-49ac-b0d8-31d0c31558fa';

      const result = await controller.findTeacherClasses(teacherId);
      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0].students).toHaveLength(2);
      expect(result[0].daysOfClass).toHaveLength(2);
      expect(listClassesOfTeacher).toHaveBeenCalledTimes(1);
      expect(listClassesOfTeacher).toHaveBeenCalledWith(teacherId);
    });
  });

  describe('FindTeacherClassRatingUsecase', () => {

    it('should return a TeacherClassRatingDto empty', async () => {
      const dto =  new TeacherClassRatingDto(null as any, null as any)
      const usecase = jest.spyOn(FindTeacherClassRatingUsecase.prototype, 'execute')
        .mockResolvedValue(Promise.resolve(dto));
      const teacherId = '560774b6-3366-474f-84ca-54a83bd7eb31';
      const classId = '8480c18c-d4ae-4b18-a53d-e4a5e9ccb409';
      const result = await controller.findTeacherClassRating(teacherId, classId);
      expect(result).toBeInstanceOf(TeacherClassRatingDto);
      expect(result.teacherId).toBeUndefined();
      expect(result.classId).toBeUndefined();
      expect(usecase).toHaveBeenCalledTimes(1);
      expect(usecase).toHaveBeenCalledWith(teacherId, classId);
    });

    it('should return a valid TeacherClassRatingDto', async () => {
      const dto = mockTeacherClassRatingDto() as TeacherClassRatingDto;
      const usecase = jest.spyOn(FindTeacherClassRatingUsecase.prototype, 'execute')
        .mockResolvedValue(Promise.resolve(dto));
      const teacherId = '560774b6-3366-474f-84ca-54a83bd7eb31';
      const classId = '8480c18c-d4ae-4b18-a53d-e4a5e9ccb409';
      const result = await controller.findTeacherClassRating(teacherId, classId);
      expect(result.teacherId).toBe(dto.teacherId);
      expect(result.classId).toBe(dto.classId);
      expect(result.students).toStrictEqual(dto.students);
      expect(usecase).toHaveBeenCalledTimes(1);
      expect(usecase).toHaveBeenCalledWith(teacherId, classId);
    });

  });

});
