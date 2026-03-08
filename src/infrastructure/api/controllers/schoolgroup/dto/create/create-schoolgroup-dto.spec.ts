import { CreateSchoolgroupDto, Schedule } from '../create/create-schoolgroup-dto';

describe('CreateSchoolgroupDto', () => {

  it('should be defined', () => {
    expect(new CreateSchoolgroupDto()).toBeDefined();
  });

  it('should return a CreateClassDto', () =>{

    let schedule = new Schedule();
    schedule.dayOfWeeks = [];
    schedule.dayOfWeeks.push(...['Monday', 'Tuesday']);
    schedule.times = [];
    schedule.times.push(...['08:00', '09:00']);

    let dto = new CreateSchoolgroupDto();
    dto.name = 'teste';
    dto.nameBook = 'book name';
    dto.scheduleDto = schedule;

    let result = dto.toInput();
    expect(result).toBeDefined();
    expect(result.name).toBe(dto.name);
    expect(result.nameBook).toBe(dto.nameBook);
    expect(result.scheduleDto.dayOfWeeks.length).toBe(2);
    expect(result.scheduleDto.times.size).toBe(2);
  })

  it('toMap Schedule must return a Map', () =>{
    let schedule = new Schedule();
    schedule.dayOfWeeks = [];
    schedule.dayOfWeeks.push(...['Monday', 'Tuesday']);
    schedule.times = [];
    schedule.times.push(...['08:00', '09:00']);

    let map = schedule.toMap(schedule.times, schedule.dayOfWeeks);
    expect(map).toBeDefined();
    expect(map.has(schedule.dayOfWeeks[0])).toBeTruthy();
    expect(map.has(schedule.dayOfWeeks[1])).toBeTruthy();
    expect(map.get(schedule.dayOfWeeks[0])).toBe(schedule.times[0]);
    expect(map.get(schedule.dayOfWeeks[1])).toBe(schedule.times[1]);
  })

});
