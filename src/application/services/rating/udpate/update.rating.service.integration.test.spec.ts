import { Repository } from "typeorm";
import { Grade } from "../../../../domain/enum/grade/grade";
import { DomainMocks } from "../../../../infrastructure/__mocks__/mocks";
import { AcademicSemesterEntity } from "../../../../infrastructure/entities/academic-semester/academic.semester.entity";
import { RatingEntity } from "../../../../infrastructure/entities/rating/rating.entity";
import { StudentEntity } from "../../../../infrastructure/entities/student/student.entity";
import { AcademicSemesterRepository } from "../../../../infrastructure/repositories/academic-semester/academic-semester.repository";
import { RatingRepositiry } from "../../../../infrastructure/repositories/rating/rating.repository";
import { StudentRepository } from "../../../../infrastructure/repositories/student/student.repository";
import { UpdateRatingDto } from "./udpate.rating.dto";
import { UpdateRatingService } from './update.rating.service';
import { mockSemester } from "../../../../../tests/mocks/domain/semester.mocks";
import { mockRating } from "../../../../../tests/mocks/domain/rating.mocks";
import { TestDataSource } from "../../../../infrastructure/repositories/config-test/test.datasource";


describe('update rating service integration tests', () => {

    let ratingEntity: Repository<RatingEntity>;
    let ratingRepository: RatingRepositiry;

    let studentEntity: Repository<StudentEntity>;
    let studentRepository: StudentRepository;

    let semesterEntity: Repository<AcademicSemesterEntity>;
    let semesterRepository: AcademicSemesterRepository;

    beforeAll(async () => {
        ratingEntity = TestDataSource.getRepository(RatingEntity);
        ratingRepository = new RatingRepositiry(ratingEntity, TestDataSource);
        studentEntity = TestDataSource.getRepository(StudentEntity);
        studentRepository = new StudentRepository(studentEntity, TestDataSource);
        semesterEntity = TestDataSource.getRepository(AcademicSemesterEntity);
        semesterRepository = new AcademicSemesterRepository(TestDataSource);
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

    it('should throw a SystemError if rating not found', async () => {
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

        let input = new UpdateRatingDto(wantedid, Grade.GOOD, Grade.GOOD, Grade.GOOD, Grade.GOOD, Grade.GOOD, Grade.GOOD, Grade.GOOD);
        const service = new UpdateRatingService(ratingRepository);
        await expect(service.execute(input)).rejects.toMatchObject({
            errors: [{ "context": "rating", "message": "Not found" }]
        });
    })

    it('should update a rating', async () => {
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

        let input = new UpdateRatingDto(wantedid, Grade.GOOD, Grade.GOOD, Grade.GOOD, Grade.GOOD, Grade.GOOD, Grade.GOOD, Grade.GOOD);
        const service = new UpdateRatingService(ratingRepository);
        expect(await service.execute(input)).toBe(void 0);
        let result = await ratingRepository.find(wantedid);
        expect(result.listing).toBe(input.listing);
        expect(result.writing).toBe(input.writing);
        expect(result.reading).toBe(input.reading);
        expect(result.speaking).toBe(input.speaking);
        expect(result.homework).toBe(input.homework);
        expect(result.grammar).toBe(input.grammar);
        expect(result.vocabulary).toBe(input.vocabulary);
        expect(result.updatedAt.getTime()).toBeGreaterThan(rating.getUpdatedAt().getTime());
    });

});
