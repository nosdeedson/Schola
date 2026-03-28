import { TestDataSource } from "../../../../infrastructure/repositories/config-test/test.datasource";
import { DomainMocks } from "../../../../infrastructure/__mocks__/mocks";
import { AcademicSemesterEntity } from "../../../../infrastructure/entities/academic-semester/academic.semester.entity";
import { RatingEntity } from "../../../../infrastructure/entities/rating/rating.entity";
import { StudentEntity } from "../../../../infrastructure/entities/student/student.entity";
import { AcademicSemesterRepository } from "../../../../infrastructure/repositories/academic-semester/academic-semester.repository";
import { RatingRepositiry } from "../../../../infrastructure/repositories/rating/rating.repository";
import { StudentRepository } from "../../../../infrastructure/repositories/student/student.repository";
import { CreateRatingService } from './create.rating.service';
import { CreateRatingDto } from './create.rating.dto';
import { Grade } from "../../../../domain/enum/grade/grade";
import { mockSemester } from "../../../../../tests/mocks/domain/semester.mocks";
import { Repository } from "typeorm";

describe('create rating integration tests', () => {

    let ratingEntity: Repository<RatingEntity>;
    let ratingRepository: RatingRepositiry;

    let studentEntity: Repository<StudentEntity>;
    let studentRepository: StudentRepository;

    let semesterEntity: Repository<AcademicSemesterEntity>;
    let semesterRepository: AcademicSemesterRepository;

    beforeEach(async () => {
        ratingEntity = TestDataSource.getRepository(RatingEntity);
        ratingRepository = new RatingRepositiry(ratingEntity, TestDataSource);
        studentEntity = TestDataSource.getRepository(StudentEntity);
        studentRepository = new StudentRepository(studentEntity, TestDataSource);
        semesterEntity = TestDataSource.getRepository(AcademicSemesterEntity);
        semesterRepository = new AcademicSemesterRepository(semesterEntity, TestDataSource);
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
    })

    it('should insert a rating on database', async () => {
        let student = DomainMocks.mockStudent();
        let studentEntity = StudentEntity.toStudentEntity(student);
        expect(await studentRepository.create(studentEntity)).toBeInstanceOf(StudentEntity);

        let semester = mockSemester();
        let semesterEntity = AcademicSemesterEntity.toEntity(semester);
        expect(await semesterRepository.create(semesterEntity)).toBeInstanceOf(AcademicSemesterEntity);

        let input = new CreateRatingDto(student, semester.firstQuarter, Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD);
        const service = new CreateRatingService(ratingRepository);
        expect(await service.execute(input)).toBe(void 0);
    });

    it('should throw a systemError if semester is null', async () => {
        let student = DomainMocks.mockStudent();
        let studentEntity = StudentEntity.toStudentEntity(student);
        expect(await studentRepository.create(studentEntity)).toBeInstanceOf(StudentEntity);
        let quarter;
        let input = new CreateRatingDto(student, quarter, Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD);
        const service = new CreateRatingService(ratingRepository);
        await expect(service.execute(input)).rejects.toMatchObject({
            errors: [{ context: 'rating', message: 'quarter of rating must be informed' }]
        });
    });

    it('should throw a systemError if student is null', async () => {
        let student;
        let semester = mockSemester();
        let semesterEntity = AcademicSemesterEntity.toEntity(semester);
        expect(await semesterRepository.create(semesterEntity)).toBeInstanceOf(AcademicSemesterEntity);

        let input = new CreateRatingDto(student, semester.firstQuarter, Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD);
        const service = new CreateRatingService(ratingRepository);
        await expect(service.execute(input)).rejects.toMatchObject({errors: 
            [{ context: 'rating', message: 'student receiving rating must be informed' }]
        });
    });

    it('should throw a systemError if listing is null', async () => {
        let student = DomainMocks.mockStudent();
        let studentEntity = StudentEntity.toStudentEntity(student);
        expect(await studentRepository.create(studentEntity)).toBeInstanceOf(StudentEntity);
        let semester = mockSemester();
        let semesterEntity = AcademicSemesterEntity.toEntity(semester);
        expect(await semesterRepository.create(semesterEntity)).toBeInstanceOf(AcademicSemesterEntity);

        let listing;
        let input = new CreateRatingDto(student, semester.firstQuarter, listing, Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD);
        const service = new CreateRatingService(ratingRepository);
        await expect(service.execute(input)).rejects.toMatchObject({errors: 
            [{ context: 'rating', message: 'the listining skill must be informed' }]
        });
    });

    it('should throw a systemError if writing is null', async () => {
        let student = DomainMocks.mockStudent();
        let studentEntity = StudentEntity.toStudentEntity(student);
        expect(await studentRepository.create(studentEntity)).toBeInstanceOf(StudentEntity);

        let semester = mockSemester();
        let semesterEntity = AcademicSemesterEntity.toEntity(semester);
        expect(await semesterRepository.create(semesterEntity)).toBeInstanceOf(AcademicSemesterEntity);

        let writing;
        let input = new CreateRatingDto(student, semester.firstQuarter, Grade.BAD, writing, Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD);
        const service = new CreateRatingService(ratingRepository);
        await expect(service.execute(input)).rejects.toMatchObject({errors:
            [{ context: 'rating', message: 'the writing skill must be informed' }]
        });
    });


    it('should throw a systemError if reading is null', async () => {
        let student = DomainMocks.mockStudent();
        let studentEntity = StudentEntity.toStudentEntity(student);
        expect(await studentRepository.create(studentEntity)).toBeInstanceOf(StudentEntity);

        let semester = mockSemester();
        let semesterEntity = AcademicSemesterEntity.toEntity(semester);
        expect(await semesterRepository.create(semesterEntity)).toBeInstanceOf(AcademicSemesterEntity);

        let reading;
        let input = new CreateRatingDto(student, semester.firstQuarter, Grade.BAD, Grade.BAD, reading, Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD);
        const service = new CreateRatingService(ratingRepository);
        await expect(service.execute(input)).rejects.toMatchObject({errors: 
            [{ context: 'rating', message: 'the reading skill must be informed' }]
        });
    });

    it('should throw a systemError if speaking is null', async () => {
        let student = DomainMocks.mockStudent();
        let studentEntity = StudentEntity.toStudentEntity(student);
        expect(await studentRepository.create(studentEntity)).toBeInstanceOf(StudentEntity);

        let semester = mockSemester();
        let semesterEntity = AcademicSemesterEntity.toEntity(semester);
        expect(await semesterRepository.create(semesterEntity)).toBeInstanceOf(AcademicSemesterEntity);

        let speaking;
        let input = new CreateRatingDto(student, semester.firstQuarter, Grade.BAD, Grade.BAD, Grade.BAD, speaking, Grade.BAD, Grade.BAD, Grade.BAD);
        const service = new CreateRatingService(ratingRepository);
        await expect(service.execute(input)).rejects.toMatchObject({errors: 
            [{ context: 'rating', message: 'the speaking skill must be informed' }]
        });
    });

    it('should throw a systemError if grammar is null', async () => {
        let student = DomainMocks.mockStudent();
        let studentEntity = StudentEntity.toStudentEntity(student);
        expect(await studentRepository.create(studentEntity)).toBeInstanceOf(StudentEntity);

        let semester = mockSemester();
        let semesterEntity = AcademicSemesterEntity.toEntity(semester);
        expect(await semesterRepository.create(semesterEntity)).toBeInstanceOf(AcademicSemesterEntity);

        let grammar;
        let input = new CreateRatingDto(student, semester.firstQuarter, Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD, grammar, Grade.BAD, Grade.BAD);
        const service = new CreateRatingService(ratingRepository);
        await expect(service.execute(input)).rejects.toMatchObject({errors: 
            [{ context: 'rating', message: 'the grammar skill must be informed' }]
        });
    });

    it('should throw a systemError if homework is null', async () => {
        let student = DomainMocks.mockStudent();
        let studentEntity = StudentEntity.toStudentEntity(student);
        expect(await studentRepository.create(studentEntity)).toBeInstanceOf(StudentEntity);

        let semester = mockSemester();
        let semesterEntity = AcademicSemesterEntity.toEntity(semester);
        expect(await semesterRepository.create(semesterEntity)).toBeInstanceOf(AcademicSemesterEntity);

        let homework;
        let input = new CreateRatingDto(student, semester.firstQuarter, Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD, homework, Grade.BAD);
        const service = new CreateRatingService(ratingRepository);
        await expect(service.execute(input)).rejects.toMatchObject({
            errors: [{ context: 'rating', message: 'the homework commitment must be informed' }]
        });
    });

    it('should throw a systemError if vocabulary is null', async () => {
        let student = DomainMocks.mockStudent();
        let studentEntity = StudentEntity.toStudentEntity(student);
        expect(await studentRepository.create(studentEntity)).toBeInstanceOf(StudentEntity);

        let semester = mockSemester();
        let semesterEntity = AcademicSemesterEntity.toEntity(semester);
        expect(await semesterRepository.create(semesterEntity)).toBeInstanceOf(AcademicSemesterEntity);

        let vocabulary;
        let input = new CreateRatingDto(student, semester.firstQuarter, Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD, Grade.BAD, vocabulary);
        const service = new CreateRatingService(ratingRepository);
        await expect(service.execute(input)).rejects.toMatchObject({
            errors:
                [{ context: 'rating', message: 'the vocabulary improvment must be informed' }]
        });
    });
});