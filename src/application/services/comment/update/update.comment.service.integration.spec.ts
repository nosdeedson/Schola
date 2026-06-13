import { Repository } from "typeorm";
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
import { UpdateCommentDto } from './update.comment.dto';
import { UpdateCommentService } from './update.comment.service';
import { TestDataSource } from "../../../../infrastructure/repositories/config-test/test.datasource";
import { mockSemester } from "../../../../../tests/mocks/domain/semester.mocks";
import { mockRating } from "../../../../../tests/mocks/domain/rating.mocks";
import { mockStudent } from "../../../../../tests/mocks/domain/student.mocks";
import { mockComment } from "../../../../../tests/mocks/domain/comment.mocks";
import { AcademicSemesterMapper } from "@/infrastructure/mappers/semester/academic-semester-mapper";
import { StudentMapper } from "@/infrastructure/mappers/student/student-mapper";
import { AcademicSemester } from "@/domain/academc-semester/academic.semester";
import { Student } from "@/domain/student/student";
import { RatingMapper } from "@/infrastructure/mappers/rating/rating-mapper";
import { CommentMapper } from "@/infrastructure/mappers/comment/comment-mapper";
import { Comment } from "@/domain/comment/comment";
import { Rating } from "@/domain/rating/rating";

describe('UpdateCommentService integration tests', () => {

    let commentEntity: Repository<CommentEntity>;
    let commentRepository: CommentRepository;

    let ratingEntity: RatingEntity | Repository<RatingEntity>;
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

    it('given the wrong id should throw an SystemError', async () => {

        let semester = mockSemester();
        let semesterEntityToSave = AcademicSemesterMapper.fromDomain(semester);
        expect(await semesterRepository.create(semesterEntityToSave)).toBeInstanceOf(AcademicSemester);

        let student = mockStudent();
        let studentEntity = StudentMapper.fromDomain(student);

        expect(await studentRepository.create(studentEntity)).toBeInstanceOf(Student);

        let rating = mockRating({ student, quarter: semester.firstQuarter });

        let ratingEntityToSave = RatingMapper.fromDomain(rating);

        expect(await ratingRepository.create(ratingEntityToSave)).toBeInstanceOf(Rating);

        let comment = mockComment();
        let commentEntityToSave = CommentMapper.fromDomain(comment, rating);
        expect(await commentRepository.create(commentEntityToSave)).toBeInstanceOf(Comment);

        const wrongId = 'df488d38-4890-4e32-a443-ff0ba9ad86eb';
        const dto = new UpdateCommentDto(wrongId, 'changing comment');

        const service = new UpdateCommentService(commentRepository);

        await expect(service.execute(dto)).rejects.toMatchObject({
            errors: [{ context: 'comment', message: 'comment not found' }]
        });
    });

    it('given a valid id should update a comment', async () => {
        let semester = mockSemester();
        let semesterEntityToSave = AcademicSemesterMapper.fromDomain(semester);
        expect(await semesterRepository.create(semesterEntityToSave)).toBeInstanceOf(AcademicSemester);

        let student = mockStudent();
        let studentEntity = StudentMapper.fromDomain(student);

        expect(await studentRepository.create(studentEntity)).toBeInstanceOf(Student);

        let rating = mockRating({ student, quarter: semester.firstQuarter });
        let ratingEntityToSave = RatingMapper.fromDomain(rating);

        expect(await ratingRepository.create(ratingEntityToSave)).toBeInstanceOf(Rating);

        let comment = mockComment();
        let commentEntityToSave = CommentMapper.fromDomain(comment, rating);
        expect(await commentRepository.create(commentEntityToSave)).toBeInstanceOf(Comment);

        let wantedId = comment.getId();
        let currentComment = comment.getComment();
        const beforeUpdate = await commentRepository.find(wantedId);
        expect(beforeUpdate.getComment()).toBe(currentComment);
        let updatedComment = 'changed comment';
        let dto = new UpdateCommentDto(wantedId, updatedComment);
        const service = new UpdateCommentService(commentRepository);

        expect(await service.execute(dto)).toBe(void 0);
        const result = await commentRepository.find(wantedId);
        expect(result.getComment()).toBe(updatedComment);
        expect(result.getId()).toBe(wantedId);
    }, 10000);

});
