import { Repository } from "typeorm";
import { Comment } from "../../../domain/comment/comment";
import { Parent } from "../../../domain/parent/parent";
import { Student } from "../../../domain/student/student";
import { DomainMocks } from "../../__mocks__/mocks";
import { AcademicSemesterEntity } from "../../entities/academic-semester/academic.semester.entity";
import { CommentEntity } from "../../entities/comment/comment.entity";
import { ParentEntity } from "../../entities/parent/parent.entity";
import { RatingEntity } from "../../entities/rating/rating.entity";
import { StudentEntity } from "../../entities/student/student.entity";
import { ParentRepository } from '../../repositories/parent/parent.repository';
import { AcademicSemesterRepository } from '../academic-semester/academic-semester.repository';
import { CommentRepository } from '../comment/comment.respository';
import { RatingRepositiry } from '../rating/rating.repository';
import { StudentRepository } from '../student/student.repository';
import { TestDataSource } from "../config-test/test.datasource";
import { mockSemester } from '../../../../tests/mocks/domain/semester.mocks';
import { mockRating } from '../../../../tests/mocks/domain/rating.mocks';

describe('CommentRepository unit test', () => {

    let commentModel: Repository<CommentEntity>;
    let repository: CommentRepository;
    let ratingModel: Repository<RatingEntity>;
    let ratingRepository: RatingRepositiry;
    let ratingEntity;
    let semesterModel;
    let semesterRepository: AcademicSemesterRepository;
    let studentModel: Repository<StudentEntity>;
    let studentRepository: StudentRepository;
    let parentModel: Repository<ParentEntity>;
    let parentRepository: ParentRepository;

    beforeAll(() => {

        commentModel = TestDataSource.getRepository(CommentEntity);
        repository = new CommentRepository(commentModel, TestDataSource);

        semesterModel = TestDataSource.getRepository(AcademicSemesterEntity);
        semesterRepository = new AcademicSemesterRepository(semesterModel, TestDataSource);

        ratingModel = TestDataSource.getRepository(RatingEntity);
        ratingRepository = new RatingRepositiry(ratingModel, TestDataSource);

        studentModel = TestDataSource.getRepository(StudentEntity);
        studentRepository = new StudentRepository(studentModel, TestDataSource);

        parentModel = TestDataSource.getRepository(ParentEntity);
        parentRepository = new ParentRepository(parentModel, TestDataSource)

    });

    it('commentRepository must be instantiated', async () => {
        expect(repository).toBeDefined();
        expect(ratingRepository).toBeDefined();
        expect(semesterRepository).toBeDefined();
        expect(studentRepository).toBeDefined();
        expect(parentRepository).toBeDefined();
    })

    it('should save a commnet on BD', async () => {

        let semester = mockSemester();
        let academicSemester = AcademicSemesterEntity.toEntity(semester);
        await semesterRepository.create(academicSemester);

        // parent needed
        let student = new Student({ birthday: new Date(), name: 'edson', enrolled: '123', nameParents: [], id: 'f07d183f-eb37-417e-8a58-ad9ed4b3910f' });
        const parent = new Parent({ birthday: new Date(), name: "jose", nameStudents: [student.getName()], id: '0d0c4248-695c-43a5-963e-bc5729abead6' });
        student.setParents(parent);

        let studentModel = StudentEntity.toStudentEntity(student);
        await studentRepository.create(studentModel);

        parent.setStudents([student])

        let rating = mockRating({ student, quarter: semester.firstQuarter });
        ratingEntity = RatingEntity.toRatingEntity(rating);
        await ratingRepository.create(ratingEntity);

        //let entityBD = await ratingRepository.find(ratingEntity.id);

        let comment = DomainMocks.mockComment();
        let model = CommentEntity.toCommentEntity(comment, ratingEntity);
        let wantedId = comment.getId();
        expect(await repository.create(model)).toBeInstanceOf(CommentEntity);

        let result = await repository.find(wantedId);
        expect(result).toBeDefined();
        expect(result.id).toBe(wantedId);
        expect(result.rating).toBeUndefined();
    });

    it('should delete a comment', async () => {
        let semester = mockSemester();
        let academicSemester = AcademicSemesterEntity.toEntity(semester);
        await semesterRepository.create(academicSemester);

        // parent needed
        let student = new Student({ birthday: new Date(), name: 'edson', enrolled: '123', nameParents: [], id: 'f07d183f-eb37-417e-8a58-ad9ed4b3910f' });
        const parent = new Parent({ birthday: new Date(), name: "jose", nameStudents: [student.getName()], id: '0d0c4248-695c-43a5-963e-bc5729abead6' });
        student.setParents(parent);

        let studentModel = StudentEntity.toStudentEntity(student);
        await studentRepository.create(studentModel);

        parent.setStudents([student])

        let rating = mockRating({ student, quarter: semester.firstQuarter });
        ratingEntity = RatingEntity.toRatingEntity(rating);
        await ratingRepository.create(ratingEntity);

        //let entityBD = await ratingRepository.find(ratingEntity.id);
        let wantedId = '489f0126-e7ca-44d6-8b11-13b61adc35d6';
        let wantedComment = 'just a test';
        let comment = new Comment(wantedComment, 'f07d183f-eb37-417e-8a58-ad9ed4b3910f', wantedId);
        let model = CommentEntity.toCommentEntity(comment, ratingEntity);
        await repository.create(model);

        expect(await repository.delete(wantedId)).toBe(void 0)
    })


    it('should not throw error when deleting a comment with a wrong id', async () => {
        let semester = mockSemester();
        let academicSemester = AcademicSemesterEntity.toEntity(semester);
        await semesterRepository.create(academicSemester);

        // parent needed
        let student = new Student({ birthday: new Date(), name: 'edson', enrolled: '123', nameParents: [], id: 'f07d183f-eb37-417e-8a58-ad9ed4b3910f' });
        const parent = new Parent({ birthday: new Date(), name: "jose", nameStudents: [student.getName()], id: '0d0c4248-695c-43a5-963e-bc5729abead6' });
        student.setParents(parent);

        let studentModel = StudentEntity.toStudentEntity(student);
        await studentRepository.create(studentModel);

        parent.setStudents([student])

        let rating = mockRating({ student, quarter: semester.firstQuarter });
        ratingEntity = RatingEntity.toRatingEntity(rating);
        await ratingRepository.create(ratingEntity);

        //let entityBD = await ratingRepository.find(ratingEntity.id);
        let wantedId = 'd70bc62e-a53d-4cef-8366-de63099ebf4d';
        let wantedComment = 'just a test';
        let comment = new Comment(wantedComment, 'f07d183f-eb37-417e-8a58-ad9ed4b3910f', '489f0126-e7ca-44d6-8b11-13b61adc35d6');
        let model = CommentEntity.toCommentEntity(comment, ratingEntity);
        await repository.create(model);

        expect(await repository.delete(wantedId)).toBe(void 0)
    })

    it('should find a comment', async () => {
        let semester = mockSemester();
        let academicSemester = AcademicSemesterEntity.toEntity(semester);
        await semesterRepository.create(academicSemester);

        // parent needed
        let student = new Student({ birthday: new Date(), name: 'edson', enrolled: '123', nameParents: [], id: 'f07d183f-eb37-417e-8a58-ad9ed4b3910f' });
        const parent = new Parent({ birthday: new Date(), name: "jose", nameStudents: [student.getName()], id: '0d0c4248-695c-43a5-963e-bc5729abead6' });
        student.setParents(parent);

        let studentModel = StudentEntity.toStudentEntity(student);
        await studentRepository.create(studentModel);

        parent.setStudents([student])

        let rating = mockRating({ student, quarter: semester.firstQuarter });
        ratingEntity = RatingEntity.toRatingEntity(rating);
        await ratingRepository.create(ratingEntity);

        //let entityBD = await ratingRepository.find(ratingEntity.id);
        let wantedId = '489f0126-e7ca-44d6-8b11-13b61adc35d6';
        let wantedComment = 'just a test';
        let comment = new Comment(wantedComment, 'f07d183f-eb37-417e-8a58-ad9ed4b3910f', wantedId);
        let model = CommentEntity.toCommentEntity(comment, ratingEntity);
        await repository.create(model);

        let result = await repository.find(wantedId);
        expect(result).toBeDefined();
        expect(result.id).toEqual(wantedId)
        expect(result.comment).toEqual(wantedComment)
    })

    it('should find all comments', async () => {
        let semester = mockSemester();
        let academicSemester = AcademicSemesterEntity.toEntity(semester);
        await semesterRepository.create(academicSemester);

        // parent needed
        let student = new Student({ birthday: new Date(), name: 'edson', enrolled: '123', nameParents: [], id: 'f07d183f-eb37-417e-8a58-ad9ed4b3910f' });
        const parent = new Parent({ birthday: new Date(), name: "jose", nameStudents: [student.getName()], id: '0d0c4248-695c-43a5-963e-bc5729abead6' });
        student.setParents(parent);

        let studentModel = StudentEntity.toStudentEntity(student);
        await studentRepository.create(studentModel);

        parent.setStudents([student])

        let rating = mockRating({ student, quarter: semester.firstQuarter });
        ratingEntity = RatingEntity.toRatingEntity(rating);
        await ratingRepository.create(ratingEntity);

        let comment = new Comment('just a comment', 'f07d183f-eb37-417e-8a58-ad9ed4b3910f');
        let model = CommentEntity.toCommentEntity(comment, ratingEntity);
        await repository.create(model);

        let comment2 = new Comment('just another comment', 'f07d183f-eb37-417e-8a58-ad9ed4b3910f');
        let model2 = CommentEntity.toCommentEntity(comment2, ratingEntity);
        await repository.create(model2);

        let results = await repository.findAll();
        expect(results).toBeDefined();
        expect(results.length).toBe(2);
        expect(results[0].id).toEqual(comment.getId())
        expect(results[0].comment).toEqual(comment.getComment())
        expect(results[1].id).toEqual(comment2.getId())
        expect(results[1].comment).toEqual(comment2.getComment())
    })

    it('should update a comment', async () => {
        let semester = mockSemester();
        let academicSemester = AcademicSemesterEntity.toEntity(semester);
        await semesterRepository.create(academicSemester);

        // parent needed
        let student = new Student({ birthday: new Date(), name: 'edson', enrolled: '123', nameParents: [], id: 'f07d183f-eb37-417e-8a58-ad9ed4b3910f' });
        const parent = new Parent({ birthday: new Date(), name: "jose", nameStudents: [student.getName()], id: '0d0c4248-695c-43a5-963e-bc5729abead6' });
        student.setParents(parent);

        let studentModel = StudentEntity.toStudentEntity(student);
        await studentRepository.create(studentModel);

        parent.setStudents([student])

        let rating = mockRating({ student, quarter: semester.firstQuarter });
        ratingEntity = RatingEntity.toRatingEntity(rating);
        await ratingRepository.create(ratingEntity);

        let wantedId = '489f0126-e7ca-44d6-8b11-13b61adc35d6';
        let wantedComment = 'just a test';
        let comment = new Comment(wantedComment, 'f07d183f-eb37-417e-8a58-ad9ed4b3910f', wantedId);
        let model = CommentEntity.toCommentEntity(comment, ratingEntity);
        await repository.create(model);

        let change = 'changed the comment';
        model.comment = change;

        expect(await repository.update(model)).toBe(void 0);

        let result = await repository.find(wantedId);

        expect(result).toBeDefined();
        expect(result.id).toEqual(wantedId)
        expect(result.comment).toEqual(change)
    });

});
