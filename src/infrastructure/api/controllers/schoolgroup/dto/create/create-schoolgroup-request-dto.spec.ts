import { CreateSchoolgroupRequestDto, ScheduleRequestDto } from '../create/create-schoolgroup-request-dto';

describe('CreateSchoolgroupDto', () => {

  it('should be defined', () => {
    expect(new CreateSchoolgroupRequestDto()).toBeDefined();
  });

  it('should return a CreateClassDto', () => {
    const dto = new CreateSchoolgroupRequestDto();
    dto.name = "class name";
    dto.nameBook = "name book";
    dto.teacherName = "teacher name";
    const scheduleDto = new ScheduleRequestDto();
    scheduleDto.dayOfWeeks = ['wednesday', 'thursday'];
    scheduleDto.times = ['08:00', '09:00']
    dto.scheduleDto = scheduleDto;
    expect(dto).toBeDefined();
    expect(dto.scheduleDto).toStrictEqual(scheduleDto);
    expect(dto.name).toBe("class name")
  });

});
