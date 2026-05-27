import { INestApplication } from "@nestjs/common";
import { createE2EConfing } from "../e2e.confing";
import { TeacherModule } from "@/infrastructure/api/controllers/teacher/teacher.module";
import { DataBaseConnectionModule } from "@/infrastructure/data-base-connection/data-base-connection.module";
import { teachersProviders } from "@/infrastructure/api/controllers/teacher/providers/teachers-providers";
import request from 'supertest';
import { ClassEntity } from "@/infrastructure/entities/class/class.entity";
import { TestDataSource } from "@/infrastructure/repositories/config-test/test.datasource";
import { mockClass } from "../mocks/domain/class.mocks";
import { StudentEntity } from "@/infrastructure/entities/student/student.entity";
import { mockStudent } from "../mocks/domain/student.mocks";
import { WorkerEntity } from "@/infrastructure/entities/worker/worker.entity";
import { mockWorker } from "../mocks/domain/worker.mock";

describe('TEACHAR E2E TESTS', () => {
    let app: INestApplication;

    beforeAll(async () => {
        app = await createE2EConfing([
            TeacherModule,
            DataBaseConnectionModule
        ], teachersProviders)
    });

    afterAll(async () => { await app.close() });

    it('app should be defined', async () => {
        expect(app).toBeDefined();
    });

    describe('business tests', () => {
        it("should not find teacher's classes", async () => {
            const response = await request(app.getHttpServer())
                .get(`/teachers/ae03f7fb-6070-4279-ba4a-69e637c7febd`);
            expect(response.body).toBeDefined();
            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(0);
        });

        it("should find teacher's classes", async () => {
            const studentEntity = StudentEntity.toStudentEntity(mockStudent());
            const studentRepository = TestDataSource.getRepository(StudentEntity);
            await studentRepository.save(studentEntity);

            const teacherEntity = WorkerEntity.toWorkerEntity(mockWorker());
            const teacherRepository = TestDataSource.getRepository(WorkerEntity);
            await teacherRepository.save(teacherEntity);

            const repository = TestDataSource.getRepository(ClassEntity);
            const classEntity = ClassEntity.toClassEntity(mockClass());
            classEntity.setStudents(studentEntity);
            classEntity.setTeacher(teacherEntity);
            const entity = await repository.save(classEntity);

            const wantedId = teacherEntity.id;
            const response = await request(app.getHttpServer())
                .get(`/teachers/${wantedId}`);
            expect(response.body).toBeDefined();
            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(1);
            expect(response.body[0].teacherId).toBe(wantedId);
            expect(response.body[0].students).toHaveLength(1);
            expect(response.body[0].classId).toBe(classEntity.id);
        });

        it("should not find teacher's class to rate", async () => {
            const response = await request(app.getHttpServer())
                .get(`/teachers/ae03f7fb-6070-4279-ba4a-69e637c7febd/classes/1d6d2db0-6c8e-4ab3-8376-c2dd20485c03`);
            expect(response.body).toBeDefined();
            expect(response.status).toBe(404);
            expect(response.body.message).toEqual("class not found.")
        });

        it("should not find teacher's class", async () => {
            const teacherEntity = WorkerEntity.toWorkerEntity(mockWorker());
            const teacherRepository = TestDataSource.getRepository(WorkerEntity);
            await teacherRepository.save(teacherEntity);

            const repository = TestDataSource.getRepository(ClassEntity);
            const classEntity = ClassEntity.toClassEntity(mockClass());
            classEntity.setTeacher(teacherEntity);
            const entity = await repository.save(classEntity);

            const wantedClassId = entity.id;
            const wantedTeacherId = teacherEntity.id;
            const response = await request(app.getHttpServer())
                .get(`/teachers/${wantedTeacherId}/classes/${wantedClassId}`);
            expect(response.body).toBeDefined();
            expect(response.status).toBe(404);
            expect(response.body.message).toEqual("semester not found")
        });
    });

    describe('contoller tests validations', () => {
        it('should throw an error if the request has an invalid UUID for teacher id', async () => {
            const invalidTeacherUUID = 'invalidUUID'
            const response = await request(app.getHttpServer())
                .get(`/teachers/${invalidTeacherUUID}`);
            expect(response.body).toBeDefined();
            expect(response.status).toBe(400);
            expect(response.body.message).toBe("Validation failed (uuid is expected)");
        });

        it("should throw an error if class and teacher ids are invalid", async () => {
            const invalidTeacherUUID = 'invalidUUID'
            const invalidClassUUID = 'invalidUUIDClass'
            const response = await request(app.getHttpServer())
                .get(`/teachers/${invalidTeacherUUID}/classes/${invalidClassUUID}`);
            expect(response.body).toBeDefined();
            expect(response.status).toEqual(400);
            expect(response.body.message).toEqual("Validation failed (uuid is expected)");
        });
    });
});