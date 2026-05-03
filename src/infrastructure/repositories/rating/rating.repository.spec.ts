import { Grade } from "../../../domain/enum/grade/grade";
import { Rating } from "../../../domain/rating/rating";
import { DomainMocks } from '../../__mocks__/mocks';
import { AcademicSemesterEntity } from "../../entities/academic-semester/academic.semester.entity";
import { RatingEntity } from "../../entities/rating/rating.entity";
import { StudentEntity } from "../../entities/student/student.entity";
import { AcademicSemesterRepository } from '../academic-semester/academic-semester.repository';
import { RatingRepository } from '../rating/rating.repository';
import { StudentRepository } from '../student/student.repository';
import { TestDataSource } from "../config-test/test.datasource";
import { mockSemester } from "../../../../tests/mocks/domain/semester.mocks";
import { mockQuarter } from "../../../../tests/mocks/domain/quarter.mocks";
import { mockComment } from "../../../../tests/mocks/domain/comment.mocks";
import { CommentRepository } from "../comment/comment.respository";
import { CommentEntity } from "@/infrastructure/entities/comment/comment.entity";

describe('RatingRepository unit tests', () => {

    let ratintModel;
    let ratingRepository: RatingRepository;
    let semesterModel;
    let semesterRepository: AcademicSemesterRepository;
    let studentModel;
    let studentRepository: StudentRepository;
    let commentModel;
    let commentRepository: CommentRepository;

    beforeAll(async () => {

        ratintModel = TestDataSource.getRepository(RatingEntity);
        ratingRepository = new RatingRepository(TestDataSource);

        semesterModel = TestDataSource.getRepository(AcademicSemesterEntity);
        semesterRepository = new AcademicSemesterRepository(TestDataSource);

        studentModel = TestDataSource.getRepository(StudentEntity);
        studentRepository = new StudentRepository(TestDataSource);

        commentModel = TestDataSource.getRepository(CommentEntity);
        commentRepository = new CommentRepository(TestDataSource);
    });

    it('ratingRepository should be instantiated', () => {
        expect(ratingRepository).toBeDefined();
        expect(semesterRepository).toBeDefined();
        expect(studentRepository).toBeDefined();
        expect(commentRepository).toBeDefined();
    });

    it('should save a rating on the BD', async () => {
        let semester = mockSemester();
        let semesterEntity = AcademicSemesterEntity.toEntity(semester);
        await semesterRepository.create(semesterEntity);

        let student = DomainMocks.mockStudent();
        let studentEntity = StudentEntity.toStudentEntity(student);
        await studentRepository.create(studentEntity);

        let rating = new Rating(semester.firstQuarter, student, new Date(), Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD,)
        let ratingEntity = RatingEntity.toRatingEntity(rating);
        let wantedId = rating.getId();
        expect(await ratingRepository.create(ratingEntity)).toBeInstanceOf(RatingEntity);

        let result = await ratingRepository.find(wantedId);
        expect(result).toBeDefined();
        expect(result.id).toEqual(wantedId);
    });

    it('should delete a rating on the BD', async () => {
        let semester = mockSemester();
        let semesterEntity = AcademicSemesterEntity.toEntity(semester);
        await semesterRepository.create(semesterEntity);

        let student = DomainMocks.mockStudent();
        let studentEntity = StudentEntity.toStudentEntity(student);
        await studentRepository.create(studentEntity);

        let rating = new Rating(semester.firstQuarter, student, new Date(), Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD,)
        let ratingEntity = RatingEntity.toRatingEntity(rating);
        let wantedId = rating.getId();
        expect(await ratingRepository.create(ratingEntity)).toBeInstanceOf(RatingEntity);
        let result = await ratingRepository.find(wantedId);
        expect(result).toBeDefined();
        expect(await ratingRepository.delete(wantedId)).toBe(void 0);
    });

    it('should find a rating on the BD', async () => {
        let semester = mockSemester();
        let semesterEntity = AcademicSemesterEntity.toEntity(semester);
        await semesterRepository.create(semesterEntity);

        let student = DomainMocks.mockStudent();
        let studentEntity = StudentEntity.toStudentEntity(student);
        await studentRepository.create(studentEntity);

        let rating = new Rating(semester.firstQuarter, student, new Date(), Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD,)
        let ratingEntity = RatingEntity.toRatingEntity(rating);
        let wantedId = rating.getId();
        expect(await ratingRepository.create(ratingEntity)).toBeInstanceOf(RatingEntity);
        let result = await ratingRepository.find(wantedId);
        expect(result).toBeDefined();
        expect(result.id).toEqual(wantedId);
        expect(result.writing).toEqual(Grade.BAD)
    });

    it('should find a rating by student', async () => {
        const firstQuarter = mockQuarter({ currentQuarter: true })
        let semester = mockSemester({ firstQuarter: firstQuarter });
        let semesterEntity = AcademicSemesterEntity.toEntity(semester);
        await semesterRepository.create(semesterEntity);

        let student = DomainMocks.mockStudent();
        let studentEntity = StudentEntity.toStudentEntity(student);
        await studentRepository.create(studentEntity);
        let rating = new Rating(semester.firstQuarter, student, new Date(), Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD,)
        let ratingEntity = RatingEntity.toRatingEntity(rating);
        expect(await ratingRepository.create(ratingEntity)).toBeInstanceOf(RatingEntity);
        const wantedStudentId = student.getId();

        let result = await ratingRepository.findByStudentId(wantedStudentId);
        expect(result).toBeDefined();
        expect(result[0].student.id).toEqual(wantedStudentId);
        expect(result[0].quarter.id).toEqual(semester.firstQuarter.getId());
        expect(result[0].comments).toHaveLength(0);
        expect(result[0].writing).toEqual(Grade.BAD);
    });

    it('should find a rating with comment by student', async () => {
        const firstQuarter = mockQuarter({ currentQuarter: true })
        let semester = mockSemester({ firstQuarter: firstQuarter });
        let semesterEntity = AcademicSemesterEntity.toEntity(semester);
        await semesterRepository.create(semesterEntity);

        let student = DomainMocks.mockStudent();
        let studentEntity = StudentEntity.toStudentEntity(student);
        await studentRepository.create(studentEntity);
        let rating = new Rating(semester.firstQuarter, student, new Date(), Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD,);
        let ratingEntity = RatingEntity.toRatingEntity(rating);
        expect(await ratingRepository.create(ratingEntity)).toBeInstanceOf(RatingEntity);
        const comment = mockComment({ idPerson: student.getId() });
        const commentEntity = CommentEntity.toCommentEntity(comment, ratingEntity);
        expect(await commentRepository.create(commentEntity)).toBeInstanceOf(CommentEntity);
        const wantedStudentId = student.getId();

        let result = await ratingRepository.findByStudentId(wantedStudentId);
        expect(result).toBeDefined();
        expect(result[0].student.id).toEqual(wantedStudentId);
        expect(result[0].quarter.id).toEqual(semester.firstQuarter.getId());
        expect(result[0].comments).toHaveLength(1);
        expect(result[0].writing).toEqual(Grade.BAD);
    });

    it('should find all rating on the BD', async () => {
        let semester = mockSemester();
        let semesterEntity = AcademicSemesterEntity.toEntity(semester);
        await semesterRepository.create(semesterEntity);

        let student = DomainMocks.mockStudent();
        let studentEntity = StudentEntity.toStudentEntity(student);
        await studentRepository.create(studentEntity);

        let rating = new Rating(semester.firstQuarter, student, new Date(), Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD, '1cfb1c26-5e1e-449e-bdbe-1749bc035379')
        let ratingEntity = RatingEntity.toRatingEntity(rating);
        expect(await ratingRepository.create(ratingEntity)).toBeInstanceOf(RatingEntity);
        // let rating2 = new Rating(semester.firstQuarter, student1, new Date(), Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD, 'd146249c-0341-4c52-bd02-421f104e5c45')
        // let ratingEntity2 = RatingEntity.toRatingEntity(rating2);
        // expect(await ratingRepository.create(ratingEntity2)).toBeInstanceOf(RatingEntity);
        let results = await ratingRepository.findAll();
        expect(results).toBeDefined();
        expect(results.length).toBe(1);
        expect(results[0].id).toEqual(rating.getId());
        // expect(results[1].id).toEqual(rating2.getId());
    });

    it('should update a rating on the BD', async () => {
        let semester = mockSemester();
        let semesterEntity = AcademicSemesterEntity.toEntity(semester);
        await semesterRepository.create(semesterEntity);

        let student = DomainMocks.mockStudent();
        let studentEntity = StudentEntity.toStudentEntity(student);
        await studentRepository.create(studentEntity);

        let rating = new Rating(semester.firstQuarter, student, new Date(), Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD,)
        let ratingEntity = RatingEntity.toRatingEntity(rating);
        let wantedId = rating.getId();
        expect(await ratingRepository.create(ratingEntity)).toBeInstanceOf(RatingEntity);

        let wantedWriting = Grade.GOOD;
        let wantedListing = Grade.GOOD;
        ratingEntity.writing = wantedWriting
        ratingEntity.listing = wantedListing
        expect(await ratingRepository.update(ratingEntity)).toBe(void 0);

        let result = await ratingRepository.find(wantedId);
        expect(result).toBeDefined();
        expect(result.id).toEqual(wantedId);
        expect(result.writing).toEqual(wantedWriting);
        expect(result.listing).toEqual(wantedListing);
    });

});
