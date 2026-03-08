import { Class } from "../../../../domain/class/class";
import { ClassRepositoryInterface } from "src/domain/class/class.repository.interface";
import { Schedule } from "../../../../domain/schedule/schedule";
import { ClassCodeHelper } from "../../../../helpers/classCode/class-code.heper";
import { ClassEntity } from "../../../../infrastructure/entities/class/class.entity";
import { CreateClassDto } from "./create.class.dto";
import { SystemError } from "../../@shared/system-error";

export class CreateClassService {
    private classRepository: ClassRepositoryInterface;

    constructor(classRepository: ClassRepositoryInterface){
        this.classRepository = classRepository;
    }

    async execute(dto: CreateClassDto) {
        try{
            dto.classCode = ClassCodeHelper.createClassCode();
            let schedule = new Schedule(dto.scheduleDto.dayOfWeeks, dto.scheduleDto.times);
            let schoolGroup = new Class(dto.classCode, dto.nameBook, dto.name, schedule);
            if( schoolGroup.notification.hasError()){
                throw new SystemError(schoolGroup.notification?.getErrors());
            }    
            let entity = ClassEntity.toClassEntity(schoolGroup);
            entity.teacher = dto.teacherEntity;
            await this.classRepository.create(entity);
        } catch(error){
            throw error;
        }
    }

}