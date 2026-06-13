import { RatingEntity } from "../../../../infrastructure/entities/rating/rating.entity";
import { DeleteRatingService } from "./delete.rating.service";
import { RatingRepository } from "../../../../infrastructure/repositories/rating/rating.repository";
import { StudentEntity } from "../../../../infrastructure/entities/student/student.entity";
import { StudentRepository } from "../../../../infrastructure/repositories/student/student.repository";
import { AcademicSemesterEntity } from "../../../../infrastructure/entities/academic-semester/academic.semester.entity";
import { AcademicSemesterRepository } from "../../../../infrastructure/repositories/academic-semester/academic-semester.repository";
import { Repository } from "typeorm";
import { mockSemester } from "../../../../../tests/mocks/domain/semester.mocks";
import { mockRating } from "../../../../../tests/mocks/domain/rating.mocks";
import { TestDataSource } from "../../../../infrastructure/repositories/config-test/test.datasource";
import { RatingMapper } from "@/infrastructure/mappers/rating/rating-mapper";
import { StudentMapper } from "@/infrastructure/mappers/student/student-mapper";
import { AcademicSemesterMapper } from "@/infrastructure/mappers/semester/academic-semester-mapper";
import { AcademicSemester } from "@/domain/academc-semester/academic.semester";
import { Rating } from "@/domain/rating/rating";
import { Student } from "@/domain/student/student";

describe('Delete rating domain service integration tests', () => {

    let ratingEntity: Repository<RatingEntity>;
    let ratingRepository: RatingRepository;

    let studentEntity: Repository<StudentEntity>;
    let studentRepository: StudentRepository;

    let semesterEntity: Repository<AcademicSemesterEntity>;
    let semesterRepository: AcademicSemesterRepository;

    beforeAll(async () => {
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
    })

    it('should not throw an error while trying to deleting a rating', async () => {
        let semester = mockSemester();
        let rating = mockRating({ quarter: semester.firstQuarter });
        let student = rating.getStudent();
        let studentEntity = StudentMapper.fromDomain(student);
        expect(await studentRepository.create(studentEntity)).toBeInstanceOf(Student);

        let semesterEntity = AcademicSemesterMapper.fromDomain(semester);
        expect(await semesterRepository.create(semesterEntity)).toBeInstanceOf(AcademicSemester);

        let ratingEntity = RatingMapper.fromDomain(rating);
        expect(await ratingRepository.create(ratingEntity)).toBeInstanceOf(Rating);

        const service = new DeleteRatingService(ratingRepository);

        let wantedid = 'ecf7719b-4b88-4682-94d9-458321a07459';

        expect(await service.execute(wantedid)).toBe(void 0);

    }, 5000);

    it('should delete a rating', async () => {
        let semester = mockSemester();
        let rating = mockRating({ quarter: semester.firstQuarter });
        let student = rating.getStudent();
        let studentEntity = StudentMapper.fromDomain(student);
        expect(await studentRepository.create(studentEntity)).toBeInstanceOf(Student);

        let semesterEntity = AcademicSemesterMapper.fromDomain(semester);
        expect(await semesterRepository.create(semesterEntity)).toBeInstanceOf(AcademicSemester);

        let ratingEntity = RatingMapper.fromDomain(rating);
        expect(await ratingRepository.create(ratingEntity)).toBeInstanceOf(Rating);

        const service = new DeleteRatingService(ratingRepository);

        let wantedid = rating.getId();

        expect(await service.execute(wantedid)).toBe(void 0);

    });

});
