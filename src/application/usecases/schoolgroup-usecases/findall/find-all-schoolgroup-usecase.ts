import { FindAllClassDto } from "@/application/services/class/findAll/findAll.class.dto";
import { FindAllClassService } from "@/application/services/class/findAll/findAll.class.service";
import { ClassRepositoryInterface } from "@/domain/class/class.repository.interface";

export class FindAllSchoolgroupUsecase {

    constructor(private classRepository: ClassRepositoryInterface) { }

    async execute(): Promise<FindAllClassDto> {
        const classService = new FindAllClassService(this.classRepository);
        return await classService.execute();
    }
}