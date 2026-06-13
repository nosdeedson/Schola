import { FindCommentDto } from "../find/find.comment.dto";
import { Comment } from "@/domain/comment/comment";

export class FindAllCommentDto {

    all: FindCommentDto[] = [];

    constructor(entities: Comment[]) {
        if (entities) {
            entities.map(it => {
                let dto = new FindCommentDto(it);
                this.all.push(dto);
            })
        }
    }
}
