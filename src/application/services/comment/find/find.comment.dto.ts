import { Comment } from "@/domain/comment/comment";
import { CommentEntity } from "@/infrastructure/entities/comment/comment.entity";

export class FindCommentDto {

    idComment: string;
    comment: string;
    namePersonHadDone: string;
    createdAt: Date;

    constructor(comment: Comment) {
        this.idComment = comment.getId();
        this.comment = comment.getComment();
        this.namePersonHadDone = comment.getNamePersonHaveDone();
        this.createdAt = comment.getCreatedAt();
    }
}
