import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateSchoolgroupRequestDto } from './dto/create/create-schoolgroup-request-dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateSchoolgroupRequestDto } from './dto/update/update-schoolgroup-request-dto';
import { CreateSchoolgroupUseCase } from '@/application/usecases/schoolgroup-usecases/create/create-schoolgroup-usecase';
import { UpdateSchoolgroupUsecase } from '@/application/usecases/schoolgroup-usecases/update/update-schoolgroup-usecase';
import { CreateSchoolgroupUseCaseDto } from '@/application/usecases/schoolgroup-usecases/create/dto/create-schoolgroup-usecase.dto';
import { FindSchoolgroupUsecase } from '@/application/usecases/schoolgroup-usecases/find/find-schoolgroup-usecase';
import { FindClassResponseDto } from './dto/find/find-class-response-dto';
import { DeleteSchoolgroupUsecase } from '@/application/usecases/schoolgroup-usecases/delete/delete-schoolgroup-usecase';
import { FindAllSchoolgroupUsecase } from '@/application/usecases/schoolgroup-usecases/findall/find-all-schoolgroup-usecase';
import { FindAllClassResponseDto } from './dto/find-all/find-all-class-response-dto';

@ApiTags('Class contoller')
@Controller('classes')
export class SchoolgroupController {

    constructor(
        private createSchoolgroup: CreateSchoolgroupUseCase,
        private deleteSchoolgroup: DeleteSchoolgroupUsecase,
        private findSchoolgroup: FindSchoolgroupUsecase,
        private findAllSchoolgroup: FindAllSchoolgroupUsecase,
        private updateSchoolgroup: UpdateSchoolgroupUsecase,
    ) { }

    @ApiOperation({ description: 'Create a schoolgroup' })
    @ApiResponse({ status: 201, })
    @ApiResponse({ status: '4XX', description: 'Return status 400 when request has invalid information' })
    @Post()
    async create(@Body() dto: CreateSchoolgroupRequestDto): Promise<void> {
        const usecaseDto = new CreateSchoolgroupUseCaseDto({
            name: dto.name,
            nameBook: dto.nameBook,
            scheduleDto: dto.scheduleDto,
            teacherName: dto.teacherName
        })
        await this.createSchoolgroup.create(usecaseDto);
    }

    @ApiOperation({ description: 'Delete a schoolgroup' })
    @ApiResponse({ status: 204, description: 'if schoolgroup does not exist do anything', example: 'fcfca953-946f-40e9-a1ae-22775888583e' })
    @Delete(':id')
    async delete(@Param('id') id: string): Promise<void> {
        await this.deleteSchoolgroup.execute(id);
    }

    @ApiOperation({ description: 'Find a schoolgroup' })
    @ApiResponse({ status: 204, description: 'if schoolgroup does not exist do anything' })
    @Get(':id')
    async find(@Param('id') id: string) {
        const dto = await this.findSchoolgroup.execute(id);
        return new FindClassResponseDto({
            id: dto.id,
            classCode: dto.classCode,
            name: dto.name,
            nameBook: dto.nameBook,
            schedule: dto.schedule,
            teacher: dto.teacher,
            students: dto.students
        });
    }

    @ApiOperation({ description: 'Find all schoolgroup' })
    @ApiResponse({ status: 204, description: 'If there is no schoolgroup return an empty array' })
    @Get()
    async findAll(): Promise<FindAllClassResponseDto> {
        const result = await this.findAllSchoolgroup.execute();
        return FindAllClassResponseDto.fromFindAllClassDto(result);
    }

    @ApiOperation({ description: 'Update schoolgroup' })
    @ApiResponse({ status: 204, description: '' })
    @ApiResponse({ status: '4XX', description: 'If schoolgroup not found throw exeception' })
    @Patch()
    async update(@Body() dto: UpdateSchoolgroupRequestDto): Promise<void> {
        await this.updateSchoolgroup.update(dto.toUpdateSchoolgroupUsecaseDto());
    }

}
