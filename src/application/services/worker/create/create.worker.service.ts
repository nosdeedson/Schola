import { SystemError } from 'src/application/services/@shared/system-error';
import { ClassRepositoryInterface } from '../../../../domain/class/class.repository.interface';
import { Worker } from '../../../../domain/worker/worker';
import { WorkerRepositoryInterface } from '../../../../domain/worker/worker.repository.interface';
import { WorkerEntity } from '../../../../infrastructure/entities/worker/worker.entity';
import { CreateWorkerDto } from './create.worker.dto';
import { CreateGenericService } from 'src/application/services/@shared/create-generic-service';


export class CreateWorkerService extends CreateGenericService {

    private workerRepository: WorkerRepositoryInterface
    private schoolGroupRepository: ClassRepositoryInterface;

    constructor(
        workerRepository: WorkerRepositoryInterface,
        schoolGroupRepository: ClassRepositoryInterface,
    ){
        super(workerRepository);
        this.workerRepository = workerRepository;
        this.schoolGroupRepository = schoolGroupRepository;
    }

    public async execute(input: CreateWorkerDto): Promise<WorkerEntity>{
        try {
            const teacherExist = await this.workerRepository.findByName(input.name);
            if(teacherExist){
                teacherExist.birthday = input.birthday;
                teacherExist.updatedAt = new Date();
                return await this.workerRepository.create(teacherExist) as WorkerEntity;
            }
            // TODO NEED TO VERIFY IF TEACHER ALREADY EXIST, YES UPDATE OTHERWISE CREATE
            let worker = new Worker({birthday: input.birthday, name: input.name, role: input.role});
            if(worker.notification?.hasError()){
                throw new SystemError(worker.notification.getErrors());
            }
            let model = WorkerEntity.toWorkerEntity(worker);
            let schoolGroup = await this.schoolGroupRepository.findByClassCode(input.classCode);
            model.classes = [];
            model.classes.push(schoolGroup);
            return await this.workerRepository.create(model) as WorkerEntity;
            // TODO CREATE THE USER FOR WORKER, WHICH MUST BE DONE IN THE SERVICE THAT WOULD BE CALLED BY THE CONTROLLER
        } catch (error) {
            throw error;
        }
    }
}