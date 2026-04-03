import { CommentEntity } from "@/infrastructure/entities/comment/comment.entity";

export class FindCommentDto{

    idComment: string;
    comment: string;
    idPersonHadDone: string;
    createdAt: Date;

    constructor( comment: CommentEntity){
        this.idComment = comment.id;
        this.comment = comment.comment;
        this.idPersonHadDone = comment.idPersonHaveDone;
        this.createdAt = comment.createdAt;
    }
}