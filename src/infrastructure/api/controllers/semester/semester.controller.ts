import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SemesterUsecases } from '../../../../application/usecases/semester-usecases/semester-usecases';
import { FindAllAcademicSemesterDto } from 'src/application/services/academic-semester/findAll/findAll.academic-semester.dto';
import { CreateAcademicSemesterDto } from 'src/application/services/academic-semester/create/semester/academic-semester.dto';
import { CreateSemesterUsecase } from 'src/application/usecases/semester-usecases/create/create-semester-usecase';

@ApiTags('Semester controller')
@Controller('semesters')
export class SemesterController {

    constructor(
        private createSemester: CreateSemesterUsecase,
        private semesterUseCases: SemesterUsecases
    ){}

    @ApiOperation({description: "Create a semester"})
    @ApiResponse({status: 201, description: 'return 201 if everything ok'})
    @ApiResponse({status: '4XX', description: 'Return exception of 400 status if request has incorrect information'})
    @Post()
    async create(@Body() dto: CreateAcademicSemesterDto): Promise<void>{
       await this.createSemester.create(dto);
    }

    @ApiOperation({description: "Delete academic semester", })
    @ApiResponse({status: 204, description: 'return 204 if everything ok or if the academic semester does not exist', example: "d90c017a-eabe-4cd5-9dd3-ea8e6c037bd6"})
    @Delete(':id')
    async delete(@Param('id') id: string): Promise<void>{
        this.semesterUseCases.delete(id);
    }

    @ApiResponse({status: 200, description: 'if Academic Semester exist return it', example: 'd90c017a-eabe-4cd5-9dd3-ea8e6c037bd6'})
    @ApiResponse({status: '4XX', description: 'if Academic Semester does not exist return not found exception', example: 'd90c017a-eabe-4cd5-9dd3-ea8e6c037bd6'})
    @Get('/:id')
    async find(@Param('id') id: string): Promise<any>{
        return await this.semesterUseCases.find(id);
    }

    @ApiResponse({status: 200, description: 'Return all Academic semester', })
    @ApiResponse({status: '4XX', description: 'If there is no Academic semester return empty array',})
    @Get()
    async findAll(): Promise<FindAllAcademicSemesterDto>{
        return await this.semesterUseCases.findAll();
    }

    @ApiResponse({status: 200, description: 'Return if exist or do anything if academic sementer does not exist', example: "d90c017a-eabe-4cd5-9dd3-ea8e6c037bd6"})
    @Patch("/:id")
    async update(
        @Param('id') id: string,
        @Query('actual') actual: boolean
    ){
        this.semesterUseCases.update(id, actual);
    }

}
