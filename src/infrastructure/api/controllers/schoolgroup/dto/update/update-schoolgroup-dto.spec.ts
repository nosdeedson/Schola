import { UpdateSchoolgroupDto } from '../update/update-schoolgroup-dto';

describe('UpdateSchoolgroupDto', () => {

    it('should be defined', () => {
        expect(new UpdateSchoolgroupDto()).toBeDefined();
    })

    it('should return a UpdateClassDto', () => {
        let dto = new UpdateSchoolgroupDto();
        dto.className = 'class name';
        dto.id = "16efc675-a208-43fe-93dd-8b9a3eebe656";
        dto.nameBook = 'name book';
        let input = dto.toInput();
        expect(input).toBeDefined();
        expect(input.id).toBe(dto.id);
        expect(input.bookName).toBe(dto.nameBook);
        expect(input.className).toBe(dto.className);
    })
})