import { INestApplication } from "@nestjs/common"
import { createE2EConfing } from "../e2e.confing";
import { SemesterModule } from "@/infrastructure/api/controllers/semester/semester.module";
import { DataBaseConnectionModule } from "@/infrastructure/data-base-connection/data-base-connection.module";
import { semestersProviders } from "@/infrastructure/api/controllers/semester/providers/semesters.providers";
import request from 'supertest';
import { AcademicSemesterEntity } from "@/infrastructure/entities/academic-semester/academic.semester.entity";
import { mockSemester } from "../mocks/domain/semester.mocks";
import { TestDataSource } from "@/infrastructure/repositories/config-test/test.datasource";
import { mockSemesterRequestDto } from "../mocks/controller/semester-request-dto-mock";

describe('SEMESTER E2E TESTS', () => {
    let app: INestApplication;

    beforeAll(async () => {
        app = await createE2EConfing([SemesterModule, DataBaseConnectionModule], semestersProviders);
    });

    afterAll(async () => {
        await app.close();
    });

    describe('business tests', () => {

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
            const dto = mockSemesterRequestDto({
                currentSemester: true,
                secondQuarter: {
                    beginningDate: "2026-04-16T00:16:52.483Z",
                    endingDate: "2026-06-30T23:16:52.483Z",
                    currentQuarter: false
                }
            })
            const response = await request(app.getHttpServer())
                .post('/semesters')
                .send(dto);
            expect(response.body).toBeDefined();
            expect(response.status).toBe(201)
        });
    });

    describe('controller validations tests', () => {

        it('should throw an error if firstquarter is null', async () => {
            const dto = mockSemesterRequestDto();
            dto.firstQuarter = null;
            const response = await request(app.getHttpServer())
                .post('/semesters').send(dto);
            expect(response.body).toBeDefined();
            expect(response.status).toBe(400)
            expect(response.body.message).toEqual([
                "Fistquarter is required",
                "Fisrtquater must be a QuarterRequestDto"
            ]);
        });

        it('should throw an error if firstquarter is not present', async () => {
            const dto = mockSemesterRequestDto();
            delete dto.firstQuarter;
            const response = await request(app.getHttpServer())
                .post('/semesters').send(dto);
            expect(response.body).toBeDefined();
            expect(response.status).toBe(400)
            expect(response.body.message).toEqual(["Fistquarter is required",]);
        });

        it('should throw an error if firstquarter has the beginning date as null', async () => {
            const dto = mockSemesterRequestDto();
            dto.firstQuarter.beginningDate = null;
            const response = await request(app.getHttpServer())
                .post('/semesters').send(dto);
            expect(response.body).toBeDefined();
            expect(response.status).toBe(400)
            expect(response.body.message).toEqual(["firstQuarter.The beginning of the semester is required",]);
        });

        it('should throw an error if firstquarter has no beginning date', async () => {
            const dto = mockSemesterRequestDto();
            delete dto.firstQuarter.beginningDate;
            const response = await request(app.getHttpServer())
                .post('/semesters').send(dto);
            expect(response.body).toBeDefined();
            expect(response.status).toBe(400)
            expect(response.body.message).toEqual(["firstQuarter.The beginning of the semester is required"]);
        });

        it('should throw an error if firstquarter has no ending date null', async () => {
            const dto = mockSemesterRequestDto();
            dto.firstQuarter.endingDate = null;
            const response = await request(app.getHttpServer())
                .post('/semesters').send(dto);
            expect(response.body).toBeDefined();
            expect(response.status).toBe(400)
            expect(response.body.message).toEqual(["firstQuarter.The ending of the semester is required"]);
        });

        it('should throw an error if firstquarter has no ending date', async () => {
            const dto = mockSemesterRequestDto();
            delete dto.firstQuarter.endingDate;
            const response = await request(app.getHttpServer())
                .post('/semesters').send(dto);
            expect(response.body).toBeDefined();
            expect(response.status).toBe(400)
            expect(response.body.message).toEqual(["firstQuarter.The ending of the semester is required"]);
        });

        it('should throw an error if firstquarter has currentQuarter as null', async () => {
            const dto = mockSemesterRequestDto();
            dto.firstQuarter.currentQuarter = null;
            const response = await request(app.getHttpServer())
                .post('/semesters').send(dto);
            expect(response.body).toBeDefined();
            expect(response.status).toBe(400)
            expect(response.body.message).toEqual(["firstQuarter.currentQuarter is required"]);
        });

        it('should throw an error if firstquarter has no currentQuarter', async () => {
            const dto = mockSemesterRequestDto();
            delete dto.firstQuarter.currentQuarter;
            const response = await request(app.getHttpServer())
                .post('/semesters').send(dto);
            expect(response.body).toBeDefined();
            expect(response.status).toBe(400)
            expect(response.body.message).toEqual(["firstQuarter.currentQuarter is required"]);
        });

        // second quarter
        it('should throw an error if secondQuarter is null', async () => {
            const dto = mockSemesterRequestDto();
            dto.secondQuarter = null;
            const response = await request(app.getHttpServer())
                .post('/semesters').send(dto);
            expect(response.body).toBeDefined();
            expect(response.status).toBe(400)
            expect(response.body.message).toEqual([
                "Secondquarter is required",
                "Secondquater must be a QuarterRequestDto"
            ]);
        });

        it('should throw an error if secondQuarter is not present', async () => {
            const dto = mockSemesterRequestDto();
            delete dto.secondQuarter;
            const response = await request(app.getHttpServer())
                .post('/semesters').send(dto);
            expect(response.body).toBeDefined();
            expect(response.status).toBe(400)
            expect(response.body.message).toEqual(["Secondquarter is required",]);
        });

        it('should throw an error if secondquarter has the beginning date as null', async () => {
            const dto = mockSemesterRequestDto();
            dto.secondQuarter.beginningDate = null;
            const response = await request(app.getHttpServer())
                .post('/semesters').send(dto);
            expect(response.body).toBeDefined();
            expect(response.status).toBe(400)
            expect(response.body.message).toEqual(["secondQuarter.The beginning of the semester is required",]);
        });

        it('should throw an error if secondquarter has no begnning date', async () => {
            const dto = mockSemesterRequestDto();
            delete dto.secondQuarter.beginningDate;
            const response = await request(app.getHttpServer())
                .post('/semesters').send(dto);
            expect(response.body).toBeDefined();
            expect(response.status).toBe(400)
            expect(response.body.message).toEqual(["secondQuarter.The beginning of the semester is required"]);
        });

        it('should throw an error if secondquarter has no ending date as null', async () => {
            const dto = mockSemesterRequestDto();
            dto.secondQuarter.endingDate = null;
            const response = await request(app.getHttpServer())
                .post('/semesters').send(dto);
            expect(response.body).toBeDefined();
            expect(response.status).toBe(400)
            expect(response.body.message).toEqual(["secondQuarter.The ending of the semester is required"]);
        });

        it('should throw an error if secondquarter has no ending date', async () => {
            const dto = mockSemesterRequestDto();
            delete dto.secondQuarter.endingDate;
            const response = await request(app.getHttpServer())
                .post('/semesters').send(dto);
            expect(response.body).toBeDefined();
            expect(response.status).toBe(400)
            expect(response.body.message).toEqual(["secondQuarter.The ending of the semester is required"]);
        });

        it('should throw an error if secondQuarter has currentQuarter as null', async () => {
            const dto = mockSemesterRequestDto();
            dto.secondQuarter.currentQuarter = null;
            const response = await request(app.getHttpServer())
                .post('/semesters').send(dto);
            expect(response.body).toBeDefined();
            expect(response.status).toBe(400)
            expect(response.body.message).toEqual(["secondQuarter.currentQuarter is required"]);
        });

        it('should throw an error if secondQuarter has no currentQuarter', async () => {
            const dto = mockSemesterRequestDto();
            delete dto.secondQuarter.currentQuarter;
            const response = await request(app.getHttpServer())
                .post('/semesters').send(dto);
            expect(response.body).toBeDefined();
            expect(response.status).toBe(400)
            expect(response.body.message).toEqual(["secondQuarter.currentQuarter is required"]);
        });

        // current

        it('should throw an error if currentSemester is null', async () => {
            const dto = mockSemesterRequestDto();
            dto.currentSemester = null;
            const response = await request(app.getHttpServer())
                .post('/semesters').send(dto);
            expect(response.body).toBeDefined();
            expect(response.status).toBe(400)
            expect(response.body.message).toEqual(["currentSemester is required"]);
        });

        it('should throw an error if currentSemester is not present', async () => {
            const dto = mockSemesterRequestDto();
            delete dto.currentSemester;
            const response = await request(app.getHttpServer())
                .post('/semesters').send(dto);
            expect(response.body).toBeDefined();
            expect(response.status).toBe(400)
            expect(response.body.message).toEqual(["currentSemester is required"]);
        });
    });
});
