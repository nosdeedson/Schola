import { Worker } from "@/domain/worker/worker";
import { ClassEntity } from "@/infrastructure/entities/class/class.entity";
import { WorkerEntity } from "@/infrastructure/entities/worker/worker.entity";


export class WorkerMapper {

    static fromDomain(worker: Worker, classEntity?: ClassEntity): WorkerEntity {

        if (!worker) {
            return undefined;
        }
        let model = new WorkerEntity();
        model.birthday = worker?.getBirthday();
        if (!model.classes) {
            model.classes = []
        }
        if (classEntity) {
            model.classes.push(classEntity)
        } else {
            model.classes = []
        }
        model.createdAt = worker.getCreatedAt();
        model.deletedAt = worker.getDeletedAt();
        model.fullName = worker.getName();
        model.id = worker.getId();
        model.role = worker.getRole();
        model.updatedAt = worker.getUpdatedAt();
        return model;
    }

    static fromEntity(entity: WorkerEntity): Worker {
        return new Worker({
            birthday: entity.birthday,
            name: entity.fullName,
            role: entity.role,
            id: entity.id,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
            deletedAt: entity.deletedAt
        });
    }
}
