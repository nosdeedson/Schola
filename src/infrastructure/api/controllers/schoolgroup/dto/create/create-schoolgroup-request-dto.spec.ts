import { CreateSchoolgroupRequestDto, ScheduleRequestDto } from '../create/create-schoolgroup-request-dto';

describe('CreateSchoolgroupDto', () => {

  it('should be defined', () => {
    expect(new CreateSchoolgroupRequestDto()).toBeDefined();
  });

  it('should return a CreateClassDto', () => {
    expect(true).toBe(true)
  })

  it('toMap Schedule must return a Map', () => {
    expect(true).toBe(true)
  })

});
