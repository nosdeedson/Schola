import { CreateSchoolgroupDto, Schedule } from "../api/controllers//schoolgroup/dto/create/create-schoolgroup-dto";

export class MockSchoolgroupDto {

  static dtoFind(): any {
    return {
      "id": "bc7746a2-5c78-4e3b-beea-ed6b5f57c7eb",
      "classCode": "15448",
      "name": "B1-afternoon",
      "nameBook": "B1",
      "schedule": {
        "dayOfWeeks": [
          "Monday",
          "Tuesday"
        ],
        "times": {
          "Monday": "08:00",
          "Tuesday": "09:00"
        }
      },
      "students": [],
      "teacher": {}
    }
  }

  static dtoFindAll(): any {
    return {
      "all": [
        {
          "id": "bc7746a2-5c78-4e3b-beea-ed6b5f57c7eb",
          "classCode": "15448",
          "name": "B1-afternoon",
          "nameBook": "B1",
          "schedule": {
            "dayOfWeeks": [
              "Monday",
              "Tuesday"
            ],
            "times": {
              "Monday": "08:00",
              "Tuesday": "09:00"
            }
          },
          "students": [],
          "teacher": {}
        }
      ]
    }
  }

  static dtoToCreate(): any {
    let schedule = new Schedule();
    schedule.dayOfWeeks = [];
    schedule.dayOfWeeks.push(...['Monday', 'Tuesday']);
    schedule.times = [];
    schedule.times.push(...['08:00', '09:00']);

    let dto = new CreateSchoolgroupDto();
    dto.name = 'teste';
    dto.nameBook = 'book name';
    dto.scheduleDto = schedule;
    return dto;
  }

  static dtoToCreateCausingException(): any {
    let schedule = new Schedule();
    schedule.dayOfWeeks = [];
    schedule.dayOfWeeks.push(...['Monday', 'Monday']);
    schedule.times = [];
    schedule.times.push(...['08:00']);

    let dto = new CreateSchoolgroupDto();
    dto.name = 'teste';
    dto.nameBook = 'book name';
    dto.scheduleDto = schedule;
    return dto;
  }
}