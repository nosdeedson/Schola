import { CommentRepositoryInterface } from "@/domain/comment/comment.repository.interface";

export class DeleteCommentService{

    private commentRepository: CommentRepositoryInterface;

    constructor( commentRepository: CommentRepositoryInterface){
        this.commentRepository = commentRepository;
    }

    async execute(idComment: string){
        await this.commentRepository.delete(idComment);
    }
}