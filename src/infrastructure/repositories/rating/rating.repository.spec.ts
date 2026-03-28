import { Grade } from "../../../domain/enum/grade/grade";
import { Rating } from "../../../domain/rating/rating";
import { DomainMocks } from '../../__mocks__/mocks';
import { AcademicSemesterEntity } from "../../entities/academic-semester/academic.semester.entity";
import { RatingEntity } from "../../entities/rating/rating.entity";
import { StudentEntity } from "../../entities/student/student.entity";
import { AcademicSemesterRepository } from '../academic-semester/academic-semester.repository';
import { RatingRepositiry } from '../rating/rating.repository';
import { StudentRepository } from '../student/student.repository';
import { TestDataSource } from "../config-test/test.datasource";
import { mockSemester } from "../../../../tests/mocks/domain/semester.mocks";

describe('RatingRepository unit tests', () =>{

    let ratintModel;
    let ratingRepository: RatingRepositiry;
    let semesterModel;
    let semesterRepository: AcademicSemesterRepository;
    let studentModel;
    let studentRepository: StudentRepository;

    beforeAll(() => {
        
        ratintModel = TestDataSource.getRepository(RatingEntity);
        ratingRepository = new RatingRepositiry(ratintModel, TestDataSource);

        semesterModel = TestDataSource.getRepository(AcademicSemesterEntity);
        semesterRepository = new AcademicSemesterRepository(semesterModel, TestDataSource);

        studentModel = TestDataSource.getRepository(StudentEntity);
        studentRepository = new StudentRepository(studentModel, TestDataSource);
    });

    it('ratingRepository should be instantiated', () =>{
        expect(ratingRepository).toBeDefined();
        expect(semesterRepository).toBeDefined();
        expect(studentRepository).toBeDefined();
    });

    it('should save a rating on the BD', async () =>{
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

    it('should delete a rating on the BD', async () =>{
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
    
    it('should find a rating on the BD', async () =>{
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

    it('should find all rating on the BD', async () =>{
        let semester = mockSemester();
        let semesterEntity = AcademicSemesterEntity.toEntity(semester);
        await semesterRepository.create(semesterEntity);

        let student = DomainMocks.mockStudent();
        let studentEntity = StudentEntity.toStudentEntity(student);
        await studentRepository.create(studentEntity);

        let rating = new Rating(semester.firstQuarter, student, new Date(), Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD, '1cfb1c26-5e1e-449e-bdbe-1749bc035379')
        let ratingEntity = RatingEntity.toRatingEntity(rating);
        expect(await ratingRepository.create(ratingEntity)).toBeInstanceOf(RatingEntity);
        let rating2 = new Rating(semester.firstQuarter, student, new Date(), Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD, 'd146249c-0341-4c52-bd02-421f104e5c45')
        let ratingEntity2 = RatingEntity.toRatingEntity(rating2);
        expect(await ratingRepository.create(ratingEntity2)).toBeInstanceOf(RatingEntity);
        let results = await ratingRepository.findAll();
        expect(results).toBeDefined();
        expect(results.length).toBe(2);
        expect(results[0].id).toEqual(rating.getId());
        expect(results[1].id).toEqual(rating2.getId());
    });

    it('should update a rating on the BD', async () =>{
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