import { DATA_SOURCE } from "@/infrastructure/data-base-connection/data-base-connection.module";
import { ParentStudentEntity } from "@/infrastructure/entities/parent-student/parent.student.entity";
import { Inject, Injectable } from "@nestjs/common";
import { DataSource, QueryFailedError, Repository } from "typeorm";

@Injectable()
export class ParentStudentRepository {
    private parentStudentRepository: Repository<ParentStudentEntity>;
    constructor(
        @Inject(DATA_SOURCE)
        private dataSource: DataSource
    ) {
        this.parentStudentRepository = this.dataSource.getRepository(ParentStudentEntity);
    }

    async create(entity: ParentStudentEntity): Promise<ParentStudentEntity> {
        try {
            return await this.parentStudentRepository.save(entity);
        } catch (error: any) {
            throw new QueryFailedError(null, null, error);
        }
    }

    async delete() {
        throw new Error("Method not implemented.");
    }

    async find() {
        throw new Error("Method not implemented.");
    }

    async findAll() {
        return this.parentStudentRepository.find();
    }

    async update() {
        throw new Error("Method not implemented.");
    }

}
