import { UserRepositoryInterface } from "@/domain/user/user.repository.interface";
import { DATA_SOURCE } from "@/infrastructure/data-base-connection/data-base-connection.module";
import { UserEntity } from "@/infrastructure/entities/user/user.entity";
import { Inject, Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class UserRepository implements UserRepositoryInterface {
    private userRespository: Repository<UserEntity>;

    constructor(
        @Inject(DATA_SOURCE)
        private dataSource: DataSource
    ) {
        this.userRespository = this.dataSource.getRepository(UserEntity);
     }

    async create(entity: UserEntity): Promise<UserEntity> {
        try {
            return await this.userRespository.save(entity);
        } catch (error) {
            throw error;
        }
    }

    async delete(id: string): Promise<void> {
        await this.dataSource.createQueryBuilder()
            .update(UserEntity)
            .set({
                deletedAt: new Date()
            })
            .where('id= :id', { id: id })
            .execute()
    }

    async find(id: string): Promise<UserEntity> {
        let user = await this.userRespository.findOne({
            where: { id: id },
            relations: {
                person: true
            }
        });
        return user;
    }

    async findAll(): Promise<UserEntity[]> {
        return await this.userRespository.find({
            relations: {
                person: true
            }
        })
    }

    async update(entity: UserEntity): Promise<void> {
        await this.userRespository.save(entity);
    }

}
