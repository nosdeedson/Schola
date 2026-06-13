import { AcademicSemesterEntity } from "@/infrastructure/entities/academic-semester/academic.semester.entity";
import { RatingEntity } from "@/infrastructure/entities/rating/rating.entity";
import { StudentEntity } from "@/infrastructure/entities/student/student.entity";
import { AcademicSemesterRepository } from "@/infrastructure/repositories/academic-semester/academic-semester.repository";
import { TestDataSource } from "@/infrastructure/repositories/config-test/test.datasource";
import { RatingRepository } from "@/infrastructure/repositories/rating/rating.repository";
import { StudentRepository } from "@/infrastructure/repositories/student/student.repository";
import { Repository } from "typeorm";
import { mockStudent } from "../../../../../tests/mocks/domain/student.mocks";
import { FindRatingByStudent } from "./find-rating-by-student.service";
import { mockQuarter } from "../../../../../tests/mocks/domain/quarter.mocks";
import { mockSemester } from "../../../../../tests/mocks/domain/semester.mocks";
import { Rating } from "@/domain/rating/rating";
import { Grade } from "@/domain/enum/grade/grade";
import { AcademicSemesterMapper } from "@/infrastructure/mappers/semester/academic-semester-mapper";
import { RatingMapper } from "@/infrastructure/mappers/rating/rating-mapper";
import { StudentMapper } from "@/infrastructure/mappers/student/student-mapper";
import { Student } from "@/domain/student/student";
import { AcademicSemester } from "@/domain/academc-semester/academic.semester";

describe('FindRatingByStudent', () => {

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
    });

    it('entities and repositories must be instantiated', async () => {
        expect(ratingEntity).toBeDefined()
        expect(ratingRepository).toBeDefined()
        expect(studentEntity).toBeDefined();
        expect(studentRepository).toBeDefined()
        expect(semesterEntity).toBeDefined();
        expect(semesterRepository).toBeDefined();
    });

    it('should return null if student does not have rating', async () => {
        let student = mockStudent();
        let studentEntity = StudentMapper.fromDomain(student);
        expect(await studentRepository.create(studentEntity)).toBeInstanceOf(Student);
        let wantedid = student.getId();
        const findRatingByStudent = new FindRatingByStudent(ratingRepository);
        const result = await findRatingByStudent.findRatingByStudent(wantedid);
        expect(result).toHaveLength(0);
    });

    it('should find ratings of the student', async () => {
        const firstQuarter = mockQuarter({ currentQuarter: true });
        const semester = mockSemester({ firstQuarter: firstQuarter });
        const semesterEntity = AcademicSemesterMapper.fromDomain(semester);
        expect(await semesterRepository.create(semesterEntity)).toBeInstanceOf(AcademicSemester);
        let student = mockStudent();
        let studentEntity = StudentMapper.fromDomain(student);
        expect(await studentRepository.create(studentEntity)).toBeInstanceOf(Student);

        let rating = new Rating(semester.firstQuarter, student, new Date(), Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD);
        let ratingEntity = RatingMapper.fromDomain(rating);
        expect(await ratingRepository.create(ratingEntity)).toBeInstanceOf(Rating);

        const findRatingByStudent = new FindRatingByStudent(ratingRepository);
        const result = await findRatingByStudent.findRatingByStudent(student.getId());
        expect(result).toBeDefined();
        expect(result[0].getStudent().getId()).toBe(student.getId());
        expect(result[0].getId()).toBe(rating.getId());
        expect(result[0].getQuarter().getId()).toBe(semester.firstQuarter.getId());
    });
});
