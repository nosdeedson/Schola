import { INestApplication } from "@nestjs/common"
import { createE2EConfing } from "./create.e2e.confing";
import { SemesterModule } from "@/infrastructure/api/controllers/semester/semester.module";
import { DataBaseConnectionModule } from "@/infrastructure/data-base-connection/data-base-connection.module";
import { providers } from "@/infrastructure/api/controllers/semester/providers/semesters.providers";
import request from 'supertest';
import { AcademicSemesterEntity } from "@/infrastructure/entities/academic-semester/academic.semester.entity";
import { mockSemester } from "../mocks/domain/semester.mocks";
import { TestDataSource } from "@/infrastructure/repositories/config-test/test.datasource";

describe('SEMESTER E2E TESTS', () => {
    let app: INestApplication;

    beforeAll(async () => {
        app = await createE2EConfing([SemesterModule, DataBaseConnectionModule], providers);
    });

    afterAll(async () => {
        await app.close();
    });

    it('should not find a semester', async () => {
        const response = await request(app.getHttpServer())
            .get('/semesters/93aaa908-2d46-4779-80ff-7a2ba0f45458');
        expect(response.body).toBeDefined();
        expect(response.status).toBe(404)
    });

    it('should find a semester', async () => {
        const semesterEntity = AcademicSemesterEntity.toEntity(mockSemester());
        const semesterRepository = TestDataSource.getRepository(AcademicSemesterEntity);
        await semesterRepository.save(semesterEntity);
        const response = await request(app.getHttpServer())
            .get(`/semesters/${semesterEntity.id}`);
        expect(response.body).toBeDefined();
        expect(response.status).toBe(200)
        expect(response.body.id).toBe(semesterEntity.id)
    });

    it('should find an empty array semester', async () => {
        const response = await request(app.getHttpServer())
            .get(`/semesters`);
        expect(response.body).toBeDefined();
        expect(response.status).toBe(200)
        expect(response.body).toHaveLength(0)
    });

    it('should find all semester', async () => {
        const semesterEntity = AcademicSemesterEntity.toEntity(mockSemester());
        const semesterRepository = TestDataSource.getRepository(AcademicSemesterEntity);
        await semesterRepository.save(semesterEntity);
        const response = await request(app.getHttpServer())
            .get(`/semesters`);
        expect(response.body).toBeDefined();
        expect(response.status).toBe(200)
        expect(response.body).toHaveLength(1)
        expect(response.body[0].id).toBe(semesterEntity.id)
    });

    it('should delete a semester', async () => {
        const semesterEntity = AcademicSemesterEntity.toEntity(mockSemester());
        const semesterRepository = TestDataSource.getRepository(AcademicSemesterEntity);
        await semesterRepository.save(semesterEntity);
        const response = await request(app.getHttpServer())
            .delete(`/semesters/${semesterEntity.id}`);
        expect(response.body).toBeDefined();
        expect(response.status).toBe(204);
        const validation = await request(app.getHttpServer())
            .get(`/semester/${semesterEntity.id}`);
        expect(validation.body).toBeDefined();
        expect(validation.status).toBe(404);
    });

    it('should not throw an exception while deleting a semester when it does not exist', async () => {
        const wantedId = "d452bcc2-b2f5-434d-b250-486476ce0400"
        const response = await request(app.getHttpServer())
            .delete(`/semesters/${wantedId}`);
        expect(response.body).toBeDefined();
        expect(response.status).toBe(204);
    });

    it('should update a semester', async () => {
        const semesterEntity = AcademicSemesterEntity.toEntity(mockSemester());
        const semesterRepository = TestDataSource.getRepository(AcademicSemesterEntity);
        await semesterRepository.save(semesterEntity);
        const dto = {
            "id": semesterEntity.id,
            "updatingQuarter": false,
            "updatingSemester": true
        }
        const response = await request(app.getHttpServer())
            .put(`/semesters`)
            .send(dto);
        expect(response.body).toBeDefined();
        expect(response.status).toBe(200);
        /** won't find anyone because the update will set deleted_at */
        const validation = await request(app.getHttpServer())
            .get(`/semesters`);
        expect(validation.body).toBeDefined();
        expect(validation.status).toBe(200);
        expect(validation.body).toHaveLength(0);
    });

    it('should not update a semester', async () => {
        const dto = {
            "id": "80fe54a8-b542-4040-bea4-010f13c515cd",
            "updatingQuarter": false,
            "updatingSemester": true
        }
        const response = await request(app.getHttpServer())
            .put(`/semesters`)
            .send(dto);
        expect(response.body).toBeDefined();
        expect(response.status).toBe(404);
    });

    it('should create a semester', async () => {
        const dto = {
            "firstQuarter": {
                "beginningDate": "2026-02-02T00:16:52.483Z",
                "endingDate": "2026-04-15T23:16:52.483Z",
                "currentQuarter": true
            },
            "secondQuarter": {
                "beginningDate": "2026-04-16T00:16:52.483Z",
                "endingDate": "2026-06-30T23:16:52.483Z",
                "currentQuarter": false
            },
            "currentSemester": true
        };
        const response = await request(app.getHttpServer())
            .post('/semesters')
            .send(dto);
        expect(response.body).toBeDefined();
        expect(response.status).toBe(201)
    })
});
