import { INestApplication } from "@nestjs/common"
import { createE2EConfing } from "../e2e.confing";
import { StudentModule } from "@/infrastructure/api/controllers/student/student.module";
import { DataBaseConnectionModule } from "@/infrastructure/data-base-connection/data-base-connection.module";
import { studentsProviders } from "@/infrastructure/api/controllers/student/providers/students.providers";
import { schoolgroupsProviders as providersClass } from "@/infrastructure/api/controllers/schoolgroup/providers/schoolgroups.providers";
import request from 'supertest';
import { mockStudent } from "../mocks/domain/student.mocks";
import { StudentEntity } from "@/infrastructure/entities/student/student.entity";
import { TestDataSource } from "@/infrastructure/repositories/config-test/test.datasource";
import { AcademicSemesterEntity } from "@/infrastructure/entities/academic-semester/academic.semester.entity";
import { mockSemester } from "../mocks/domain/semester.mocks";
import { mockQuarter } from "../mocks/domain/quarter.mocks";
import { mockRating } from "../mocks/domain/rating.mocks";
import { RatingEntity } from "@/infrastructure/entities/rating/rating.entity";
import { ClassEntity } from "@/infrastructure/entities/class/class.entity";
import { mockClass } from "../mocks/domain/class.mocks";
import { mockTransferStudendtsRequestDto } from "../mocks/controller/transfer-students-request-dto-mock";
import { SchoolgroupModule } from "@/infrastructure/api/controllers/schoolgroup/schoolgroup.module";
import { AcademicSemesterMapper } from "@/infrastructure/mappers/semester/academic-semester-mapper";

