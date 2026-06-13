import { CommentRepositoryInterface } from "@/domain/comment/comment.repository.interface";
import { UpdateCommentDto } from "./update.comment.dto";
import { SystemError } from "@/application/services/@shared/system-error";
import { CommentMapper } from "@/infrastructure/mappers/comment/comment-mapper";

export class UpdateCommentService {

    private commentRepository: CommentRepositoryInterface;

    constructor(commentRepository: CommentRepositoryInterface) {
        this.commentRepository = commentRepository;
    }

    async execute(dto: UpdateCommentDto) {
        const comment = await this.commentRepository.find(dto.idComment);
        if (!comment) {
            throw new SystemError([{ context: 'comment', message: 'comment not found' }], 404);
        }
        comment.setComment(dto.comment);
        await this.commentRepository.update(CommentMapper.fromDomain(comment, comment.getRating()));
    }
}
