import { Worker } from "../../../domain/worker/worker";
import { UserConverter } from "../@shared/user-converter/user.converter.interface";
import { PersonEntity } from "../@shared/person.entity";
import { WorkerEntity } from "./worker.entity";
import { ClassEntity } from "../class/class.entity";
import { WorkerMapper } from "@/infrastructure/mappers/worker/worker-mapper";

export class WorkerUserconverter implements UserConverter<Worker> {

    converter(entity: Worker, schooGroups?: ClassEntity): PersonEntity {
        return WorkerMapper.fromDomain(entity, schooGroups);
    }

}
