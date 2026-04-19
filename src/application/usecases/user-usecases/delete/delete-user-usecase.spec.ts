import { DeleteUserService } from "@/application/services/user/delete/delete.user.service";
import { FindUserService } from "@/application/services/user/find/find.user.service";
import { mockFindUserDto } from "@/infrastructure/__mocks__/mock-dtos/mock-dtos";
import { DeleteUserUsecase } from "./delete-user-usecase";
import { DeleteUserFactoryService } from "@/infrastructure/factory/delete-user-factory/delete-user-factory.service";
import { RepositoryFactoryService } from "@/infrastructure/factory/repositiry-factory/repository-factory.service";
import { SystemError } from "@/application/services/@shared/system-error";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { TrataErros } from "@/infrastructure/utils/trata-erros/trata-erros";

const deleteUserFactoryServiceMock = {
    deleteUserServiceFactory: jest.fn()
}

const repositoryFactoryMock = {
    createRepository: jest.fn()
}

const deletePersonMock = {
    execute: jest.fn().mockImplementation(() => Promise.resolve(void 0))
}

describe('DeleteUserUsecase', () => {

    afterEach(async () => {
        jest.clearAllMocks();
    })

    it('should delete a parent user', async () => {
        const findUser = jest.spyOn(FindUserService.prototype, 'execute')
            .mockImplementation(() => Promise.resolve(mockFindUserDto()));

        deleteUserFactoryServiceMock.deleteUserServiceFactory.mockReturnValue(deletePersonMock);

        const deleteUserService = jest.spyOn(DeleteUserService.prototype, 'execute')
            .mockImplementation(() => Promise.resolve(void 0));
        const usecase = new DeleteUserUsecase(
            deleteUserFactoryServiceMock as unknown as DeleteUserFactoryService,
            repositoryFactoryMock as unknown as RepositoryFactoryService
        );
        const wantedId = '7e17c191-07b9-4419-965f-e07156eded60'
        expect(await usecase.execute(wantedId)).toBe(void 0);
        expect(findUser).toHaveBeenCalledTimes(1);
        expect(findUser).toHaveBeenCalledWith(wantedId);
        expect(deleteUserService).toHaveBeenCalledTimes(1);
        expect(deleteUserService).toHaveBeenCalledWith(wantedId);
    });

    it('should not find a user to delete', async () => {
        const findUser = jest.spyOn(FindUserService.prototype, 'execute')
            .mockImplementation(() => { throw new SystemError([{ context: 'user', message: 'user not found' }]) });

        const deleteUserService = jest.spyOn(DeleteUserService.prototype, 'execute')
            .mockImplementation(() => Promise.resolve(void 0));
        const usecase = new DeleteUserUsecase(
            deleteUserFactoryServiceMock as unknown as DeleteUserFactoryService,
            repositoryFactoryMock as unknown as RepositoryFactoryService
        );
        const tratarErros = jest.spyOn(TrataErros, 'tratarErrorsBadRequest')
            .mockImplementation(() => { throw new BadRequestException("user not found") })
        const wantedId = '7e17c191-07b9-4419-965f-e07156eded60'
        expect(usecase.execute(wantedId)).rejects.toMatchObject(new BadRequestException('user not found'));
        expect(findUser).toHaveBeenCalledTimes(1);
        expect(findUser).toHaveBeenCalledWith(wantedId);
        expect(deleteUserService).toHaveBeenCalledTimes(0);
        expect(tratarErros).toHaveBeenCalledTimes(1)
    });
})
