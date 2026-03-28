import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserUsecasesService } from '../../../../application/usecases/user-usecases/user-usecases.service';
import { CreateUserRequestDto } from './dtos/create-user-dto/create-user-request-dto';

@ApiTags('Users Workers')
@Controller('users')
export class UsersController {

    constructor(private userUsecase: UserUsecasesService){}

    @ApiOperation({description: 'Create a user accordingly with accesstype'})
    @ApiResponse({status: 201, description: 'Return status 201 when user is created'})
    @ApiResponse({status: '4XX', description: 'Retun when error if request has invalid information'})
    @Post()
    async create(@Body() dto: CreateUserRequestDto): Promise<void> {
        return await this.userUsecase.create(dto);
    }
}
