import { mockQuarter } from "../../../../../tests/mocks/domains/quarter.mocks";
import { Grade } from "../../../../domain/enum/grade/grade";
import { MockRepositoriesForUnitTest } from "../../../../infrastructure/__mocks__/mockRepositories";
import { DomainMocks } from "../../../../infrastructure/__mocks__/mocks";
import { CreateRatingDto } from './create.rating.dto';
import { CreateRatingService } from './create.rating.service';


describe('CreateRatingService unit tests', () => {

    it('should throw a systemError if semester is not present', async () => {
        const ratingRepository = MockRepositoriesForUnitTest.mockRepositories();
        const service = new CreateRatingService(ratingRepository);
        const student = DomainMocks.mockStudent();
        let quarter;
        const dto = new CreateRatingDto(
            student,
            quarter,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
        );
        await expect(service.execute(dto)).rejects.toMatchObject({
            errors: [{ context: 'rating', message: 'quarter of rating must be informed' }]
        });
    });


    // student receiving rating must be informed
    it('should throw a systemError if student is not present', async () => {
        const ratingRepository = MockRepositoriesForUnitTest.mockRepositories();
        const service = new CreateRatingService(ratingRepository);
        let student;
        let quarter = mockQuarter();
        const dto = new CreateRatingDto(
            student,
            quarter,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
        );
        await expect(service.execute(dto)).rejects.toMatchObject({errors: 
            [{ context: 'rating', message: 'student receiving rating must be informed' }]
        });
    });

    // the listining skill must be informed
    it('should throw a systemError if listining is not graded ', async () => {
        const ratingRepository = MockRepositoriesForUnitTest.mockRepositories();
        const service = new CreateRatingService(ratingRepository);
        let student = DomainMocks.mockStudent();
        let quarter = mockQuarter()
        let listing;
        const dto = new CreateRatingDto(
            student,
            quarter,
            listing,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
        );
        await expect(service.execute(dto)).rejects.toMatchObject({errors: 
            [{ context: 'rating', message: 'the listining skill must be informed' }]
        });
    });

    // the writing skill must be informed
    it('should throw a systemError if writing is not graded ', async () => {
        const ratingRepository = MockRepositoriesForUnitTest.mockRepositories();
        const service = new CreateRatingService(ratingRepository);
        let student = DomainMocks.mockStudent();
        let quarter = mockQuarter();
        let writing;
        const dto = new CreateRatingDto(
            student,
            quarter,
            Grade.BAD,
            writing,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
        );
        await expect(service.execute(dto)).rejects.toMatchObject({errors:
            [{ context: 'rating', message: 'the writing skill must be informed' }]
        });
    });

    // the reading skill must be informed
    it('should throw a systemError if reading is not graded ', async () => {
        const ratingRepository = MockRepositoriesForUnitTest.mockRepositories();
        const service = new CreateRatingService(ratingRepository);
        let student = DomainMocks.mockStudent();
        let quarter = mockQuarter();
        let reading;
        const dto = new CreateRatingDto(
            student,
            quarter,
            Grade.BAD,
            Grade.BAD,
            reading,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
        );
        await expect(service.execute(dto)).rejects.toMatchObject({errors:
            [{ context: 'rating', message: 'the reading skill must be informed' }]
        });
    });

    // the speaking skill must be informed
    it('should throw a systemError if speaking is not graded ', async () => {
        const ratingRepository = MockRepositoriesForUnitTest.mockRepositories();
        const service = new CreateRatingService(ratingRepository);
        let student = DomainMocks.mockStudent();
        let quarter = mockQuarter();
        let speaking;
        const dto = new CreateRatingDto(
            student,
            quarter,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            speaking,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
        );
        await expect(service.execute(dto)).rejects.toMatchObject({errors: 
            [{ context: 'rating', message: 'the speaking skill must be informed' }]
        });
    });

    // the grammar skill must be informed
    it('should throw a systemError if grammar is not graded ', async () => {
        const ratingRepository = MockRepositoriesForUnitTest.mockRepositories();
        const service = new CreateRatingService(ratingRepository);
        let student = DomainMocks.mockStudent();
        let quarter = mockQuarter();
        let grammar;
        const dto = new CreateRatingDto(
            student,
            quarter,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            grammar,
            Grade.BAD,
            Grade.BAD,
        );
        await expect(service.execute(dto)).rejects.toMatchObject({errors:
            [{ context: 'rating', message: 'the grammar skill must be informed' }]
        });
    });

    // the homework commitment must be informed
    it('should throw a systemError if homework is not graded ', async () => {
        const ratingRepository = MockRepositoriesForUnitTest.mockRepositories();
        const service = new CreateRatingService(ratingRepository);
        let student = DomainMocks.mockStudent();
        let quarter = mockQuarter();
        let homework;
        const dto = new CreateRatingDto(
            student,
            quarter,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            homework,
            Grade.BAD,
        );
        await expect(service.execute(dto)).rejects.toMatchObject({errors:
            [{ context: 'rating', message: 'the homework commitment must be informed' }]
        });
    });

    // the vocabulary improvment must be informed
    it('should throw a systemError if vocabulary is not graded ', async () => {
        const ratingRepository = MockRepositoriesForUnitTest.mockRepositories();
        const service = new CreateRatingService(ratingRepository);
        let student = DomainMocks.mockStudent();
        let quarter = mockQuarter();
        let vocabulary;
        const dto = new CreateRatingDto(
            student,
            quarter,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            Grade.BAD,
            vocabulary,
        );
        await expect(service.execute(dto)).rejects.toMatchObject({errors: 
            [{ context: 'rating', message: 'the vocabulary improvment must be informed' }]
        });
    });

});