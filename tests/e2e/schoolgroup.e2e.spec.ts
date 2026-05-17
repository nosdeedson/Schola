import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { SchoolgroupModule } from "../../src/infrastructure/api/controllers/schoolgroup/schoolgroup.module";
import { DATA_SOURCE, DataBaseConnectionModule } from "../../src/infrastructure/data-base-connection/data-base-connection.module";
import request from 'supertest';
import { providers } from "../../src/infrastructure/api/controllers/schoolgroup/providers/schoolgroups.providers";
import { UpdateSchoolgroupRequestDto } from "../../src/infrastructure/api/controllers/schoolgroup/dto/update/update-schoolgroup-request-dto";
import { TestDataSource } from "../../src/infrastructure/repositories/config-test/test.datasource";
import { ClassEntity } from "../../src/infrastructure/entities/class/class.entity";
import { mockClass } from "../mocks/domain/class.mocks";
import { mockWorker } from "../mocks/domain/worker.mock";
import { WorkerEntity } from "../../src/infrastructure/entities/worker/worker.entity";
import { createE2EConfing } from "./create.e2e.confing";

describe('SCHOOLGROUP CONTROLLER', () => {
    let app: INestApplication;

    beforeAll(async () => {
        app = await createE2EConfing([SchoolgroupModule, DataBaseConnectionModule], providers)
    });

    afterAll(async () => {
        await app.close();
    });

    it('should create a class', async () => {
        const dto = {
            "nameBook": "C1",
            "name": "C1-morning",
            "scheduleDto": {
                "dayOfWeeks": [
                    "Monday",
                    "Tuesday"
                ],
                "times": [
                    "08:00",
                    "09:00"
                ]
            },
            "teacherName": "Amelia Teacher"
        }
        const response = await request(app.getHttpServer())
            .post('/classes').send(dto);

        expect(response.body).toBeDefined();
        expect(response.status).toBe(201);
        const validate = await request(app.getHttpServer())
            .get("/classes");

        expect(validate).toBeDefined();
        expect(validate.body).toHaveLength(1)
    });

    it("should get all classes", async () => {
        const repository = TestDataSource.getRepository(ClassEntity);
        const classEntity = ClassEntity.toClassEntity(mockClass());
        const entity = await repository.save(classEntity);
        const response = await request(app.getHttpServer())
            .get('/classes');
        expect(response.status).toBe(200)
        expect(response.body).toBeDefined();
        expect(response.body).toHaveLength(1);
        expect(response.body[0].id).toBe(entity.id);
    });

    it('GET CLASS by id/', async () => {
        const repository = TestDataSource.getRepository(ClassEntity);
        const classEntity = ClassEntity.toClassEntity(mockClass());
        const entity = await repository.save(classEntity);
        const wantedId = entity.id;
        const response = await request(app.getHttpServer())
            .get(`/classes/${wantedId}`);
        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
        expect(response.body.id).toBe(wantedId);
    });

    it('should update a class', async () => {
        const teacherReposittory = TestDataSource.getRepository(WorkerEntity);
        const teacher = WorkerEntity.toWorkerEntity(mockWorker());
        const teacherEntity = await teacherReposittory.save(teacher);
        const repository = TestDataSource.getRepository(ClassEntity);
        let classEntity = ClassEntity.toClassEntity(mockClass());
        classEntity.setTeacher(teacherEntity);
        const entity = await repository.save(classEntity);
        const wantedId = entity.id;
        const wantedNameBook = "updatedBookName"
        const wantedNameTeacher = teacherEntity.fullName;
        const dto = new UpdateSchoolgroupRequestDto();
        dto.id = wantedId;
        dto.nameBook = wantedNameBook;
        dto.teacherName = wantedNameTeacher;
        const response = await request(app.getHttpServer())
            .patch(`/classes`).send(dto);
        expect(response).toBeDefined();
        expect(response.status).toBe(200);
        const validation = await request(app.getHttpServer())
            .get(`/classes/${wantedId}`);

        expect(validation.body.id).toBe(wantedId);
        expect(validation.body.nameBook).toBe(wantedNameBook);

    });

    it('should delete a class', async () => {
        const repository = TestDataSource.getRepository(ClassEntity);
        const classEntity = ClassEntity.toClassEntity(mockClass());
        const entity = await repository.save(classEntity);
        const wantedId = entity.id;
        const response = await request(app.getHttpServer())
            .delete(`/classes/${wantedId}`);
        expect(response.status).toBe(200);
        const validation = await request(app.getHttpServer())
            .get("/classes");
        expect(validation.body).toHaveLength(0);
    });

});
