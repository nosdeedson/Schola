import { ParentStudentEntity } from "@/infrastructure/entities/parent-student/parent.student.entity";
import { DataSource, QueryFailedError, Repository } from "typeorm";

export class ParentStudentRepository {
    constructor(private repository: Repository<ParentStudentEntity>){}

    async create(entity: ParentStudentEntity): Promise<ParentStudentEntity>{
        try {
            return this.repository.save(entity);
        } catch (error) {
            console.log(error);
            throw new QueryFailedError(null, null, error);
        }
    }

    async delete(){
        throw new Error("Method not implemented.");
    }

    async find(){
        throw new Error("Method not implemented.");
    }

    async findAll(){
        return this.repository.find();
    }

    async update(){
        throw new Error("Method not implemented.");
    }   

}