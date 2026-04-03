import { TestDataSource } from '@/infrastructure/repositories/config-test/test.datasource';

beforeAll(async () => {
  if (!TestDataSource.isInitialized) {
    await TestDataSource.initialize();
  }
});

afterAll(async () => {
  if (TestDataSource.isInitialized) {
    await TestDataSource.destroy();
  }
});

afterEach(async () => {
  const entities = TestDataSource.entityMetadatas;

  for (const entity of entities) {
    await TestDataSource.query(
      `TRUNCATE TABLE "${entity.tableName}" RESTART IDENTITY CASCADE;`
    );
  }
});
