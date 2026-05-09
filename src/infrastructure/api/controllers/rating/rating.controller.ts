import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SaveRatingRequestDto } from './dto/save-rating-request-dto';
import { SaveRatingUsecase } from '@/application/usecases/save-rating/save-rating-usecase';

@ApiTags('Ratings')
@Controller('ratings')
export class RatingController {

    constructor(
        private saveRatingUsecase: SaveRatingUsecase,
    ) { }

    @ApiOperation({ description: "Save a rating of a student" })
    @Post()
    public async saveRating(@Body() dto: SaveRatingRequestDto) {
        this.saveRatingUsecase.execute(dto.toUseCaseDto());
    }
}
