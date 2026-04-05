import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsDateString, IsEmail, IsEnum, IsNotEmpty, IsNumberString, IsOptional, IsStrongPassword, Length, Max, MaxLength, Min } from "class-validator";
import { AccessType } from "@/domain/user/access.type";

export class CreateUserRequestDto {

    @ApiProperty({
        description: 'Name of user',
        example: 'John Doe',
        required: true,
    })
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'Birthdate of user',
        example: '2025-02-03T12:00:00Z',
        required: true,
    })
    @IsDateString()
    birthDate: string;

    @ApiProperty({
        description: 'Email of user',
        example: 'johndoe@gmail.com',
        required: true,
    })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'Password of user',
        example: '1234@Mudar',
        required: true,
    })
    @IsNotEmpty()
    @IsStrongPassword()
    password: string;

    @ApiProperty({
        description: 'Access type of user',
        example: 'student',
        required: true,
    })
    @IsNotEmpty()
    @IsEnum(AccessType)
    accessType: AccessType;

    @ApiProperty({
        description: 'Class code user related as parent, student or teacher',
        example: '123456',
        required: true,
    })
    @IsNotEmpty()
    @IsNumberString()
    @Length(6, 10)
    classCode: string;

    @ApiProperty({
        description: 'Nickname of user',
        example: 'johndoe',
        required: true,
    })
    @IsNotEmpty()
    @MaxLength(50)
    nickname: string;

    @ApiProperty({
        description: 'Parents of user',
        example: ['John Doe', 'Mary Doe'],
        required: false,
    })
    @IsOptional()
    @IsArray()
    parents?: string[];

    @ApiProperty({
        description: 'Children of user',
        example: ['John Doe', 'Mary Doe'],
        required: false,
    })
    @IsOptional()
    @IsArray()
    students?: string[];
}
