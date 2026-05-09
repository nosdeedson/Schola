import { CommentEntity } from "@/infrastructure/entities/comment/comment.entity";

export class FindCommentDto {

    idComment: string;
    comment: string;
    namePersonHadDone: string;
    createdAt: Date;

    constructor(comment: CommentEntity) {
        this.idComment = comment.id;
        this.comment = comment.comment;
        this.namePersonHadDone = comment.namePersonHaveDone;
        this.createdAt = comment.createdAt;
    }
}
