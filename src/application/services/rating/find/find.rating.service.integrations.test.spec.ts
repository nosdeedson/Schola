import { Repository } from "typeorm";
import { TestDataSource } from "../../../../infrastructure/repositories/config-test/test.datasource";
import { DomainMocks } from "../../../../infrastructure/__mocks__/mocks";
import { AcademicSemesterEntity } from "../../../../infrastructure/entities/academic-semester/academic.semester.entity";
import { RatingEntity } from "../../../../infrastructure/entities/rating/rating.entity";
import { StudentEntity } from "../../../../infrastructure/entities/student/student.entity";
import { AcademicSemesterRepository } from "../../../../infrastructure/repositories/academic-semester/academic-semester.repository";
import { RatingRepositiry } from "../../../../infrastructure/repositories/rating/rating.repository";
import { StudentRepository } from "../../../../infrastructure/repositories/student/student.repository";
import { FindRatingService } from './find.rating.service';
import { mockSemester } from "../../../../../tests/mocks/domain/semester.mocks";
import { mockRating } from "../../../../../tests/mocks/domain/rating.mocks";

describe('find rating integration tests', () => {

    let ratingEntity: Repository<RatingEntity>;
    let ratingRepository: RatingRepositiry;

    let studentEntity: Repository<StudentEntity>;
    let studentRepository: StudentRepository;

    let semesterEntity: Repository<AcademicSemesterEntity>;
    let semesterRepository: AcademicSemesterRepository;

    beforeEach(async () => {
        ratingEntity = TestDataSource.getRepository(RatingEntity);
        ratingRepository = new RatingRepositiry(ratingEntity, TestDataSource);
        studentEntity = TestDataSource.getRepository(StudentEntity);
        studentRepository = new StudentRepository(studentEntity, TestDataSource);
        semesterEntity = TestDataSource.getRepository(AcademicSemesterEntity);
        semesterRepository = new AcademicSemesterRepository(semesterEntity, TestDataSource);
    });

    afterEach(async () => {
        jest.clearAllMocks();
    })

    it('entities and repositories must be instantiated', async () => {
        expect(ratingEntity).toBeDefined()
        expect(ratingRepository).toBeDefined()
        expect(studentEntity).toBeDefined();
        expect(studentRepository).toBeDefined()
        expect(semesterEntity).toBeDefined();
        expect(semesterRepository).toBeDefined();
    });

    it('should throw a systemError', async () => {
        let student = DomainMocks.mockStudent();
        let studentEntity = StudentEntity.toStudentEntity(student);
        expect(await studentRepository.create(studentEntity)).toBeInstanceOf(StudentEntity);

        let semester = mockSemester();
        let semesterEntity = AcademicSemesterEntity.toEntity(semester);
        expect(await semesterRepository.create(semesterEntity)).toBeInstanceOf(AcademicSemesterEntity);

        let rating = mockRating({ quarter: semester.firstQuarter });
        let ratingEntity = RatingEntity.toRatingEntity(rating);
        expect(await ratingRepository.create(ratingEntity)).toBeInstanceOf(RatingEntity);

        let wantedid = 'b4145be7-0fed-4a64-8a45-24bdd594cd20';
        const service = new FindRatingService(ratingRepository);
        await expect(service.execute(wantedid)).rejects.toMatchObject({
            errors:
                [{ context: 'rating', message: 'Not found' }]
        });
    });

    it('should find a rating', async () => {
        let student = DomainMocks.mockStudent();
        let studentEntity = StudentEntity.toStudentEntity(student);
        expect(await studentRepository.create(studentEntity)).toBeInstanceOf(StudentEntity);

        let semester = mockSemester();
        let semesterEntity = AcademicSemesterEntity.toEntity(semester);
        expect(await semesterRepository.create(semesterEntity)).toBeInstanceOf(AcademicSemesterEntity);

        let rating = mockRating({ quarter: semester.firstQuarter });
        let ratingEntity = RatingEntity.toRatingEntity(rating);
        expect(await ratingRepository.create(ratingEntity)).toBeInstanceOf(RatingEntity);

        let wantedid = rating.getId();
        const service = new FindRatingService(ratingRepository);
        let result = await service.execute(wantedid);
        expect(result).toBeDefined();
        expect(result.id).toBe(rating.getId());
    })
});
