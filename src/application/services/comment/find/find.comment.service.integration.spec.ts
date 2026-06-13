import { AcademicSemesterEntity } from "../../../../infrastructure/entities/academic-semester/academic.semester.entity";
import { CommentEntity } from "../../../../infrastructure/entities/comment/comment.entity";
import { ParentEntity } from "../../../../infrastructure/entities/parent/parent.entity";
import { RatingEntity } from "../../../../infrastructure/entities/rating/rating.entity";
import { StudentEntity } from "../../../../infrastructure/entities/student/student.entity";
import { AcademicSemesterRepository } from "../../../../infrastructure/repositories/academic-semester/academic-semester.repository";
import { CommentRepository } from "../../../../infrastructure/repositories/comment/comment.respository";
import { ParentRepository } from "../../../../infrastructure/repositories/parent/parent.repository";
import { RatingRepository } from "../../../../infrastructure/repositories/rating/rating.repository";
import { StudentRepository } from "../../../../infrastructure/repositories/student/student.repository";
import { FindCommentService } from './find.comment.service';
import { Repository } from "typeorm";
import { TestDataSource } from "../../../../infrastructure/repositories/config-test/test.datasource";
import { mockSemester } from "../../../../../tests/mocks/domain/semester.mocks";
import { mockRating } from "../../../../../tests/mocks/domain/rating.mocks";
import { mockStudent } from "../../../../../tests/mocks/domain/student.mocks";
import { mockComment } from "../../../../../tests/mocks/domain/comment.mocks";
import { AcademicSemesterMapper } from "@/infrastructure/mappers/semester/academic-semester-mapper";
import { CommentMapper } from "@/infrastructure/mappers/comment/comment-mapper";
import { RatingMapper } from "@/infrastructure/mappers/rating/rating-mapper";
import { StudentMapper } from "@/infrastructure/mappers/student/student-mapper";
import { AcademicSemester } from "@/domain/academc-semester/academic.semester";
import { Student } from "@/domain/student/student";
import { Rating } from "@/domain/rating/rating";
import { Comment } from "@/domain/comment/comment";

describe('FindCommentService integration tests', () => {

    let commentEntity: Repository<CommentEntity>;
    let commentRepository: CommentRepository;

    let ratingEntity: Repository<RatingEntity>;
    let ratingRepository: RatingRepository;

    let semesterEntity: Repository<AcademicSemesterEntity>;
    let semesterRepository: AcademicSemesterRepository;

    let studentEntity: Repository<StudentEntity>;
    let studentRepository: StudentRepository;

    let parentEntity: Repository<ParentEntity>;
    let parentRepository: ParentRepository;

    beforeAll(async () => {
        commentEntity = TestDataSource.getRepository(CommentEntity);
        commentRepository = new CommentRepository(TestDataSource);
        semesterEntity = TestDataSource.getRepository(AcademicSemesterEntity);
        semesterRepository = new AcademicSemesterRepository(TestDataSource);
        ratingEntity = TestDataSource.getRepository(RatingEntity);
        ratingRepository = new RatingRepository(TestDataSource);
        studentEntity = TestDataSource.getRepository(StudentEntity);
        studentRepository = new StudentRepository(TestDataSource);
        parentEntity = TestDataSource.getRepository(ParentEntity);
        parentRepository = new ParentRepository(TestDataSource)

    });

    afterEach(async () => {
        jest.clearAllMocks();
    });

    it('repositories and entities must be instantiated', () => {
        expect(parentEntity).toBeDefined();
        expect(studentEntity).toBeDefined();
        expect(semesterEntity).toBeDefined();
        expect(ratingEntity).toBeDefined();
        expect(commentEntity).toBeDefined();
        expect(parentRepository).toBeDefined();
        expect(studentRepository).toBeDefined();
        expect(semesterRepository).toBeDefined();
        expect(ratingRepository).toBeDefined();
        expect(commentRepository).toBeDefined();
    });

    it('should throw an systemError with non-existent id', async () => {
        const nonExistentId = '2da72bf9-8a41-420a-be07-1ee16329a63a';
        const service = new FindCommentService(commentRepository);

        await expect(service.execute(nonExistentId)).rejects.toMatchObject(
            { errors: [{ "context": "comment", "message": "comment not found" }] }
        );
    });

    it('should a comment', async () => {
        let semester = mockSemester();
        let semesterEntity = AcademicSemesterMapper.fromDomain(semester);
        expect(await semesterRepository.create(semesterEntity)).toBeInstanceOf(AcademicSemester);

        let student = mockStudent();
        let studentEntity = StudentMapper.fromDomain(student);

        expect(await studentRepository.create(studentEntity)).toBeInstanceOf(Student);

        let rating = mockRating({ student, quarter: semester.firstQuarter });
        let ratingEntity = RatingMapper.fromDomain(rating);

        expect(await ratingRepository.create(ratingEntity)).toBeInstanceOf(Rating);

        let comment = mockComment();
        let commentEntity = CommentMapper.fromDomain(comment, rating);
        let wantedId = comment.getId();
        expect(await commentRepository.create(commentEntity)).toBeInstanceOf(Comment);

        const service = new FindCommentService(commentRepository);
        const result = await service.execute(wantedId);
        expect(result).toBeDefined();
        expect(result.comment).toBe(comment.getComment());
        expect(result.createdAt).toEqual(comment.getCreatedAt());
        expect(result.namePersonHadDone).toBe(comment.getNamePersonHaveDone());
        expect(result.idComment).toBe(comment.getId());
    });

});
