import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsDefined, IsNotEmpty, IsObject, ValidateNested } from "class-validator";

export class ScheduleRequestDto {

    @ApiProperty({ description: 'Days of the week that the lessons will be teach.', example: ['Monday', 'Tuesday'] })
    @IsArray({message: "Days of week of the class is required"})
    dayOfWeeks: string[];

    @ApiProperty({ description: 'Hours of the lessons', example: ['08:00', '09:00'] })
    @IsArray({message: "Times of the class is required",})
    times: string[];

}

export class CreateSchoolgroupRequestDto {

    @ApiProperty({ description: 'Name of the books that will be used in the lessons', example: 'A1' })
    @IsNotEmpty({message: "Name of the book is required"})
    nameBook: string;

    @ApiProperty({ description: 'Name of the schoolgroup', example: 'A1-morning' })
    @IsNotEmpty({message: "Name of the class is required"})
    name: string;

    @ApiProperty({ description: "times and days of the class" })
    @IsDefined({message: "Schedule of the class is required"})
    @ValidateNested({message: "Schedule must have the days of week of a class and the times"})
    @Type(() => ScheduleRequestDto)
    scheduleDto: ScheduleRequestDto;

    @ApiProperty({ description: "name of the teacher", example: "Amelia Teacher" })
    @IsNotEmpty({message: "Name of the class teacher is required"})
    teacherName: string;

}
