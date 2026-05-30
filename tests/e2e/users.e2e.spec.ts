import { INestApplication } from "@nestjs/common";
import { createE2EConfing } from "../e2e.confing";
import { UsersModule } from "@/infrastructure/api/controllers/users/users.module";
import { DataBaseConnectionModule } from "@/infrastructure/data-base-connection/data-base-connection.module";
import { usersProviders } from "@/infrastructure/api/controllers/users/providers/users-provider";
import { CreateUserFactoryService } from "@/infrastructure/factory/create-user-service-factory/create-user-factory-service";
import { RepositoryFactoryService } from "@/infrastructure/factory/repositiry-factory/repository-factory.service";
import { IsStrongPasswordConstraint } from "@/infrastructure/api/validators/is-strong-password-constraint/is-strong-password-constraint";
import { DeleteUserFactoryService } from "@/infrastructure/factory/delete-user-factory/delete-user-factory.service";
import { UserAggregateResolverService } from "@/infrastructure/factory/user-aggregate-resolver/user-aggregate-resolver.service";
import request from 'supertest';
import { mockUser } from "../mocks/domain/user.mock";
import { AccessType } from "@/domain/user/access.type";
import { UserEntity } from "@/infrastructure/entities/user/user.entity";
import { TestDataSource } from "@/infrastructure/repositories/config-test/test.datasource";
import { mockWorker } from "../mocks/domain/worker.mock";
import { WorkerEntity } from "@/infrastructure/entities/worker/worker.entity";
import { mockCreateUserRequestDto } from "../mocks/controller/create-user-request-dto-mock";
import { ClassEntity } from "@/infrastructure/entities/class/class.entity";
import { mockClass } from "../mocks/domain/class.mocks";

