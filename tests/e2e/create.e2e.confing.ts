import { DATA_SOURCE } from "@/infrastructure/data-base-connection/data-base-connection.module";
import { TestDataSource } from "@/infrastructure/repositories/config-test/test.datasource";
import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

export async function createE2EConfing(
    module: any[],
    providers: any[] = []
): Promise<INestApplication> {
    const moduleRef: TestingModule = await Test.createTestingModule({
        imports: module,
        providers,
    })
        .overrideProvider(DATA_SOURCE)
        .useValue(TestDataSource)
        .compile();

    const app = moduleRef.createNestApplication();

    await app.init();

    return app;
}
