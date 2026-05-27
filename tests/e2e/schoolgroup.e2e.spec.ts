import { INestApplication } from "@nestjs/common";
import { SchoolgroupModule } from "../../src/infrastructure/api/controllers/schoolgroup/schoolgroup.module";
import { DataBaseConnectionModule } from "../../src/infrastructure/data-base-connection/data-base-connection.module";
import request from 'supertest';
import { schoolgroupsProviders } from "../../src/infrastructure/api/controllers/schoolgroup/providers/schoolgroups.providers";
import { UpdateSchoolgroupRequestDto } from "../../src/infrastructure/api/controllers/schoolgroup/dto/update/update-schoolgroup-request-dto";
import { TestDataSource } from "../../src/infrastructure/repositories/config-test/test.datasource";
import { ClassEntity } from "../../src/infrastructure/entities/class/class.entity";
import { mockClass } from "../mocks/domain/class.mocks";
import { mockWorker } from "../mocks/domain/worker.mock";
import { WorkerEntity } from "../../src/infrastructure/entities/worker/worker.entity";
import { createE2EConfing } from "../e2e.confing";
import { mockCreateSchoolgroupRequestDto } from "../mocks/controller/schoolgroup-request-dto-mock";
import { mockScheduleRequestDto } from "../mocks/controller/schedule-request-dto-mock";

describe('SCHOOLGROUP CONTROLLER', () => {
    let app: INestApplication;

    beforeEach(async () => {
        app = await createE2EConfing([SchoolgroupModule, DataBaseConnectionModule], schoolgroupsProviders)
    });

    afterEach(async () => {
        await app.close();
        jest.clearAllMocks();
    })

    it('should create a class', async () => {
        const dto = mockCreateSchoolgroupRequestDto()
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
        let dto = new UpdateSchoolgroupRequestDto();
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

    it('should not create a class without name of the book', async () => {
        const dto = mockCreateSchoolgroupRequestDto();
        dto.nameBook = null;
        const response = await request(app.getHttpServer())
            .post('/classes').send(dto);
        expect(response.body).toBeDefined();
        expect(response.status).toBe(400);
        expect(response.body.message).toEqual(["Name of the book is required"])
    });

    it('should not create a class without name', async () => {
        const dto = mockCreateSchoolgroupRequestDto();
        dto.name = null;
        const response = await request(app.getHttpServer())
            .post('/classes').send(dto);
        expect(response.body).toBeDefined();
        expect(response.status).toBe(400);
        expect(response.body.message).toEqual(["Name of the class is required"])
    });

    it('should not create a class without schedule', async () => {
        const dto = mockCreateSchoolgroupRequestDto();
        dto.scheduleDto = null;
        const response = await request(app.getHttpServer())
            .post('/classes').send(dto);
        expect(response.body).toBeDefined();
        expect(response.status).toBe(400);
        expect(response.body.message).toStrictEqual(["Schedule of the class is required", "Schedule must have the days of week of a class and the times"])
    });

    it('should not create a class wiht schedule whitout times', async () => {
        const scheduleDto = mockScheduleRequestDto()
        const dto = mockCreateSchoolgroupRequestDto();
        dto.scheduleDto.times = null;
        const response = await request(app.getHttpServer())
            .post('/classes').send(dto);
        expect(response.body).toBeDefined();
        expect(response.status).toBe(400);
        expect(response.body.message).toEqual(['scheduleDto.Times of the class is required'])
    });

    it('should not create a class wiht schedule whitout dayofWeeks', async () => {
        const dto = mockCreateSchoolgroupRequestDto();
        dto.scheduleDto.dayOfWeeks = null;
        const response = await request(app.getHttpServer())
            .post('/classes').send(dto);
        expect(response.body).toBeDefined();
        expect(response.status).toBe(400);
        expect(response.body.message).toEqual(["scheduleDto.Days of week of the class is required"])
    });
});
