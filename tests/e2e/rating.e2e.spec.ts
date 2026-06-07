import { INestApplication } from "@nestjs/common"
import { createE2EConfing } from "../e2e.confing";
import { RatingModule } from "@/infrastructure/api/controllers/rating/rating.module";
import { DataBaseConnectionModule } from "@/infrastructure/data-base-connection/data-base-connection.module";
import { ratingsProviders } from "@/infrastructure/api/controllers/rating/providers/ratings.providers";
import request from "supertest";
import { StudentEntity } from "@/infrastructure/entities/student/student.entity";
import { mockStudent } from "../mocks/domain/student.mocks";
import { TestDataSource } from "@/infrastructure/repositories/config-test/test.datasource";
import { WorkerEntity } from "@/infrastructure/entities/worker/worker.entity";
import { mockWorker } from "../mocks/domain/worker.mock";
import { AcademicSemesterEntity } from "@/infrastructure/entities/academic-semester/academic.semester.entity";
import { mockSemester } from "../mocks/domain/semester.mocks";
import { mockQuarter } from "../mocks/domain/quarter.mocks";
import { mockSaveRatingRequest } from "../mocks/controller/save-rating-request-dto-mock";
import { AcademicSemesterMapper } from "@/infrastructure/mappers/semester/academic-semester-mapper";

