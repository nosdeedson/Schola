import { Repository } from "typeorm";
import { Comment } from "../../../../domain/comment/comment";
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
import { FindAllCommentService } from './findAll.comment.service';
import { TestDataSource } from "../../../../infrastructure/repositories/config-test/test.datasource";
import { mockSemester } from "../../../../../tests/mocks/domain/semester.mocks";
import { mockRating } from "../../../../../tests/mocks/domain/rating.mocks";
import { mockStudent } from "../../../../../tests/mocks/domain/student.mocks";
import { mockComment } from "../../../../../tests/mocks/domain/comment.mocks";
import { AcademicSemesterMapper } from "@/infrastructure/mappers/semester/academic-semester-mapper";
import { StudentMapper } from "@/infrastructure/mappers/student/student-mapper";
import { RatingMapper } from "@/infrastructure/mappers/rating/rating-mapper";
import { Student } from "@/domain/student/student";
import { Rating } from "@/domain/rating/rating";
import { CommentMapper } from "@/infrastructure/mappers/comment/comment-mapper";
import { AcademicSemester } from "@/domain/academc-semester/academic.semester";

describe('FindAllCommentService integration tests', () => {

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

    it('should return an empty array', async () => {
        const service = new FindAllCommentService(commentRepository);
        const results = await service.execute();
        expect(results).toBeDefined();
        expect(results.all.length).toBe(0);
    });

    it('should find all comments', async () => {
        let semester = mockSemester()
        let semesterEntity = AcademicSemesterMapper.fromDomain(semester);
        expect(await semesterRepository.create(semesterEntity)).toBeInstanceOf(AcademicSemester);

        let student = mockStudent();
        let studentEntity = StudentMapper.fromDomain(student);

        expect(await studentRepository.create(studentEntity)).toBeInstanceOf(Student);

        let rating = mockRating({ student, quarter: semester.firstQuarter });
        let ratingEntity = RatingMapper.fromDomain(rating);

        expect(await ratingRepository.create(ratingEntity)).toBeInstanceOf(Rating);

        const service = new FindAllCommentService(commentRepository);

        let results = await service.execute()
        expect(results.all.length).toBe(0);

        let comment = mockComment();
        let commentEntity = CommentMapper.fromDomain(comment, rating);
        expect(await commentRepository.create(commentEntity)).toBeInstanceOf(Comment);

        let comment1 = new Comment('another comment', comment.getNamePersonHaveDone());
        const commentEntity1 = CommentMapper.fromDomain(comment1, rating);
        expect(await commentRepository.create(commentEntity1)).toBeInstanceOf(Comment);

        results = await service.execute();

        expect(results).toBeDefined()
        expect(results.all.length).toBe(2);
        expect(results.all[0].idComment).toBe(comment.getId());
        expect(results.all[1].idComment).toBe(comment1.getId());
    });
});
