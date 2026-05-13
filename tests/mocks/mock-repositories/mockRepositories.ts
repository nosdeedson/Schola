export class MockRepositoriesForUnitTest {

    public static mockRepositories(): any {
        return {
            create: jest.fn(),
            delete: jest.fn(),
            find: jest.fn(),
            findAll: jest.fn(),
            update: jest.fn()
        }
    }

}