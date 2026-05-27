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

    
});