describe('STUDENT E2E TESTS', () => {
    let app: INestApplication;
    let classApp: INestApplication;

    beforeAll(async () => {
        app = await createE2EConfing([
            StudentModule,
            DataBaseConnectionModule
        ], studentsProviders);
        classApp = await createE2EConfing([
            SchoolgroupModule, DataBaseConnectionModule
        ], providersClass)
    })

    afterAll(async () => { await app.close() });

    it('app should be defined', async () => {
        expect(app).toBeDefined();
    })

    describe('business tests', () => {
        it('should not find a ratings of a studnet', async () => {
            const response = await request(app.getHttpServer())
                .get('/students/ratings/9ae66618-6c2f-4fd7-bde0-d58271cbe59f');
            expect(response.body).toBeDefined();
            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(0);
        });

        it('should find a ratings of a student', async () => {
            const studentEntity = StudentEntity.toStudentEntity(mockStudent());
            const studentRepository = TestDataSource.getRepository(StudentEntity);
            await studentRepository.save(studentEntity);
            const semester = AcademicSemesterMapper.fromDomain(mockSemester({
                firstQuarter: mockQuarter({ currentQuarter: true })
            }));
            const semesterRespository = TestDataSource.getRepository(AcademicSemesterEntity);
            await semesterRespository.save(semester);

            const ratingEntity = RatingEntity.toRatingEntity(mockRating());
            ratingEntity.student = studentEntity;
            ratingEntity.quarter = semester.quarters[0];
            const ratingRepository = TestDataSource.getRepository(RatingEntity);
            await ratingRepository.save(ratingEntity);
            const wantedId = studentEntity.id
            const response = await request(app.getHttpServer())
                .get(`/students/ratings/${wantedId}`);
            expect(response.body).toBeDefined();
            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(1);
            expect(response.body[0].id).toEqual(ratingEntity.id);
            expect(response.body[0].studentId).toEqual(studentEntity.id);
        });

        it('should transfer students', async () => {
            const studentEntity = StudentEntity.toStudentEntity(mockStudent());
            const studentEntity1 = StudentEntity.toStudentEntity(mockStudent({ name: "second student" }));
            studentEntity1.id = '91f523cb-72f3-4aca-adcd-b76a15ae7be3';
            const studentRepository = TestDataSource.getRepository(StudentEntity);
            await studentRepository.save([studentEntity, studentEntity1]);
            const repository = TestDataSource.getRepository(ClassEntity);
            const classEntity = ClassEntity.toClassEntity(mockClass());
            const classEntity1 = ClassEntity.toClassEntity(mockClass({ name: "A1-morning" }));
            classEntity1.id = '36cd408b-5d95-452e-8693-5566625108bb';
            const entity = await repository.save(classEntity);
            const entity1 = await repository.save(classEntity1);
            const dto = mockTransferStudendtsRequestDto({ classId: entity1.id, studentIds: [studentEntity.id, studentEntity1.id] });
            const response = await request(app.getHttpServer())
                .patch('/students/transfer-students').send(dto);
            expect(response.body).toBeDefined();
            expect(response.status).toBe(200);
            const validation = await request(classApp.getHttpServer())
                .get(`/classes/${entity1.id}`);
            console.log(validation.body)
            expect(validation.body).toBeDefined();
            expect(validation.status).toBe(200);
            expect(validation.body.id).toBe(entity1.id);
            const ids = [studentEntity.id, studentEntity1.id];
            expect(ids.includes(validation.body.students[0].id)).toBeTruthy();
            expect(ids.includes(validation.body.students[1].id)).toBeTruthy();
        });

        it('should not transfer students', async () => {
            const studentEntity = StudentEntity.toStudentEntity(mockStudent());
            const studentRepository = TestDataSource.getRepository(StudentEntity);
            await studentRepository.save([studentEntity]);
            const repository = TestDataSource.getRepository(ClassEntity);
            const classEntity = ClassEntity.toClassEntity(mockClass());
            await repository.save(classEntity);
            let wantedId = "742b5dd6-c28e-4739-82ae-d9f0aedeb3a9";
            let dto = mockTransferStudendtsRequestDto({ classId: wantedId, studentIds: [studentEntity.id] });
            const response = await request(app.getHttpServer())
                .patch('/students/transfer-students').send(dto);
            expect(response.body).toBeDefined();
            expect(response.status).toBe(404);
            expect(response.body.message).toBe("class not found");
        });
    });

    describe('controller validadtions tests', () => {
        it('should throw an error if studentIds is not an array', async () => {
            let dto = mockTransferStudendtsRequestDto({ classId: "a4bf0ebb-7cff-4ea3-aa7a-832090392207", studentIds: "is not a uuid" as any });
            const response = await request(app.getHttpServer()).patch("/students/transfer-students").send(dto);
            expect(response.body).toBeDefined();
            expect(response.status).toBe(400);
            expect(response.body.message).toEqual([
                'Each string should be an UUID',
                "List of students must have at least one UUID",
                "Must be an array of UUID"
            ]);
        });

        it('should throw an error if the array of studentsIds has no valid UUID', async () => {
            let dto = mockTransferStudendtsRequestDto({ classId: "a4bf0ebb-7cff-4ea3-aa7a-832090392207", studentIds: ["is not a uuid"] });
            const response = await request(app.getHttpServer()).patch("/students/transfer-students").send(dto);
            expect(response.body).toBeDefined();
            expect(response.status).toBe(400);
            expect(response.body.message).toEqual(["Each string should be an UUID"]);
        });

        it('should throw an error if the array of studentIds is empty', async () => {
            let dto = mockTransferStudendtsRequestDto({ classId: "a4bf0ebb-7cff-4ea3-aa7a-832090392207", studentIds: [] });
            const response = await request(app.getHttpServer()).patch("/students/transfer-students").send(dto);
            console.log(response.body)
            expect(response.body).toBeDefined();
            expect(response.status).toBe(400);
            expect(response.body.message).toEqual(["List of students must have at least one UUID"]);
        });


        it('should throw an error if the array of studentIds is null', async () => {
            let dto = mockTransferStudendtsRequestDto({ classId: "a4bf0ebb-7cff-4ea3-aa7a-832090392207", studentIds: [] });
            dto.studentIds = null
            const response = await request(app.getHttpServer()).patch("/students/transfer-students").send(dto);
            console.log(response.body)
            expect(response.body).toBeDefined();
            expect(response.status).toBe(400);
            expect(response.body.message).toEqual([
                'Each string should be an UUID',
                "List of students must have at least one UUID",
                "Must be an array of UUID"
            ]);
        });


        it('should throw an error if the array of studentIds is not present', async () => {
            let dto = mockTransferStudendtsRequestDto({ classId: "a4bf0ebb-7cff-4ea3-aa7a-832090392207", studentIds: [] });
            delete dto.studentIds;
            const response = await request(app.getHttpServer()).patch("/students/transfer-students").send(dto);
            console.log(response.body)
            expect(response.body).toBeDefined();
            expect(response.status).toBe(400);
            expect(response.body.message).toEqual([
                'Each string should be an UUID',
                "List of students must have at least one UUID",
                "Must be an array of UUID"
            ]);
        });

        it('should throw an error if classId is not an UUID ', async () => {
            let dto = mockTransferStudendtsRequestDto({ classId: "not uuid", studentIds: ["a4bf0ebb-7cff-4ea3-aa7a-832090392207"] });
            const response = await request(app.getHttpServer()).patch("/students/transfer-students").send(dto);
            console.log(response.body)
            expect(response.body).toBeDefined();
            expect(response.status).toBe(400);
            expect(response.body.message).toEqual(["Class Id is required"]);
        });

        it('should throw an error if classId is null', async () => {
            let dto = mockTransferStudendtsRequestDto({ classId: null, studentIds: ["a4bf0ebb-7cff-4ea3-aa7a-832090392207"] });
            dto.classId = null;
            const response = await request(app.getHttpServer()).patch("/students/transfer-students").send(dto);
            console.log(response.body)
            expect(response.body).toBeDefined();
            expect(response.status).toBe(400);
            expect(response.body.message).toEqual(["Class Id is required"]);
        });

        it('should throw an error if classId is not present', async () => {
            let dto = mockTransferStudendtsRequestDto({ classId: null, studentIds: ["a4bf0ebb-7cff-4ea3-aa7a-832090392207"] });
            delete dto.classId
            const response = await request(app.getHttpServer()).patch("/students/transfer-students").send(dto);
            console.log(response.body)
            expect(response.body).toBeDefined();
            expect(response.status).toBe(400);
            expect(response.body.message).toEqual(["Class Id is required"]);
        });
    });

})
