import { FindAllClassDto } from "@/application/services/class/findAll/findAll.class.dto";
import { FindClassResponseDto } from "../find/find-class-response-dto";

export class FindAllClassResponseDto {
    
    static fromFindAllClassDto(dto: FindAllClassDto): FindAllClassResponseDto{
        let all = [];    
        dto.all.forEach(it => { 
            const schoolgroup = new FindClassResponseDto({
                id: it.id,
                classCode: it.classCode,
                name: it.name,
                nameBook: it.nameBook,
                schedule: it.schedule,
                students: it.students,
                teacher: it.teacher,
            })
            all.push(schoolgroup)
        });
        return all as FindAllClassResponseDto;
    }
}