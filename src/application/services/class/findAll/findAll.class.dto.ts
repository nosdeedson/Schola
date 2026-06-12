import { ClassEntity } from "@/infrastructure/entities/class/class.entity";
import { FindClassDto } from "../find/find.class.dto";
import { All } from "@nestjs/common";
import { Class } from "@/domain/class/class";

export class FindAllClassDto{

    all: FindClassDto[] = [];

    constructor(entities: Class[]){
        if(entities){
            entities.map(it => {
                let dto = FindClassDto.toDto(it);
                this.all.push(dto)
            });
        }
    }
}