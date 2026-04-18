import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FindAllAcademicSemesterDto } from '@/application/services/academic-semester/findAll/findAll.academic-semester.dto';
import { CreateSemesterUsecase } from '@/application/usecases/semester-usecases/create/create-semester-usecase';
import { SemesterRequestDto } from './dto/create/semester-request-dto';
import { DelesteSemesterUsecase } from '@/application/usecases/semester-usecases/delete/delete-semester-usecase';
import { FindSemesterUsecase } from '@/application/usecases/semester-usecases/find/find-semester-usecase';
import { FindAllSemesterUsecase } from '@/application/usecases/semester-usecases/find-all/find-all-semester-usecase';
import { UpdateSemesterUseCase } from '@/application/usecases/semester-usecases/update/update-semester.usecase';
import { UpdateAcademicSemesterDto } from '@/application/services/academic-semester/update/udpate.academic-semester.dto';
import { FindSemesterResponseDto } from './dto/find/find-semester-response-dto';
import { UpdateAcademicSemesterRequestDto } from './dto/update/update-academic-semester-request-dto';

@ApiTags('Semester controller')
@Controller('semesters')
export class SemesterController {

    constructor(
        private createSemester: CreateSemesterUsecase,
        private deleteSemester: DelesteSemesterUsecase,
        private findSemester: FindSemesterUsecase,
        private findAllSemester: FindAllSemesterUsecase,
        private updateSemester: UpdateSemesterUseCase,
    ) { }

    @ApiOperation({ description: "Create a semester" })
    @ApiResponse({ status: 201, description: 'return 201 if everything ok' })
    @ApiResponse({ status: '4XX', description: 'Return exception of 400 status if request has incorrect information' })
    @Post()
    async create(@Body() dto: SemesterRequestDto): Promise<void> {
        await this.createSemester.create(dto.toSemester());
    }

    @ApiOperation({ description: "Delete academic semester", })
    @ApiResponse({ status: 204, description: 'return 204 if everything ok or if the academic semester does not exist', example: "d90c017a-eabe-4cd5-9dd3-ea8e6c037bd6" })
    @Delete(':id')
    async delete(@Param('id') id: string): Promise<void> {
        this.deleteSemester.execute(id);
    }

    @ApiResponse({ status: 200, description: 'if Academic Semester exist return it', example: 'd90c017a-eabe-4cd5-9dd3-ea8e6c037bd6' })
    @ApiResponse({ status: '4XX', description: 'if Academic Semester does not exist return not found exception', example: 'd90c017a-eabe-4cd5-9dd3-ea8e6c037bd6' })
    @Get('/:id')
    async find(@Param('id') id: string): Promise<FindSemesterResponseDto> {
        const dto = await this.findSemester.execute(id);
        return FindSemesterResponseDto.fromFindAcademicSemesterDto(dto);
    }

    @ApiResponse({ status: 200, description: 'Return all Academic semester', })
    @ApiResponse({ status: '4XX', description: 'If there is no Academic semester return empty array', })
    @Get()
    async findAll(): Promise<FindSemesterResponseDto[]> {
        const dto = await this.findAllSemester.execute();
        return FindSemesterResponseDto.fromFindAllAcademicSemesterDto(dto);
    }

    @ApiResponse({ status: 200, description: 'Return if exist or do anything if academic sementer does not exist', example: "d90c017a-eabe-4cd5-9dd3-ea8e6c037bd6" })
    @Put()
    async update(@Body() dto: UpdateAcademicSemesterRequestDto) {
        this.updateSemester.execute(dto.toUsecaseDto());
    }

}
