import { INestApplication } from "@nestjs/common"
import { CommentModule } from "../../src/infrastructure/api/controllers/comment/comment.module";
import { DataBaseConnectionModule } from "../../src/infrastructure/data-base-connection/data-base-connection.module";
import { commentsProviders } from "../../src/infrastructure/api/controllers/comment/providers/comments-providers";
import { TestDataSource } from "../../src/infrastructure/repositories/config-test/test.datasource";
import { mockRating } from '../mocks/domain/rating.mocks';
import { RatingEntity } from "../../src/infrastructure/entities/rating/rating.entity";
import { StudentEntity } from "@/infrastructure/entities/student/student.entity";
import { mockStudent } from "../mocks/domain/student.mocks";
import request from 'supertest';
import { AcademicSemesterEntity } from "@/infrastructure/entities/academic-semester/academic.semester.entity";
import { mockSemester } from "../mocks/domain/semester.mocks";
import { createE2EConfing } from "../e2e.confing";
import { AcademicSemesterMapper } from "@/infrastructure/mappers/semester/academic-semester-mapper";

describe("comment E2E TEST", () => {
    let app: INestApplication;

    beforeAll(async () => {
        app = await createE2EConfing([CommentModule, DataBaseConnectionModule], commentsProviders)
    });

    afterAll(async () => {
        await app.close();
    });

    describe('business tests', () => {

        it('should create a comment', async () => {
            const studentEntity = StudentEntity.toStudentEntity(mockStudent())
            const studentRepository = TestDataSource.getRepository(StudentEntity);
            await studentRepository.save(studentEntity);

            const semesterEntity = AcademicSemesterMapper.fromDomain(mockSemester());
            const semesterRepository = TestDataSource.getRepository(AcademicSemesterEntity);
            await semesterRepository.save(semesterEntity);

            let ratingEntity = RatingEntity.toRatingEntity(mockRating());
            ratingEntity.student = studentEntity;
            ratingEntity.quarter = semesterEntity.quarters[0];
            const ratingRepository = TestDataSource.getRepository(RatingEntity);

            const savedRating = await ratingRepository.save(ratingEntity);
            const dto = {
                "comment": "test comment",
                "namePersonHaveDone": "Edson Jose",
                "ratingId": savedRating.id
            }
            const response = await request(app.getHttpServer())
                .post("/comment/ratings")
                .send(dto);
            expect(response).toBeDefined();
            expect(response.status).toBe(201);
        });

        it('should not find the Rating to a comment', async () => {

            const dto = {
                "comment": "test comment",
                "namePersonHaveDone": "Edson Jose",
                "ratingId": "f0c0cccd-481f-445a-aa5c-e973f538f517"
            }
            const response = await request(app.getHttpServer())
                .post("/comment/ratings")
                .send(dto);
            expect(response).toBeDefined();
            expect(response.status).toBe(404);
        });
    });

    describe('controller validations', () => {

        it('should throw an exception if comment is null', async () => {
            const dto = {
                "comment": null,
                "namePersonHaveDone": "Edson Jose",
                "ratingId": "f0c0cccd-481f-445a-aa5c-e973f538f517"
            };
            const response = await request(app.getHttpServer())
                .post("/comment/ratings")
                .send(dto)
            expect(response.body).toBeDefined();
            expect(response.body.message).toEqual(["The comment must be less than 500",
                "Comment is required"])
        });

        it('should throw an exception if comment not present in DTo', async () => {
            const dto = {
                "namePersonHaveDone": "Edson Jose",
                "ratingId": "f0c0cccd-481f-445a-aa5c-e973f538f517"
            };
            const response = await request(app.getHttpServer())
                .post("/comment/ratings")
                .send(dto)
            expect(response.body).toBeDefined();
            expect(response.body.message).toEqual(["The comment must be less than 500",
                "Comment is required"])
        });

        it('should throw an exception if name who did is not present', async () => {
            const dto = {
                "comment": "a comment",
                "ratingId": "f0c0cccd-481f-445a-aa5c-e973f538f517"
            };
            const response = await request(app.getHttpServer())
                .post("/comment/ratings")
                .send(dto);
            expect(response.body).toBeDefined();
            expect(response.body.message).toEqual(["The name of who did it is required"]);
        });

        it('should throw an exception if name who did is null', async () => {
            const dto = {
                "comment": "a comment",
                "namePersonHaveDone": null,
                "ratingId": "f0c0cccd-481f-445a-aa5c-e973f538f517"
            };
            const response = await request(app.getHttpServer())
                .post("/comment/ratings")
                .send(dto);
            expect(response.body).toBeDefined();
            expect(response.body.message).toEqual(["The name of who did it is required"]);
        });

        it('should throw an error if id rating is null', async () => {
            const dto = {
                "comment": "a comment",
                "namePersonHaveDone": "Edson Jose",
                "ratingId": null
            };
            const response = await request(app.getHttpServer())
                .post("/comment/ratings")
                .send(dto);
            expect(response.body).toBeDefined();
            expect(response.body.message).toEqual([
                "Rating id must not be empty",
                "ratingId must be a UUID"
            ]);
        });

        it('should throw an error if id rating is not present', async () => {
            const dto = {
                "comment": "a comment",
                "namePersonHaveDone": "Edson Jose",
            };
            const response = await request(app.getHttpServer())
                .post("/comment/ratings")
                .send(dto);
            expect(response.body).toBeDefined();
            expect(response.body.message).toEqual([
                "Rating id must not be empty",
                "ratingId must be a UUID"
            ]);
        });
    });
});
