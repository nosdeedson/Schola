import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { SaveCommentRatingRequestDto } from './dto/save-comment-rating-request.dto';
import { CommentRatingUsecase } from '@/application/usecases/comment-rating/comment-rating-usecase';

@Controller('comment')
export class CommentController {

    constructor(
        private studentCommentRating: CommentRatingUsecase
    ) { }

    @ApiOperation({ description: 'save a comment of a rating of the student' })
    @Post('ratings')
    public async commentingRating(@Body() dto: SaveCommentRatingRequestDto) {
        this.studentCommentRating.execute(dto.toCommentRatingUsecaseDto());
    }
}
