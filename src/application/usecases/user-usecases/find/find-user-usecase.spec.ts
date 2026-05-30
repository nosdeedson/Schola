import { SystemError } from "@/application/services/@shared/system-error";
import { FindUserService } from "@/application/services/user/find/find.user.service";
import { MockRepositoriesForUnitTest } from "../../../../../tests/mocks/mock-repositories/mockRepositories";
import { ExceptionHandler } from "@/infrastructure/utils/exception-handler/exception-handler";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { FindUserUsecase } from "./find-user-usecase";
import { AccessType } from "@/domain/user/access.type";
import { mockFindUserDto } from "../../../../../tests/mocks/mock-dtos/mock-dtos";

const repositoryFactoryMock = {
    createRepository: jest.fn()
}

const findUserFactoryServiceMock = {
    findUserServiceFactory: jest.fn()
}

const findPersonServiceMock = {
    execute: jest.fn(),
}


describe('FindUserUsecase', () => {

    afterEach(async () => {
        jest.clearAllMocks();
    });

    it('should throw an exception while finding an user', async () => {
        const error = new SystemError([{ context: 'user', message: 'user not found' }], 404);
        const findUserService = jest.spyOn(FindUserService.prototype, 'execute')
            .mockImplementation(() => { throw error });
        const tratarErrors = jest.spyOn(ExceptionHandler, 'exceptionHandler')
            .mockImplementation(() => { throw new BadRequestException('user not found') });
        const repository = MockRepositoriesForUnitTest.mockRepositories();
        const usecase = new FindUserUsecase(repository);
        const wantedId = '1234560';
        await expect(usecase.execute(wantedId)).rejects.toMatchObject(new NotFoundException('user not found'));
        expect(findUserService).toHaveBeenCalledTimes(1);
        expect(findUserService).toHaveBeenCalledWith(wantedId);
        expect(tratarErrors).toHaveBeenCalledTimes(1);
        expect(tratarErrors).toHaveBeenCalledWith(error);
    });

    it('should find a user which role is teacher', async () => {
        const foundUser = mockFindUserDto();
        const wantedId = foundUser.id;
        const findUserService = jest.spyOn(FindUserService.prototype, 'execute')
            .mockImplementation(async () => await Promise.resolve(foundUser));
        repositoryFactoryMock.createRepository
        const repository = MockRepositoriesForUnitTest.mockRepositories();
        const usecase = new FindUserUsecase(repository);
        const result = await usecase.execute(wantedId);
        expect(result.id).toBe(wantedId);
        expect(result.accessType).toBe(AccessType.TEACHER);
        expect(findUserService).toHaveBeenCalledTimes(1);
        expect(findUserService).toHaveBeenCalledWith(wantedId);
    });
});
