import { CommentRepositoryInterface } from "@/domain/comment/comment.repository.interface";
import { FindAllCommentDto } from "./findAll.comment.dto";

export class FindAllCommentService {

    private commentRepositoy: CommentRepositoryInterface;

    constructor(commentRepositoy: CommentRepositoryInterface){
        this.commentRepositoy = commentRepositoy;
    }

    async execute(): Promise<FindAllCommentDto>{
        const results = await this.commentRepositoy.findAll();
        const dtos = new FindAllCommentDto(results);
        return dtos;
    }
}