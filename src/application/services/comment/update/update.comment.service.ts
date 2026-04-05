import { CommentRepositoryInterface } from "@/domain/comment/comment.repository.interface";
import { UpdateCommentDto } from "./update.comment.dto";
import { SystemError } from "@/application/services/@shared/system-error";

export class UpdateCommentService {

    private commentRepository: CommentRepositoryInterface;

    constructor(commentRepository: CommentRepositoryInterface) {
        this.commentRepository = commentRepository;
    }

    async execute(dto: UpdateCommentDto) {
        const comment = await this.commentRepository.find(dto.idComment);
        if (!comment) {
            throw new SystemError([{ context: 'comment', message: 'comment not found' }]);
        }
        comment.comment = dto.comment;
        await this.commentRepository.update(comment);
    }
}
