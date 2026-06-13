import { Repository } from "typeorm";
import { TestDataSource } from "../../../../infrastructure/repositories/config-test/test.datasource";
import { AcademicSemesterEntity } from "../../../../infrastructure/entities/academic-semester/academic.semester.entity";
import { RatingEntity } from "../../../../infrastructure/entities/rating/rating.entity";
import { StudentEntity } from "../../../../infrastructure/entities/student/student.entity";
import { AcademicSemesterRepository } from "../../../../infrastructure/repositories/academic-semester/academic-semester.repository";
import { RatingRepository } from "../../../../infrastructure/repositories/rating/rating.repository";
import { StudentRepository } from "../../../../infrastructure/repositories/student/student.repository";
import { FindRatingService } from './find.rating.service';
import { mockSemester } from "../../../../../tests/mocks/domain/semester.mocks";
import { mockRating } from "../../../../../tests/mocks/domain/rating.mocks";
import { RatingMapper } from "@/infrastructure/mappers/rating/rating-mapper";
import { AcademicSemesterMapper } from "@/infrastructure/mappers/semester/academic-semester-mapper";
import { StudentMapper } from "@/infrastructure/mappers/student/student-mapper";
import { Student } from "@/domain/student/student";
import { AcademicSemester } from "@/domain/academc-semester/academic.semester";
import { Rating } from "@/domain/rating/rating";

describe('find rating integration tests', () => {

    let ratingEntity: Repository<RatingEntity>;
    let ratingRepository: RatingRepository;

    let studentEntity: Repository<StudentEntity>;
    let studentRepository: StudentRepository;

    let semesterEntity: Repository<AcademicSemesterEntity>;
    let semesterRepository: AcademicSemesterRepository;

    beforeEach(async () => {
        ratingEntity = TestDataSource.getRepository(RatingEntity);
        ratingRepository = new RatingRepository(TestDataSource);
        studentEntity = TestDataSource.getRepository(StudentEntity);
        studentRepository = new StudentRepository(TestDataSource);
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

    it('should throw a systemError', async () => {
        let semester = mockSemester();
        let rating = mockRating({ quarter: semester.firstQuarter });
        let student = rating.getStudent();
        let studentEntity = StudentMapper.fromDomain(student);
        expect(await studentRepository.create(studentEntity)).toBeInstanceOf(Student);

        let semesterEntity = AcademicSemesterMapper.fromDomain(semester);
        expect(await semesterRepository.create(semesterEntity)).toBeInstanceOf(AcademicSemester);

        let ratingEntity = RatingMapper.fromDomain(rating);
        expect(await ratingRepository.create(ratingEntity)).toBeInstanceOf(Rating);

        let wantedid = 'b4145be7-0fed-4a64-8a45-24bdd594cd20';
        const service = new FindRatingService(ratingRepository);
        await expect(service.execute(wantedid)).rejects.toMatchObject({
            errors:
                [{ context: 'rating', message: 'Not found' }]
        });
    });

    it('should find a rating', async () => {
        let semester = mockSemester();
        let rating = mockRating({ quarter: semester.firstQuarter });
        let student = rating.getStudent();
        let studentEntity = StudentMapper.fromDomain(student);
        expect(await studentRepository.create(studentEntity)).toBeInstanceOf(Student);

        let semesterEntity = AcademicSemesterMapper.fromDomain(semester);
        expect(await semesterRepository.create(semesterEntity)).toBeInstanceOf(AcademicSemester);

        let ratingEntity = RatingMapper.fromDomain(rating);
        expect(await ratingRepository.create(ratingEntity)).toBeInstanceOf(Rating);

        let wantedid = rating.getId();
        const service = new FindRatingService(ratingRepository);
        let result = await service.execute(wantedid);
        expect(result).toBeDefined();
        expect(result.id).toBe(rating.getId());
    });
});
