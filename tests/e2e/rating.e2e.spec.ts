import { INestApplication } from "@nestjs/common"
import { createE2EConfing } from "./create.e2e.confing";
import { RatingModule } from "@/infrastructure/api/controllers/rating/rating.module";
import { DataBaseConnectionModule } from "@/infrastructure/data-base-connection/data-base-connection.module";
import { providers } from "@/infrastructure/api/controllers/rating/providers/ratings.providers";
import request from "supertest";
import { StudentEntity } from "@/infrastructure/entities/student/student.entity";
import { mockStudent } from "../mocks/domain/student.mocks";
import { TestDataSource } from "@/infrastructure/repositories/config-test/test.datasource";
import { WorkerEntity } from "@/infrastructure/entities/worker/worker.entity";
import { mockWorker } from "../mocks/domain/worker.mock";
import { AcademicSemesterEntity } from "@/infrastructure/entities/academic-semester/academic.semester.entity";
import { mockSemester } from "../mocks/domain/semester.mocks";
import { mockQuarter } from "../mocks/domain/quarter.mocks";

describe('Rating E2E TESTS', () => {
    let app: INestApplication;

    beforeAll(async () => {
        app = await createE2EConfing([RatingModule, DataBaseConnectionModule], providers)
    });

    afterAll(async () => {
        await app.close();
    });

    it('should create a rating', async () => {
        const studentEntity = StudentEntity.toStudentEntity(mockStudent());
        const studentRepository = TestDataSource.getRepository(StudentEntity);
        await studentRepository.save(studentEntity);

        const teacher = WorkerEntity.toWorkerEntity(mockWorker());
        const teacherRepository = TestDataSource.getRepository(WorkerEntity);
        await teacherRepository.save(teacher);

        const semester = AcademicSemesterEntity.toEntity(mockSemester({
            firstQuarter: mockQuarter({ currentQuarter: true })
        }));
        const semesterRespository = TestDataSource.getRepository(AcademicSemesterEntity);
        await semesterRespository.save(semester);

        const dto = {
            "studentBeingEvaluatedId": studentEntity.id,
            "teacherId": teacher.id,
            "listing": "BAD",
            "writing": "BAD",
            "reading": "BAD",
            "speaking": "BAD",
            "grammar": "BAD",
            "homework": "BAD",
            "vocabulary": "BAD",
            "comment": "test comment"
        };
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

        const semester = AcademicSemesterEntity.toEntity(mockSemester({
            currentSemester: false,
            firstQuarter: mockQuarter({ currentQuarter: false }),
            secondQuarter: mockQuarter({ currentQuarter: false }),
        }));
        const semesterRespository = TestDataSource.getRepository(AcademicSemesterEntity);
        await semesterRespository.save(semester);

        const dto = {
            "studentBeingEvaluatedId": studentEntity.id,
            "teacherId": teacher.id,
            "listing": "BAD",
            "writing": "BAD",
            "reading": "BAD",
            "speaking": "BAD",
            "grammar": "BAD",
            "homework": "BAD",
            "vocabulary": "BAD",
            "comment": "test comment"
        };
        const response = await request(app.getHttpServer())
            .post('/ratings')
            .send(dto);
        expect(response).toBeDefined();
        expect(response.status).toBe(400);
    });

    it('should not found a student', async () => {

        const teacher = WorkerEntity.toWorkerEntity(mockWorker());
        const teacherRepository = TestDataSource.getRepository(WorkerEntity);
        await teacherRepository.save(teacher);

        const semester = AcademicSemesterEntity.toEntity(mockSemester({
            firstQuarter: mockQuarter({ currentQuarter: true })
        }));
        const semesterRespository = TestDataSource.getRepository(AcademicSemesterEntity);
        await semesterRespository.save(semester);

        const dto = {
            "studentBeingEvaluatedId": "efec62f3-c935-4bac-a73d-d2d4dcda0793",
            "teacherId": teacher.id,
            "listing": "BAD",
            "writing": "BAD",
            "reading": "BAD",
            "speaking": "BAD",
            "grammar": "BAD",
            "homework": "BAD",
            "vocabulary": "BAD",
            "comment": "test comment"
        };
        const response = await request(app.getHttpServer())
            .post('/ratings')
            .send(dto);
        expect(response).toBeDefined();
        expect(response.status).toBe(400);
    });

    it('should not find a teacher', async () => {
        const studentEntity = StudentEntity.toStudentEntity(mockStudent());
        const studentRepository = TestDataSource.getRepository(StudentEntity);
        await studentRepository.save(studentEntity);

        const semester = AcademicSemesterEntity.toEntity(mockSemester({
            firstQuarter: mockQuarter({ currentQuarter: true })
        }));
        const semesterRespository = TestDataSource.getRepository(AcademicSemesterEntity);
        await semesterRespository.save(semester);

        const dto = {
            "studentBeingEvaluatedId": studentEntity.id,
            "teacherId": "91ce38fb-9391-4918-9d0c-c2fa768ac03a",
            "listing": "BAD",
            "writing": "BAD",
            "reading": "BAD",
            "speaking": "BAD",
            "grammar": "BAD",
            "homework": "BAD",
            "vocabulary": "BAD",
            "comment": "test comment"
        };
        const response = await request(app.getHttpServer())
            .post('/ratings')
            .send(dto);
        expect(response).toBeDefined();
        expect(response.status).toBe(400);
    });
})
