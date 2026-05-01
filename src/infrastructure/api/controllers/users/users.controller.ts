import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserRequestDto } from './dtos/create-user-dto/create-user-request-dto';
import { CreateUserUsecase } from '@/application/usecases/user-usecases/create-user/create-user-usecase';
import { DeleteUserUsecase } from '@/application/usecases/user-usecases/delete/delete-user-usecase';
import { FindUserUsecase } from '@/application/usecases/user-usecases/find/find-user-usecase';
import { FindUserResponseDto } from './dtos/find-user-dto/find-user-response-dto';
import { FindAllUserUsecase } from '@/application/usecases/user-usecases/find-all/find-all-user-usecase';

@ApiTags('User')
@Controller('users')
export class UsersController {

    constructor(
        private createUser: CreateUserUsecase,
        private deleteUser: DeleteUserUsecase,
        private findUser: FindUserUsecase,
        private findAllUser: FindAllUserUsecase,
    ) { }

    @ApiOperation({ description: 'Create an user accordingly with accesstype' })
    @ApiResponse({ status: 201, description: 'Return status 201 when user is created' })
    @ApiResponse({ status: '4XX', description: 'Retun when error if request has invalid information' })
    @Post()
    async create(@Body() dto: CreateUserRequestDto): Promise<void> {
        return await this.createUser.execute(dto);
    }

    @ApiOperation({ description: 'Delete an user of the system' })
    @ApiResponse({ status: 204, description: 'When user is deleted the status will be 204' })
    @ApiResponse({ status: '4XX', description: 'Throw an exception when is not possible to delete.' })
    @Delete(":id")
    async delete(@Param("idUser") idUser: string) {
        await this.deleteUser.execute(idUser);
    }

    @ApiOperation({ description: 'Find an user of the system' })
    @ApiResponse({ status: 200, description: 'Return the user information' })
    @ApiResponse({ status: '4XX', description: 'Throw an exception when is not possible to find.' })
    @Get(":id")
    async find(@Param("idUser") idUser: string): Promise<FindUserResponseDto> {
        const dto = await this.findUser.execute(idUser);
        return FindUserResponseDto.from(dto);
    }

    @ApiOperation({ description: 'Find all users' })
    @ApiResponse({ status: 200, description: "Returns all users or an empty array" })
    async findAll(): Promise<FindUserResponseDto[]> {
        const dto = await this.findAllUser.execute();
        return FindUserResponseDto.fromUsers(dto);
    }
}
