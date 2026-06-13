import { Repository } from "typeorm";
import { Grade } from "../../../../domain/enum/grade/grade";
import { AcademicSemesterEntity } from "../../../../infrastructure/entities/academic-semester/academic.semester.entity";
import { RatingEntity } from "../../../../infrastructure/entities/rating/rating.entity";
import { StudentEntity } from "../../../../infrastructure/entities/student/student.entity";
import { AcademicSemesterRepository } from "../../../../infrastructure/repositories/academic-semester/academic-semester.repository";
import { RatingRepository } from "../../../../infrastructure/repositories/rating/rating.repository";
import { StudentRepository } from "../../../../infrastructure/repositories/student/student.repository";
import { UpdateRatingDto } from "./udpate.rating.dto";
import { UpdateRatingService } from './update.rating.service';
import { mockSemester } from "../../../../../tests/mocks/domain/semester.mocks";
import { mockRating } from "../../../../../tests/mocks/domain/rating.mocks";
import { TestDataSource } from "../../../../infrastructure/repositories/config-test/test.datasource";
import { AcademicSemesterMapper } from "@/infrastructure/mappers/semester/academic-semester-mapper";
import { RatingMapper } from "@/infrastructure/mappers/rating/rating-mapper";
import { StudentMapper } from "@/infrastructure/mappers/student/student-mapper";
import { Student } from "@/domain/student/student";
import { AcademicSemester } from "@/domain/academc-semester/academic.semester";
import { Rating } from "@/domain/rating/rating";


describe('update rating service integration tests', () => {

    let ratingEntity: Repository<RatingEntity>;
    let ratingRepository: RatingRepository;

    let studentEntity: Repository<StudentEntity>;
    let studentRepository: StudentRepository;

    let semesterEntity: Repository<AcademicSemesterEntity>;
    let semesterRepository: AcademicSemesterRepository;

    beforeAll(async () => {
        ratingEntity = TestDataSource.getRepository(RatingEntity);
        ratingRepository = new RatingRepository(TestDataSource);
        studentEntity = TestDataSource.getRepository(StudentEntity);
        studentRepository = new StudentRepository(TestDataSource);
        semesterEntity = TestDataSource.getRepository(AcademicSemesterEntity);
        semesterRepository = new AcademicSemesterRepository(TestDataSource);
    });

    afterEach(async () => {
        jest.clearAllMocks();
    })

    it('entities and repositories must be instantiated', async () => {
        expect(ratingEntity).toBeDefined()
        expect(ratingRepository).toBeDefined()
        expect(studentEntity).toBeDefined();
        expect(studentRepository).toBeDefined()
        expect(semesterEntity).toBeDefined();
        expect(semesterRepository).toBeDefined();
    });

    it('should throw a SystemError if rating not found', async () => {
        let semester = mockSemester();
        let rating = mockRating({ quarter: semester.firstQuarter });

        let studentEntity = StudentMapper.fromDomain(rating.getStudent());
        expect(await studentRepository.create(studentEntity)).toBeInstanceOf(Student);

        let semesterEntity = AcademicSemesterMapper.fromDomain(semester);
        expect(await semesterRepository.create(semesterEntity)).toBeInstanceOf(AcademicSemester);

        rating.getStudent
        let ratingEntity = RatingMapper.fromDomain(rating);
        expect(await ratingRepository.create(ratingEntity)).toBeInstanceOf(Rating);

        let wantedid = 'b4145be7-0fed-4a64-8a45-24bdd594cd20';

        let input = new UpdateRatingDto(wantedid, Grade.GOOD, Grade.GOOD, Grade.GOOD, Grade.GOOD, Grade.GOOD, Grade.GOOD, Grade.GOOD);
        const service = new UpdateRatingService(ratingRepository);
        await expect(service.execute(input)).rejects.toMatchObject({
            errors: [{ "context": "rating", "message": "Not found" }]
        });
    })

    it('should update a rating', async () => {
        let semester = mockSemester();
        let rating = mockRating({ quarter: semester.firstQuarter });
        let student = rating.getStudent();

        let studentEntity = StudentMapper.fromDomain(student);
        expect(await studentRepository.create(studentEntity)).toBeInstanceOf(Student);

        let semesterEntity = AcademicSemesterMapper.fromDomain(semester);
        expect(await semesterRepository.create(semesterEntity)).toBeInstanceOf(AcademicSemester);

        let ratingEntity = RatingMapper.fromDomain(rating);
        expect(await ratingRepository.create(ratingEntity)).toBeInstanceOf(Rating);

        let wantedid = rating.getId();

        let input = new UpdateRatingDto(wantedid, Grade.GOOD, Grade.GOOD, Grade.GOOD, Grade.GOOD, Grade.GOOD, Grade.GOOD, Grade.GOOD);
        const service = new UpdateRatingService(ratingRepository);
        expect(await service.execute(input)).toBe(void 0);
        let result = await ratingRepository.find(wantedid);
        expect(result.getListing()).toBe(input.listing);
        expect(result.getWriting()).toBe(input.writing);
        expect(result.getReading()).toBe(input.reading);
        expect(result.getSpeaking()).toBe(input.speaking);
        expect(result.getHomework()).toBe(input.homework);
        expect(result.getGrammar()).toBe(input.grammar);
        expect(result.getVocabulary()).toBe(input.vocabulary);
        expect(result.getUpdatedAt().getTime()).toBeGreaterThan(rating.getUpdatedAt().getTime());
    });

});
