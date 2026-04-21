import { Body, Controller, Delete, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserRequestDto } from './dtos/create-user-dto/create-user-request-dto';
import { CreateUserUsecase } from '@/application/usecases/user-usecases/create-user/create-user-usecase';
import { DeleteUserUsecase } from '@/application/usecases/user-usecases/delete/delete-user-usecase';

@ApiTags('User')
@Controller('users')
export class UsersController {

    constructor(
        private createUser: CreateUserUsecase,
        private deleteUser: DeleteUserUsecase,
    ) { }

    @ApiOperation({ description: 'Create a user accordingly with accesstype' })
    @ApiResponse({ status: 201, description: 'Return status 201 when user is created' })
    @ApiResponse({ status: '4XX', description: 'Retun when error if request has invalid information' })
    @Post()
    async create(@Body() dto: CreateUserRequestDto): Promise<void> {
        return await this.createUser.execute(dto);
    }

    @ApiOperation({description: 'Delete a user of the system'})
    @ApiResponse({status: 204, description: 'When user is deleted the status will be 204' })
    @ApiResponse({status: '4XX', description: 'Throw an exception when is not possible to delete.' })
    @Delete(":id")
    async delete(idUser: string){
        await this.deleteUser.execute(idUser);
    }
}
