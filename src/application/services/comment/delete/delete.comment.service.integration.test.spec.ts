import { AppDataSource } from "../../../../infrastructure/repositories/config-test/appDataSource";
import { CommentEntity } from "../../../../infrastructure/entities/comment/comment.entity";
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
import { DataSource } from "typeorm";
import { Repository } from "typeorm";
import { DeleteCommentService } from "./delete.comment.service";
import { TestDataSource } from "../../../../infrastructure/repositories/config-test/test.datasource";
import { mockSemester } from "../../../../../tests/mocks/domain/semester.mocks";
import { mockRating } from "../../../../../tests/mocks/domain/rating.mocks";


describe('DeleteCommentService integration test', () => {

    let appDataSource: DataSource;
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

    it('given an id that does not exist should not trhow error', async () => {
        let wantedId = '2c1d88fb-462e-4e8b-bcb1-27119dac4317';
        const service = new DeleteCommentService(commentRepository);
        expect(await service.execute(wantedId)).toBe(void 0);
    })

    it('given a valid comment should delete it on BD', async () => {
        let semester = mockSemester();
        let semesterEntity = AcademicSemesterEntity.toEntity(semester);
        expect(await semesterRepository.create(semesterEntity)).toBeInstanceOf(AcademicSemesterEntity);

        let student = DomainMocks.mockStudent();
        let studentEntity = StudentEntity.toStudentEntity(student);

        expect(await studentRepository.create(studentEntity)).toBeInstanceOf(StudentEntity);

        let rating = mockRating({ student, quarter: semester.firstQuarter });
        let ratingEntity = RatingEntity.toRatingEntity(rating);

        expect(await ratingRepository.create(ratingEntity)).toBeInstanceOf(RatingEntity);

        let comment = DomainMocks.mockComment();
        let commentEntity = CommentEntity.toCommentEntity(comment, ratingEntity);
        let wantedId = comment.getId();
        expect(await commentRepository.create(commentEntity)).toBeInstanceOf(CommentEntity);

        let result = await commentRepository.find(wantedId);
        expect(result).toBeDefined();

        const service = new DeleteCommentService(commentRepository);
        expect(await service.execute(wantedId)).toBe(void 0);
        result = await commentRepository.find(wantedId);
        expect(result).toBeNull();
    });


})