describe('Rating E2E TESTS', () => {
    let app: INestApplication;

    beforeAll(async () => {
        app = await createE2EConfing([RatingModule, DataBaseConnectionModule], ratingsProviders)
    });

    afterAll(async () => {
        await app.close();
    });

    describe('business tests', () => {

        it('should create a rating', async () => {
            const studentEntity = StudentEntity.toStudentEntity(mockStudent());
            const studentRepository = TestDataSource.getRepository(StudentEntity);
            await studentRepository.save(studentEntity);

            const teacher = WorkerEntity.toWorkerEntity(mockWorker());
            const teacherRepository = TestDataSource.getRepository(WorkerEntity);
            await teacherRepository.save(teacher);

            const semester = AcademicSemesterMapper.fromDomain(mockSemester({
                firstQuarter: mockQuarter({ currentQuarter: true })
            }));
            const semesterRespository = TestDataSource.getRepository(AcademicSemesterEntity);
            await semesterRespository.save(semester);

            const dto = mockSaveRatingRequest({
                studentBeingEvaluatedId: studentEntity.id,
                teacherId: teacher.id
            });
            const response = await request(app.getHttpServer())
                .post('/ratings')
                .send(dto);
            expect(response).toBeDefined();
            expect(response.status).toBe(201);
        });

        it('should not find the semester', async () => {
            const studentEntity = StudentEntity.toStudentEntity(mockStudent());
            const studentRepository = TestDataSource.getRepository(StudentEntity);
            await studentRepository.save(studentEntity);

            const teacher = WorkerEntity.toWorkerEntity(mockWorker());
            const teacherRepository = TestDataSource.getRepository(WorkerEntity);
            await teacherRepository.save(teacher);

            const semester = AcademicSemesterMapper.fromDomain(mockSemester({
                currentSemester: false,
                firstQuarter: mockQuarter({ currentQuarter: false }),
                secondQuarter: mockQuarter({ currentQuarter: false }),
            }));
            const semesterRespository = TestDataSource.getRepository(AcademicSemesterEntity);
            await semesterRespository.save(semester);
            const dto = mockSaveRatingRequest({
                studentBeingEvaluatedId: studentEntity.id,
                teacherId: teacher.id
            });
            const response = await request(app.getHttpServer())
                .post('/ratings')
                .send(dto);
            expect(response).toBeDefined();
            expect(response.status).toBe(404);
            expect(response.body.message).toBe('semester not found');
        });

        it('should not found a student', async () => {

            const teacher = WorkerEntity.toWorkerEntity(mockWorker());
            const teacherRepository = TestDataSource.getRepository(WorkerEntity);
            await teacherRepository.save(teacher);

            const semester = AcademicSemesterMapper.fromDomain(mockSemester({
                firstQuarter: mockQuarter({ currentQuarter: true })
            }));
            const semesterRespository = TestDataSource.getRepository(AcademicSemesterEntity);
            await semesterRespository.save(semester);

            const dto = mockSaveRatingRequest({
                teacherId: teacher.id
            });
            const response = await request(app.getHttpServer())
                .post('/ratings')
                .send(dto);
            expect(response).toBeDefined();
            expect(response.status).toBe(404);
        });

        it('should not find a teacher', async () => {
            const studentEntity = StudentEntity.toStudentEntity(mockStudent());
            const studentRepository = TestDataSource.getRepository(StudentEntity);
            await studentRepository.save(studentEntity);

            const semester = AcademicSemesterMapper.fromDomain(mockSemester({
                firstQuarter: mockQuarter({ currentQuarter: true })
            }));
            const semesterRespository = TestDataSource.getRepository(AcademicSemesterEntity);
            await semesterRespository.save(semester);

            const dto = mockSaveRatingRequest({
                studentBeingEvaluatedId: studentEntity.id,
            });

            const response = await request(app.getHttpServer())
                .post('/ratings')
                .send(dto);
            expect(response).toBeDefined();
            expect(response.status).toBe(404);
        });
    });

    describe('controller validations', () => {
        it('should throw an error if id student is null', async () => {
            const dto = mockSaveRatingRequest();
            dto.studentBeingEvaluatedId = null;
            const response = await request(app.getHttpServer())
                .post("/ratings")
                .send(dto);
            expect(response.body).toBeDefined();
            expect(response.body.message).toEqual(["Student Id is required",]);
        });

        it('should throw an error if id student is not present', async () => {
            const dto = mockSaveRatingRequest();
            delete dto.studentBeingEvaluatedId;
            const response = await request(app.getHttpServer())
                .post("/ratings")
                .send(dto);
            expect(response.body).toBeDefined();
            expect(response.body.message).toEqual(["Student Id is required",]);
        });

        it('should throw an error if id teacher is null', async () => {
            const dto = mockSaveRatingRequest();
            dto.teacherId = null;
            const response = await request(app.getHttpServer())
                .post("/ratings")
                .send(dto);
            expect(response.body).toBeDefined();
            expect(response.body.message).toEqual(["Teacher Id is required",]);
        });

        it('should throw an error if teacher id is not present', async () => {
            const dto = mockSaveRatingRequest();
            delete dto.teacherId;
            const response = await request(app.getHttpServer())
                .post("/ratings")
                .send(dto);
            expect(response.body).toBeDefined();
            expect(response.body.message).toEqual(["Teacher Id is required",]);
        });

        it('should throw an error if listining is null', async () => {
            const dto = mockSaveRatingRequest();
            dto.listing = null;
            const response = await request(app.getHttpServer())
                .post("/ratings")
                .send(dto);
            expect(response.body).toBeDefined();
            expect(response.body.message).toEqual(["Listining skills is required",]);
        });

        it('should throw an error if listining is not presend', async () => {
            const dto = mockSaveRatingRequest();
            delete dto.listing;
            const response = await request(app.getHttpServer())
                .post("/ratings")
                .send(dto);
            expect(response.body).toBeDefined();
            expect(response.body.message).toEqual(["Listining skills is required",]);
        });

        it('should throw an error if writing is null', async () => {
            const dto = mockSaveRatingRequest();
            dto.writing = null;
            const response = await request(app.getHttpServer())
                .post("/ratings")
                .send(dto);
            expect(response.body).toBeDefined();
            expect(response.body.message).toEqual(["Writing skills is required",]);
        });

        it('should throw an error if writing is not present', async () => {
            const dto = mockSaveRatingRequest();
            delete dto.writing;
            const response = await request(app.getHttpServer())
                .post("/ratings")
                .send(dto);
            expect(response.body).toBeDefined();
            expect(response.body.message).toEqual(["Writing skills is required",]);
        });

        it('should throw an error if reading is null', async () => {
            const dto = mockSaveRatingRequest();
            dto.reading = null;
            const response = await request(app.getHttpServer())
                .post("/ratings")
                .send(dto);
            expect(response.body).toBeDefined();
            expect(response.body.message).toEqual(["Reading skills is required",]);
        });

        it('should throw an error if reading is not present', async () => {
            const dto = mockSaveRatingRequest();
            delete dto.reading;
            const response = await request(app.getHttpServer())
                .post("/ratings")
                .send(dto);
            expect(response.body).toBeDefined();
            expect(response.body.message).toEqual(["Reading skills is required",]);
        });

        it('should throw an error if speaking is null', async () => {
            const dto = mockSaveRatingRequest();
            dto.speaking = null;
            const response = await request(app.getHttpServer())
                .post("/ratings")
                .send(dto);
            expect(response.body).toBeDefined();
            expect(response.body.message).toEqual(["Speaking skills is required",]);
        });

        it('should throw an error if speaking is not present', async () => {
            const dto = mockSaveRatingRequest();
            delete dto.speaking;
            const response = await request(app.getHttpServer())
                .post("/ratings")
                .send(dto);
            expect(response.body).toBeDefined();
            expect(response.body.message).toEqual(["Speaking skills is required",]);
        });

        it('should throw an error if grammar is null', async () => {
            const dto = mockSaveRatingRequest();
            dto.grammar = null;
            const response = await request(app.getHttpServer())
                .post("/ratings")
                .send(dto);
            expect(response.body).toBeDefined();
            expect(response.body.message).toEqual(["Grammar skills is required",]);
        });

        it('should throw an error if grammar is not present', async () => {
            const dto = mockSaveRatingRequest();
            delete dto.grammar;
            const response = await request(app.getHttpServer())
                .post("/ratings")
                .send(dto);
            expect(response.body).toBeDefined();
            expect(response.body.message).toEqual(["Grammar skills is required",]);
        });

        it('should throw an error if homework is null', async () => {
            const dto = mockSaveRatingRequest();
            dto.homework = null;
            const response = await request(app.getHttpServer())
                .post("/ratings")
                .send(dto);
            expect(response.body).toBeDefined();
            expect(response.body.message).toEqual(["Homework skills is required",]);
        });

        it('should throw an error if homework is not present', async () => {
            const dto = mockSaveRatingRequest();
            delete dto.homework;
            const response = await request(app.getHttpServer())
                .post("/ratings")
                .send(dto);
            expect(response.body).toBeDefined();
            expect(response.body.message).toEqual(["Homework skills is required",]);
        });

        it('should throw an error if vocabulary is null', async () => {
            const dto = mockSaveRatingRequest();
            dto.vocabulary = null;
            const response = await request(app.getHttpServer())
                .post("/ratings")
                .send(dto);
            expect(response.body).toBeDefined();
            expect(response.body.message).toEqual(["Vocabulary skills is required",]);
        });

        it('should throw an error if vocabulary is not present', async () => {
            const dto = mockSaveRatingRequest();
            delete dto.vocabulary;
            const response = await request(app.getHttpServer())
                .post("/ratings")
                .send(dto);
            expect(response.body).toBeDefined();
            expect(response.body.message).toEqual(["Vocabulary skills is required",]);
        });

        it('should throw an error if comment is null', async () => {
            const dto = mockSaveRatingRequest();
            dto.comment = null;
            const response = await request(app.getHttpServer())
                .post("/ratings")
                .send(dto);
            expect(response.body).toBeDefined();
            expect(response.body.message).toEqual([
                "comment should be less than 500",
                "A teacher's comment is requited",
            ]);
        });

        it('should throw an error if comment is not present', async () => {
            const dto = mockSaveRatingRequest();
            delete dto.comment;
            const response = await request(app.getHttpServer())
                .post("/ratings")
                .send(dto);
            expect(response.body).toBeDefined();
            expect(response.body.message).toEqual([
                "comment should be less than 500",
                "A teacher's comment is requited",
            ]);
        });

    });
});
