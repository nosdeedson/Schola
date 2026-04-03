import { CommentEntity } from "@/infrastructure/entities/comment/comment.entity";
import { FindCommentDto } from "../find/find.comment.dto";

export class FindAllCommentDto {

    all: FindCommentDto[] = [];

    constructor(entities: CommentEntity[]) {
        if(entities){
            entities.map(it =>{
                let dto = new FindCommentDto(it);
                this.all.push(dto);
            })
        }
    }
}