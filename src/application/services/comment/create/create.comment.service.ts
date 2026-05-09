import { CommentRepositoryInterface } from "@/domain/comment/comment.repository.interface";
import { CreateCommentDto } from "./create.comment.dto";
import { Comment } from "@/domain/comment/comment";
import { CommentEntity } from "@/infrastructure/entities/comment/comment.entity";

export class CreateCommentService {

    private commentRepository: CommentRepositoryInterface;

    constructor(
        commentRepository: CommentRepositoryInterface,
    ) {
        this.commentRepository = commentRepository;
    }

    async execute(dto: CreateCommentDto) {
        try {
            let comment = new Comment(dto.comment, dto.namePersonHaveDone);
            let entity = CommentEntity.toCommentEntity(comment, dto.rating);
            await this.commentRepository.create(entity);
        } catch (error) {
            throw error;
        }
    }
}
