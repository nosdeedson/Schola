import { CommentEntity } from "../../../../infrastructure/entities/comment/comment.entity";
import { CreateCommentDto } from "./create.comment.dto";
import { CommentRepository } from "../../../../infrastructure/repositories/comment/comment.respository";
import { AcademicSemesterEntity } from "../../../../infrastructure/entities/academic-semester/academic.semester.entity";
import { ParentEntity } from "../../../../infrastructure/entities/parent/parent.entity";
import { RatingEntity } from "../../../../infrastructure/entities/rating/rating.entity";
import { StudentEntity } from "../../../../infrastructure/entities/student/student.entity";
import { AcademicSemesterRepository } from "../../../../infrastructure/repositories/academic-semester/academic-semester.repository";
import { ParentRepository } from "../../../../infrastructure/repositories/parent/parent.repository";
import { RatingRepository } from "../../../../infrastructure/repositories/rating/rating.repository";
import { StudentRepository } from "../../../../infrastructure/repositories/student/student.repository";
import { CreateCommentService } from './create.comment.service';
import { QueryFailedError, Repository } from "typeorm";
import { TestDataSource } from '../../../../infrastructure/repositories/config-test/test.datasource';
import { mockSemester } from "../../../../../tests/mocks/domain/semester.mocks";
import { mockRating } from "../../../../../tests/mocks/domain/rating.mocks";
import { mockStudent } from "../../../../../tests/mocks/domain/student.mocks";
import { AcademicSemesterMapper } from "@/infrastructure/mappers/semester/academic-semester-mapper";

describe('create comment service integration tests', () => {

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

    it('should save a comment', async () => {

        let semester = mockSemester()
        let semesterEntity = AcademicSemesterMapper.fromDomain(semester);
        expect(await semesterRepository.create(semesterEntity)).toBeInstanceOf(AcademicSemesterEntity)

        let student = mockStudent();
        let studentEntity = StudentEntity.toStudentEntity(student);

        expect(await studentRepository.create(studentEntity)).toBeInstanceOf(StudentEntity);

        let rating = mockRating({ student, quarter: semester.firstQuarter });
        let ratingEntity = RatingEntity.toRatingEntity(rating);

        expect(await ratingRepository.create(ratingEntity)).toBeInstanceOf(RatingEntity);

        let namePersonHaveDone = student.getName();

        const dto = new CreateCommentDto('test a test', namePersonHaveDone, ratingEntity);
        const service = new CreateCommentService(commentRepository);
        let results = await commentRepository.findAll();
        expect(results.length).toBe(0);

        expect(await service.execute(dto)).toBe(void 0);
        results = await commentRepository.findAll();
        expect(results.length).toBe(1);
        expect(results[0].id).toBeDefined();
        expect(results[0].namePersonHaveDone).toBe(namePersonHaveDone);
        expect(results[0].comment).toBe('test a test');
    });

    it('should throw an error while saving a comment', async () => {
        let semester = mockSemester()
        let semesterEntity = AcademicSemesterMapper.fromDomain(semester);
        expect(await semesterRepository.create(semesterEntity)).toBeInstanceOf(AcademicSemesterEntity)
        let namePersonHaveDone = 'não tem';
        const dto = new CreateCommentDto('test a test', namePersonHaveDone, null);
        const service = new CreateCommentService(commentRepository);
        await expect(service.execute(dto)).rejects.toThrow(QueryFailedError);
    });


});
