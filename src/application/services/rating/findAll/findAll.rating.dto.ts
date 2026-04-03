import { RatingEntity } from "@/infrastructure/entities/rating/rating.entity";
import { FindRatingDto } from "../find/find.rating.dto";

export class FindAllRatingDto {

    all: FindRatingDto[] = [];

    constructor(entities: RatingEntity[]){
        entities.map(it =>{
            let dto = new FindRatingDto(it);
            this.all.push(dto);
        })
    }

}