describe("USERS E2E TESTS", () => {
    let app: INestApplication;

    beforeAll(async () => {
        app = await createE2EConfing([
            UsersModule,
            DataBaseConnectionModule
        ], [
            ...usersProviders,
            IsStrongPasswordConstraint,
            RepositoryFactoryService,
            CreateUserFactoryService,
            DeleteUserFactoryService,
            UserAggregateResolverService,
        ]);
    });

    afterAll(async () => { await app.close() });

    it('app should be defined', async () => {
        expect(app).toBeDefined();
    });

    describe('business tests', () => {

        it('should not find any user', async () => {
            const response = await request(app.getHttpServer()).get("/users");
            expect(response.body).toBeDefined();
            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(0);
        });

        it('should find all users', async () => {
            const adminUser = UserEntity.toUserEntity(mockUser(AccessType.ADMIN));
            const workerRepository = TestDataSource.getRepository(WorkerEntity);
            await workerRepository.save(adminUser.person);
            const userRepository = TestDataSource.getRepository(UserEntity);
            await userRepository.save(adminUser);

            const teacherUser = UserEntity.toUserEntity(mockUser(AccessType.TEACHER));
            await workerRepository.save(teacherUser.person);
            await userRepository.save(teacherUser);

            const response = await request(app.getHttpServer()).get("/users");
            expect(response.body).toBeDefined();
            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(2);
            expect([adminUser.id, teacherUser.id].includes(response.body[0].id)).toBeTruthy()
            expect([adminUser.id, teacherUser.id].includes(response.body[1].id)).toBeTruthy()
        });

        it('should find an user', async () => {
            const adminUser = UserEntity.toUserEntity(mockUser(AccessType.ADMIN));
            const workerRepository = TestDataSource.getRepository(WorkerEntity);
            await workerRepository.save(adminUser.person);
            const userRepository = TestDataSource.getRepository(UserEntity);
            await userRepository.save(adminUser);

            const wantedId = adminUser.id;

            const response = await request(app.getHttpServer()).get(`/users/${wantedId}`);
            expect(response.body).toBeDefined();
            expect(response.status).toBe(200);
            expect(response.body.id).toBe(wantedId);
        });

        it('should not find any user', async () => {
            const wantedId = "5f379785-8084-4237-a42e-57ff14d3a7d0";

            const response = await request(app.getHttpServer()).get(`/users/${wantedId}`);
            expect(response.body).toBeDefined();
            expect(response.status).toBe(400);
            expect(response.body.message).toEqual('user not found');
        });

        it('should delete an user', async () => {
            const adminUser = UserEntity.toUserEntity(mockUser(AccessType.ADMIN));
            const workerRepository = TestDataSource.getRepository(WorkerEntity);
            await workerRepository.save(adminUser.person);
            const userRepository = TestDataSource.getRepository(UserEntity);
            await userRepository.save(adminUser);

            const wantedId = adminUser.id;

            const response = await request(app.getHttpServer()).delete(`/users/${wantedId}`);
            expect(response.body).toBeDefined();
            expect(response.status).toBe(200);
            const validation = await request(app.getHttpServer()).get(`/users/${wantedId}`);
            expect(validation.body).toBeDefined();
            expect(validation.status).toBe(400);
            expect(validation.body.message).toEqual('user not found')
        });

        it('should throw an error while deleting an user that does not exist', async () => {
            const wantedId = "851af9ff-6aeb-42bc-92dc-53ae102fe7f3";
            const response = await request(app.getHttpServer()).delete(`/users/${wantedId}`);
            expect(response.body).toBeDefined();
            expect(response.status).toBe(400);
            expect(response.body.message).toEqual('user not found')
        });

        it('should create an user as admin', async () => {
            const classEntity = ClassEntity.toClassEntity(mockClass());
            const classRepository = TestDataSource.getRepository(ClassEntity);
            await classRepository.save(classEntity)
            const dto = mockCreateUserRequestDto({ classCode: classEntity.classCode });

            const response = await request(app.getHttpServer())
                .post('/users').send(dto);
            expect(response.body).toBeDefined();
            expect(response.status).toBe(201);
        });

        it('should create an user as a teacher', async () => {
            const teacher = WorkerEntity.toWorkerEntity(mockWorker());
            const workerRepository = TestDataSource.getRepository(WorkerEntity);
            await workerRepository.save(teacher);
            const classEntity = ClassEntity.toClassEntity(mockClass());
            classEntity.teacher = teacher
            const classRepository = TestDataSource.getRepository(ClassEntity);
            await classRepository.save(classEntity)
            const dto = mockCreateUserRequestDto({
                classCode: classEntity.classCode,
                accessType: AccessType.TEACHER,
                name: teacher.fullName
            });

            const response = await request(app.getHttpServer())
                .post('/users').send(dto);
            expect(response.body).toBeDefined();
            expect(response.status).toBe(201);
        });

        it('should create an user as student', async () => {
            const classEntity = ClassEntity.toClassEntity(mockClass());
            const classRepository = TestDataSource.getRepository(ClassEntity);
            await classRepository.save(classEntity)
            const dto = mockCreateUserRequestDto({
                classCode: classEntity.classCode,
                accessType: AccessType.STUDENT,
            });

            const response = await request(app.getHttpServer())
                .post('/users').send(dto);
            expect(response.body).toBeDefined();
            expect(response.status).toBe(201);
        });

        it('should create an user as parent', async () => {
            const classEntity = ClassEntity.toClassEntity(mockClass());
            const classRepository = TestDataSource.getRepository(ClassEntity);
            await classRepository.save(classEntity)
            const dto = mockCreateUserRequestDto({
                classCode: classEntity.classCode,
                accessType: AccessType.PARENT,
            });

            const response = await request(app.getHttpServer())
                .post('/users').send(dto);
            expect(response.body).toBeDefined();
            expect(response.status).toBe(201);
        });

        it('should not create an user', async () => {
            const dto = mockCreateUserRequestDto({ classCode: '123456', accessType: AccessType.TEACHER });

            const response = await request(app.getHttpServer())
                .post('/users').send(dto);
            expect(response.body).toBeDefined();
            expect(response.status).toBe(400);
            expect(response.body.message).toBe("class not found");
        });

    });

    describe('controller tests validation', () => {
        it('should throw an error if userId is not an UUID', async () => {
            const notAnUUID = 'invalidUUID';
            const response = await request(app.getHttpServer()).get(`/users/${notAnUUID}`);
            expect(response.body).toBeDefined();
            expect(response.status).toBe(400);
            expect(response.body).toEqual({ "error": "Bad Request", "message": "Validation failed (uuid is expected)", "statusCode": 400 });
        });

        it('should throw an error while deleting user if Id is not an UUID', async () => {
            const notAnUUID = 'invalidUUID';
            const response = await request(app.getHttpServer()).delete(`/users/${notAnUUID}`);
            expect(response.body).toBeDefined();
            expect(response.status).toBe(400);
            expect(response.body).toEqual({ "error": "Bad Request", "message": "Validation failed (uuid is expected)", "statusCode": 400 });
        });

        it('should not create an user without name', async () => {
            const dto = mockCreateUserRequestDto({ classCode: '123456', accessType: AccessType.TEACHER });
            dto.name = null;

            const response = await request(app.getHttpServer())
                .post('/users').send(dto);
            expect(response.body).toBeDefined();
            expect(response.status).toBe(400);
            expect(response.body.message[0]).toBe("name should not be empty");
        });

        it('should not create an user without birthDate', async () => {
            const dto = mockCreateUserRequestDto({ classCode: '123456', accessType: AccessType.TEACHER });
            dto.birthDate = null;

            const response = await request(app.getHttpServer())
                .post('/users').send(dto);
            expect(response.body).toBeDefined();
            expect(response.status).toBe(400);
            expect(response.body.message[0]).toBe("birthDate must be a valid ISO 8601 date string");
        });

        it('should not create an user without email', async () => {
            const dto = mockCreateUserRequestDto({ classCode: '123456', accessType: AccessType.TEACHER });
            dto.email = null;

            const response = await request(app.getHttpServer())
                .post('/users').send(dto);
            expect(response.body).toBeDefined();
            expect(response.status).toBe(400);
            expect(response.body.message[0]).toBe("email must be an email");
        });

        it('should not create an user without password', async () => {
            const dto = mockCreateUserRequestDto({ classCode: '123456', accessType: AccessType.TEACHER });
            dto.password = null;

            const response = await request(app.getHttpServer())
                .post('/users').send(dto);
            expect(response.body).toBeDefined();
            expect(response.status).toBe(400);
            expect(response.body.message[0]).toBe("password is not strong enough");
        });

        it('should not create an user without access type', async () => {
            const dto = mockCreateUserRequestDto({ classCode: '123456', accessType: AccessType.TEACHER });
            dto.accessType = null;

            const response = await request(app.getHttpServer())
                .post('/users').send(dto);
            expect(response.body).toBeDefined();
            expect(response.status).toBe(400);
            expect(response.body.message[0]).toBe("accessType must be one of the following values: student, parent, teacher, admin");
        });

        it('should not create an user without class code', async () => {
            const dto = mockCreateUserRequestDto({ classCode: '123456', accessType: AccessType.TEACHER });
            dto.classCode = null;

            const response = await request(app.getHttpServer())
                .post('/users').send(dto);
            expect(response.body).toBeDefined();
            expect(response.status).toBe(400);
            expect(response.body.message[0]).toBe("classCode must be longer than or equal to 6 characters");
        });

        it('should not create an user without nickname', async () => {
            const dto = mockCreateUserRequestDto({ classCode: '123456', accessType: AccessType.TEACHER });
            dto.nickname = null;

            const response = await request(app.getHttpServer())
                .post('/users').send(dto);
            expect(response.body).toBeDefined();
            expect(response.status).toBe(400);
            expect(response.body.message[0]).toBe("nickname must be shorter than or equal to 50 characters");
        });

        it('should not allow empty students array if accessType is Parent', async () => {
            const dto = mockCreateUserRequestDto({ classCode: '123456', accessType: AccessType.PARENT });
            dto.students = null;

            const response = await request(app.getHttpServer())
                .post('/users').send(dto);
            expect(response.body).toBeDefined();
            expect(response.status).toBe(400);
            expect(response.body.message[0]).toBe("At least one student must be sent");
        });

        it('should not allow empty parents array if accessType is student', async () => {
            const dto = mockCreateUserRequestDto({ classCode: '123456', accessType: AccessType.STUDENT });
            dto.parents = null;

            const response = await request(app.getHttpServer())
                .post('/users').send(dto);
            expect(response.body).toBeDefined();
            expect(response.status).toBe(400);
            expect(response.body.message[0]).toBe("At least one parent must be sent");
        });
    });

});
