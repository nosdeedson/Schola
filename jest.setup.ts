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

  const tableNames = entities.map(e => `"${e.tableName}"`).join(', ');

  if (tableNames.length) {
    await TestDataSource.query(
      `TRUNCATE ${tableNames} RESTART IDENTITY CASCADE;`
    );
  }
});
