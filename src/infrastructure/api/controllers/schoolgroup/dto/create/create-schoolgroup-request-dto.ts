import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class ScheduleRequestDto {

    @ApiProperty({ description: 'Days of the week that the lessons will be teach.', example: ['Monday', 'Tuesday'] })
    dayOfWeeks: string[];

    @ApiProperty({ description: 'Hours of the lessons', example: ['08:00', '09:00'] })
    times: string[];

}

export class CreateSchoolgroupRequestDto {

    @ApiProperty({ description: 'Name of the books that will be used in the lessons', example: 'A1' })
    nameBook: string;

    @ApiProperty({ description: 'Name of the schoolgroup', example: 'A1-morning' })
    name: string;

    @ApiProperty({ description: "times and days of the class" })
    scheduleDto: ScheduleRequestDto;

    @ApiProperty({ description: "name of the teacher", example: "Amelia Teacher" })
    teacherName: string;

}
