import { CommentRepositoryInterface } from "@/domain/comment/comment.repository.interface";
import { FindCommentDto } from "./find.comment.dto";
import { SystemError } from "@/application/services/@shared/system-error";

export class FindCommentService {

    private commentRepository: CommentRepositoryInterface;

    constructor(commentRepository: CommentRepositoryInterface) {
        this.commentRepository = commentRepository;
    }

    async execute(id: string): Promise<FindCommentDto> {
        let entity = await this.commentRepository.find(id);
        if (!entity) {
            throw new SystemError([{ context: 'comment', message: 'comment not found' }]);
        }
        let dto = new FindCommentDto(entity);
        return dto;
    }

}
