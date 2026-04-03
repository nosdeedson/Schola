import { CommentRepositoryInterface } from "@/domain/comment/comment.repository.interface";
import { CreateCommentDto } from "./create.comment.dto";
import { Comment } from "@/domain/comment/comment";
import { CommentEntity } from "@/infrastructure/entities/comment/comment.entity";
import { RatingRepositoryInterface } from "@/domain/rating/rating.repository.interface";
import { SystemError } from "src/application/services/@shared/system-error";

export class CreateCommentService{
    
    private commentRepository: CommentRepositoryInterface;
    private ratingRepository: RatingRepositoryInterface;

    constructor(
        commentRepository: CommentRepositoryInterface,
        ratingRepository: RatingRepositoryInterface,)
    {
        this.commentRepository = commentRepository;
        this.ratingRepository = ratingRepository;
    }

    async execute(dto: CreateCommentDto){
        try{

            let ratingEntity = await this.ratingRepository.find(dto.idRating);
            if(!ratingEntity){
                throw new SystemError([{context: 'comment', message: 'Rating not found'}]);
            }
            let comment = new Comment(dto.comment, dto.idPersonHaveDone);
            let entity = CommentEntity.toCommentEntity(comment, ratingEntity);
            await this.commentRepository.create(entity);
        } catch(error){
            throw error;
        }
    }
}