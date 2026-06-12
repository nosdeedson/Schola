import { Quarter } from "@/domain/quarter/quarter";
import { QuarterDto } from "../create/quarter/quarter.dto";
import { QuarterEntity } from "@/infrastructure/entities/quarter/quarter.entity";

export class FindAcademicSemesterDto {
    id: string;
    current: boolean;
    firstQuarter: QuarterDto;
    secondQuarter: QuarterDto;

    constructor(params: {
        id: string,
        current: boolean,
        firstQuarter: Quarter,
        secondQuarter: Quarter,
    }
    ) {
        const { id, current, firstQuarter, secondQuarter } = params;
        this.id = id;
        this.current = current;
        this.firstQuarter = QuarterDto.fromDomain(firstQuarter);
        this.secondQuarter = QuarterDto.fromDomain(secondQuarter);
    }

}
