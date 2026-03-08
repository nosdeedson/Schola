import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateSchoolgroupDto } from './dto/create/create-schoolgroup-dto';
import { SchoolgroupUseCases } from '../../../../application/usecases/schoolgroup-usecases/schoolgroup-usecases';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateSchoolgroupDto } from './dto/update/update-schoolgroup-dto';
import { CreateSchoolgroupUseCase } from 'src/application/usecases/schoolgroup-usecases/create/schoolgroup';
import { UpdateSchoolgroupUsecase } from 'src/application/usecases/schoolgroup-usecases/update/schoolgroup';

@ApiTags('Class contoller')
@Controller('classes')
export class SchoolgroupController {

    constructor(
        private schoolgroupUseCase: SchoolgroupUseCases,
        private createSchoolgroup: CreateSchoolgroupUseCase,
        private updateSchoolgroup: UpdateSchoolgroupUsecase,
    ){}
    
    @ApiOperation({description: 'Create a schoolgroup'})
    @ApiResponse({status: 201,})
    @ApiResponse({status: '4XX', description: 'Return status 400 when request has invalid information'})
    @Post()
    async create(@Body() dto: CreateSchoolgroupDto): Promise<void>{
        await this.createSchoolgroup.create(dto);
    }

    @ApiOperation({description: 'Delete a schoolgroup'})
    @ApiResponse({status: 204, description: 'if schoolgroup does not exist do anything', example: 'fcfca953-946f-40e9-a1ae-22775888583e'})
    @Delete(':id')
    async delete(@Param('id') id: string): Promise<void>{
        await this.schoolgroupUseCase.delete(id);
    }

    @ApiOperation({description: 'Find a schoolgroup'})
    @ApiResponse({status: 204, description: 'if schoolgroup does not exist do anything'})
    @Get(':id')
    async find(@Param('id') id: string){
        return await this.schoolgroupUseCase.find(id);
    }

    @ApiOperation({description: 'Find all schoolgroup'})
    @ApiResponse({status: 204, description: 'If there is no schoolgroup return an empty array'})
    @Get()
    async findAll(){
        return await this.schoolgroupUseCase.findAll();
    }

    @ApiOperation({description: 'Update schoolgroup'})
    @ApiResponse({status: 204, description: ''})
    @ApiResponse({status: '4XX', description: 'If schoolgroup not found throw exeception'})
    @Patch()
    async update(@Body() dto: UpdateSchoolgroupDto): Promise<void>{
        await this.updateSchoolgroup.update(dto);
    }

}
