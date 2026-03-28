import { CommentEntity } from "../../../../infrastructure/entities/comment/comment.entity";
import { CreateCommentDto } from "./create.comment.dto";
import { CommentRepository } from "../../../../infrastructure/repositories/comment/comment.respository";
import { AcademicSemesterEntity } from "../../../../infrastructure/entities/academic-semester/academic.semester.entity";
import { ParentEntity } from "../../../../infrastructure/entities/parent/parent.entity";
import { RatingEntity } from "../../../../infrastructure/entities/rating/rating.entity";
import { StudentEntity } from "../../../../infrastructure/entities/student/student.entity";
import { AcademicSemesterRepository } from "../../../../infrastructure/repositories/academic-semester/academic-semester.repository";
import { ParentRepository } from "../../../../infrastructure/repositories/parent/parent.repository";
import { RatingRepositiry } from "../../../../infrastructure/repositories/rating/rating.repository";
import { StudentRepository } from "../../../../infrastructure/repositories/student/student.repository";
import { DomainMocks } from "../../../../infrastructure/__mocks__/mocks";
import { CreateCommentService } from './create.comment.service';
import { Repository } from "typeorm";
import { TestDataSource } from '../../../../infrastructure/repositories/config-test/test.datasource';
import { mockSemester } from "../../../../../tests/mocks/domain/semester.mocks";
import { mockRating } from "../../../../../tests/mocks/domain/rating.mocks";

describe('create comment service integration tests', () => {

    let commentEntity: Repository<CommentEntity>;
    let commentRepository: CommentRepository;

    let ratingEntity: Repository<RatingEntity>;
    let ratingRepository: RatingRepositiry;

    let semesterEntity: Repository<AcademicSemesterEntity>;
    let semesterRepository: AcademicSemesterRepository;

    let studentEntity: Repository<StudentEntity>;
    let studentRepository: StudentRepository;

    let parentEntity: Repository<ParentEntity>;
    let parentRepository: ParentRepository;

    beforeAll(async () => {

        commentEntity = TestDataSource.getRepository(CommentEntity);
        commentRepository = new CommentRepository(commentEntity, TestDataSource);

        semesterEntity = TestDataSource.getRepository(AcademicSemesterEntity);
        semesterRepository = new AcademicSemesterRepository(semesterEntity, TestDataSource);

        ratingEntity = TestDataSource.getRepository(RatingEntity);
        ratingRepository = new RatingRepositiry(ratingEntity, TestDataSource);

        studentEntity = TestDataSource.getRepository(StudentEntity);
        studentRepository = new StudentRepository(studentEntity, TestDataSource);

        parentEntity = TestDataSource.getRepository(ParentEntity);
        parentRepository = new ParentRepository(parentEntity, TestDataSource)

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

    it('should throw a systemError', async () => {
        const dto = new CreateCommentDto('test a test', '0e2189bd-8f47-4665-90b3-53191b52e606', "55c63535-25f8-471e-8184-d1f1d44a042c");
        const service = new CreateCommentService(commentRepository, ratingRepository);
        await expect(service.execute(dto)).rejects.toMatchObject({errors:
            [{"context": "comment", "message": "Rating not found",}]
        });
    })

    it('should save a comment', async () => {

        let semester = mockSemester()
        let semesterEntity = AcademicSemesterEntity.toEntity(semester);
        expect(await semesterRepository.create(semesterEntity)).toBeInstanceOf(AcademicSemesterEntity)

        let student = DomainMocks.mockStudent();
        let studentEntity = StudentEntity.toStudentEntity(student);

        expect(await studentRepository.create(studentEntity)).toBeInstanceOf(StudentEntity);

        let rating = mockRating();
        let ratingEntity = RatingEntity.toRatingEntity(rating);

        expect(await ratingRepository.create(ratingEntity)).toBeInstanceOf(RatingEntity);

        let idPersonHaveDone = student.getId();
        let idRating = rating.getId();

        const dto = new CreateCommentDto('test a test', idPersonHaveDone, idRating);
        const service = new CreateCommentService(commentRepository, ratingRepository);
        let results = await commentRepository.findAll();
        expect(results.length).toBe(0);

        expect(await service.execute(dto)).toBe(void 0);
        results = await commentRepository.findAll();
        expect(results.length).toBe(1);
        expect(results[0].id).toBeDefined();
        expect(results[0].idPersonHaveDone).toBe(idPersonHaveDone);
        expect(results[0].comment).toBe('test a test');
    })

})