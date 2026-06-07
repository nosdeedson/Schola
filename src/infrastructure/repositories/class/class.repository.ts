import { ClassRepositoryInterface } from "../../../domain/class/class.repository.interface";
import { ClassEntity } from "../../../infrastructure/entities/class/class.entity";
import { DataSource, QueryFailedError, Repository } from "typeorm";
import { Inject, Injectable } from "@nestjs/common";
import { DATA_SOURCE } from "@/infrastructure/data-base-connection/data-base-connection.module";
import { Class } from "@/domain/class/class";
import { ClassMapper } from "@/infrastructure/mappers/schoolgroup/class-mapper";

@Injectable()
export class ClassRepository implements ClassRepositoryInterface {
    private classRepository: Repository<ClassEntity>;
    constructor(
        @Inject(DATA_SOURCE)
        private dataSource: DataSource
    ) {
        this.classRepository = this.dataSource.getRepository(ClassEntity)
    }

    async create(entity: ClassEntity, relation?: ClassEntity): Promise<Class> {
        const queryRunner = this.dataSource.createQueryRunner();

        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();
            const result = await queryRunner.manager.save(entity);
            await queryRunner.commitTransaction();
            return ClassMapper.fromEntity(result);
        } catch (error: any) {
            await queryRunner.rollbackTransaction();
            throw new QueryFailedError(null, null, error);
        } finally {
            await queryRunner.release();
        }
    }

    async delete(id: string): Promise<void> {
        await this.dataSource.createQueryBuilder()
            .update(ClassEntity)
            .set({ deletedAt: new Date() })
            .where('id= :id', { id: id })
            .execute();
    }

    async find(id: string): Promise<Class> {
        let entity = await this.classRepository.findOne({
            where: { id: id },
            relations: {
                students: true,
                teacher: true
            }
        });
        if (!entity) return null;
        return ClassMapper.fromEntity(entity);
    }

    async findByClassCode(classCode: string): Promise<Class> {
        const entity = await this.classRepository.findOne({
            where: { classCode: classCode },
            relations: {
                students: true,
                teacher: true
            }
        });
        if (!entity) return null;
        return ClassMapper.fromEntity(entity);
    }

    async findAll(): Promise<Class[]> {
        let all = await this.classRepository.find({
            relations: {
                students: true,
                teacher: true
            }
        })
        return all.map(it => ClassMapper.fromEntity(it));
    }

    async findByTeacherId(teacherId: string): Promise<Class[]> {
        const myClasses = await this.classRepository.find({
            where: {
                teacher: {
                    id: teacherId
                }
            },
            relations: {
                students: true,
                teacher: true
            }
        });
        return myClasses.map(it => ClassMapper.fromEntity(it));
    }

    async findByTeacherIdAndClassId(teacherId: string, classId: string): Promise<Class> {
        const entity = await this.classRepository.findOne({
            where: {
                teacher: {
                    id: teacherId
                },
                id: classId
            },
            relations: {
                students: true,
                teacher: true
            }
        });
        if (!entity) return null;
        return ClassMapper.fromEntity(entity)
    }

    async update(entity: ClassEntity) {
        await this.classRepository.save(entity);
    }

}
