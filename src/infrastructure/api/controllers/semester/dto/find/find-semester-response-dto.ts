import { FindAcademicSemesterDto } from "@/application/services/academic-semester/find/find.academic-semester.dto";
import { QuarterResponseDto } from "./quarter-response-dto";
import { FindAllAcademicSemesterDto } from "@/application/services/academic-semester/findAll/findAll.academic-semester.dto";

export class FindSemesterResponseDto {

    id: string;
    current: boolean;
    firstQuarter: QuarterResponseDto;
    secondQuarter: QuarterResponseDto;

    static fromFindAcademicSemesterDto(dto: FindAcademicSemesterDto): FindSemesterResponseDto {
        const out = new FindSemesterResponseDto();
        out.id = dto.id;
        out.current = dto.current;
        out.firstQuarter = QuarterResponseDto.fromQuarterDto(dto.firstQuarter);
        out.secondQuarter = QuarterResponseDto.fromQuarterDto(dto.secondQuarter);
        return out;
    }

    static fromFindAllAcademicSemesterDto(dto: FindAllAcademicSemesterDto): FindSemesterResponseDto[] {
        const out: FindSemesterResponseDto[] = [];
        dto.all.forEach(it => {
            out.push(this.fromFindAcademicSemesterDto(it));
        });
        return out;
    }
}
