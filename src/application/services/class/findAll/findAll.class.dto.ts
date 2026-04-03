import { ClassEntity } from "@/infrastructure/entities/class/class.entity";
import { FindClassDto } from "../find/find.class.dto";
import { All } from "@nestjs/common";

export class FindAllClassDto{

    all: FindClassDto[] = [];

    constructor(entities: ClassEntity[]){
        if(entities){
            entities.map(it => {
                let dto = FindClassDto.toDto(it);
                this.all.push(dto)
            });
        }
    }
}