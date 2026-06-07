import { Grade } from "../../../domain/enum/grade/grade";
import { Rating } from "../../../domain/rating/rating";
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
import { mockStudent } from "../../../../tests/mocks/domain/student.mocks";
import { QueryFailedError } from "typeorm";
import { AcademicSemesterMapper } from "@/infrastructure/mappers/semester/academic-semester-mapper";
import { StudentMapper } from "@/infrastructure/mappers/student/student-mapper";
import { RatingMapper } from "@/infrastructure/mappers/rating/rating-mapper";
import { CommentMapper } from "@/infrastructure/mappers/comment/comment-mapper";
import { Comment } from "@/domain/comment/comment";

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
        let semesterEntity = AcademicSemesterMapper.fromDomain(semester);
        await semesterRepository.create(semesterEntity);

        let student = mockStudent();
        let studentEntity = StudentMapper.fromDomain(student);
        await studentRepository.create(studentEntity);

        let rating = new Rating(semester.firstQuarter, student, new Date(), Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD,)
        let ratingEntity = RatingMapper.fromDomain(rating);
        let wantedId = rating.getId();
        expect(await ratingRepository.create(ratingEntity)).toBeInstanceOf(Rating);

        let result = await ratingRepository.find(wantedId);
        expect(result).toBeDefined();
        expect(result.getId()).toEqual(wantedId);
    });

    it('should delete a rating on the BD', async () => {
        let semester = mockSemester();
        let semesterEntity = AcademicSemesterMapper.fromDomain(semester);
        await semesterRepository.create(semesterEntity);

        let student = mockStudent();
        let studentEntity = StudentMapper.fromDomain(student);
        await studentRepository.create(studentEntity);

        let rating = new Rating(semester.firstQuarter, student, new Date(), Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD,)
        let ratingEntity = RatingMapper.fromDomain(rating);
        let wantedId = rating.getId();
        expect(await ratingRepository.create(ratingEntity)).toBeInstanceOf(Rating);
        let result = await ratingRepository.find(wantedId);
        expect(result).toBeDefined();
        expect(await ratingRepository.delete(wantedId)).toBe(void 0);
    });

    it('should find a rating on the BD', async () => {
        let semester = mockSemester();
        let semesterEntity = AcademicSemesterMapper.fromDomain(semester);
        await semesterRepository.create(semesterEntity);

        let student = mockStudent();
        let studentEntity = StudentMapper.fromDomain(student);
        await studentRepository.create(studentEntity);

        let rating = new Rating(semester.firstQuarter, student, new Date(), Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD,)
        let ratingEntity = RatingMapper.fromDomain(rating);
        let wantedId = rating.getId();
        expect(await ratingRepository.create(ratingEntity)).toBeInstanceOf(Rating);
        let result = await ratingRepository.find(wantedId);
        expect(result).toBeDefined();
        expect(result.getId()).toEqual(wantedId);
        expect(result.getWriting()).toEqual(Grade.BAD)
    });

    it('should find a rating by student', async () => {
        const firstQuarter = mockQuarter({ currentQuarter: true })
        let semester = mockSemester({ firstQuarter: firstQuarter });
        let semesterEntity = AcademicSemesterMapper.fromDomain(semester);
        await semesterRepository.create(semesterEntity);

        let student = mockStudent();
        let studentEntity = StudentMapper.fromDomain(student);
        await studentRepository.create(studentEntity);
        let rating = new Rating(semester.firstQuarter, student, new Date(), Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD,)
        let ratingEntity = RatingMapper.fromDomain(rating);
        expect(await ratingRepository.create(ratingEntity)).toBeInstanceOf(Rating);
        const wantedStudentId = student.getId();

        let result = await ratingRepository.findByStudentId(wantedStudentId);
        expect(result).toBeDefined();
        expect(result[0].getStudent().getId()).toEqual(wantedStudentId);
        expect(result[0].getQuarter().getId()).toEqual(semester.firstQuarter.getId());
        expect(result[0].getWriting()).toEqual(Grade.BAD);
    });

    it('should find a rating with comment by student', async () => {
        const firstQuarter = mockQuarter({ currentQuarter: true })
        let semester = mockSemester({ firstQuarter: firstQuarter });
        let semesterEntity = AcademicSemesterMapper.fromDomain(semester);
        await semesterRepository.create(semesterEntity);

        let student = mockStudent();
        let studentEntity = StudentMapper.fromDomain(student);
        await studentRepository.create(studentEntity);
        let rating = new Rating(semester.firstQuarter, student, new Date(), Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD,);
        let ratingEntity = RatingMapper.fromDomain(rating);
        expect(await ratingRepository.create(ratingEntity)).toBeInstanceOf(Rating);
        const comment = mockComment({ namePersoHaveDone: student.getName() });
        const commentEntity = CommentMapper.fromDomain(comment, ratingEntity);
        expect(await commentRepository.create(commentEntity)).toBeInstanceOf(Comment);
        const wantedStudentId = student.getId();

        let result = await ratingRepository.findByStudentId(wantedStudentId);
        expect(result).toBeDefined();
        expect(result[0].getStudent().getId()).toEqual(wantedStudentId);
        expect(result[0].getQuarter().getId()).toEqual(semester.firstQuarter.getId());
        expect(result[0].getComments()).toHaveLength(1);
        expect(result[0].getWriting()).toEqual(Grade.BAD);
    });

    it('should find all rating on the BD', async () => {
        let semester = mockSemester();
        let semesterEntity = AcademicSemesterMapper.fromDomain(semester);
        await semesterRepository.create(semesterEntity);

        let student = mockStudent();
        let studentEntity = StudentMapper.fromDomain(student);
        await studentRepository.create(studentEntity);

        let rating = new Rating(semester.firstQuarter, student, new Date(), Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD, '1cfb1c26-5e1e-449e-bdbe-1749bc035379')
        let ratingEntity = RatingMapper.fromDomain(rating);
        expect(await ratingRepository.create(ratingEntity)).toBeInstanceOf(Rating);
        let results = await ratingRepository.findAll();
        expect(results).toBeDefined();
        expect(results.length).toBe(1);
        expect(results[0].getId()).toEqual(rating.getId());
    });

    it('should update a rating on the BD', async () => {
        let semester = mockSemester();
        let semesterEntity = AcademicSemesterMapper.fromDomain(semester);
        await semesterRepository.create(semesterEntity);

        let student = mockStudent();
        let studentEntity = StudentMapper.fromDomain(student);
        await studentRepository.create(studentEntity);

        let rating = new Rating(semester.firstQuarter, student, new Date(), Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD,)
        let ratingEntity = RatingMapper.fromDomain(rating);
        let wantedId = rating.getId();
        expect(await ratingRepository.create(ratingEntity)).toBeInstanceOf(Rating);

        let wantedWriting = Grade.GOOD;
        let wantedListing = Grade.GOOD;
        ratingEntity.writing = wantedWriting
        ratingEntity.listing = wantedListing
        expect(await ratingRepository.update(ratingEntity)).toBe(void 0);

        let result = await ratingRepository.find(wantedId);
        expect(result).toBeDefined();
        expect(result.getId()).toEqual(wantedId);
        expect(result.getWriting()).toEqual(wantedWriting);
        expect(result.getListing()).toEqual(wantedListing);
    });

    it('should throw a QueryFailedErro', async () => {
        const entity = new RatingEntity();
        await expect(ratingRepository.create(entity)).rejects.toThrow(QueryFailedError);
    });

});
