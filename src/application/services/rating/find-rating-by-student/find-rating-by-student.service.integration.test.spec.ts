import { AcademicSemesterEntity } from "@/infrastructure/entities/academic-semester/academic.semester.entity";
import { RatingEntity } from "@/infrastructure/entities/rating/rating.entity";
import { StudentEntity } from "@/infrastructure/entities/student/student.entity";
import { AcademicSemesterRepository } from "@/infrastructure/repositories/academic-semester/academic-semester.repository";
import { TestDataSource } from "@/infrastructure/repositories/config-test/test.datasource";
import { RatingRepositiry } from "@/infrastructure/repositories/rating/rating.repository";
import { StudentRepository } from "@/infrastructure/repositories/student/student.repository";
import { Repository } from "typeorm";
import { mockStudent } from "../../../../../tests/mocks/domain/student.mocks";
import { FindRatingByStudent } from "./find-rating-by-student.service";
import { mockQuarter } from "../../../../../tests/mocks/domain/quarter.mocks";
import { mockSemester } from "../../../../../tests/mocks/domain/semester.mocks";
import { Rating } from "@/domain/rating/rating";
import { Grade } from "@/domain/enum/grade/grade";

describe('FindRatingByStudent', () => {

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
        let studentEntity = StudentEntity.toStudentEntity(student);
        expect(await studentRepository.create(studentEntity)).toBeInstanceOf(StudentEntity);
        let wantedid = student.getId();
        const findRatingByStudent = new FindRatingByStudent(ratingRepository);
        const result = await findRatingByStudent.findRatingByStudent(wantedid);
        expect(result).toBeNull();
    });

    it('should find a rating by student', async () => {
        const firstQuarter = mockQuarter({ currentQuarter: true });
        const semester = mockSemester({ firstQuarter: firstQuarter });
        const semesterEntity = AcademicSemesterEntity.toEntity(semester);
        expect(await semesterRepository.create(semesterEntity)).toBeInstanceOf(AcademicSemesterEntity);
        let student = mockStudent();
        let studentEntity = StudentEntity.toStudentEntity(student);
        expect(await studentRepository.create(studentEntity)).toBeInstanceOf(StudentEntity);

        let rating = new Rating(semester.firstQuarter, student, new Date(), Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD);
        let ratingEntity = RatingEntity.toRatingEntity(rating);
        expect(await ratingRepository.create(ratingEntity)).toBeInstanceOf(RatingEntity);

        const findRatingByStudent = new FindRatingByStudent(ratingRepository);
        const result = await findRatingByStudent.findRatingByStudent(student.getId());
        expect(result).toBeDefined();
        expect(result.student.id).toBe(student.getId());
        expect(result.id).toBe(rating.getId());
        expect(result.quarter.id).toBe(semester.firstQuarter.getId());
    });


});
