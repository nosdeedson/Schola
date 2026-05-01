import { PersonEntity } from "@/infrastructure/entities/@shared/person.entity";
import { AcademicSemesterEntity } from "@/infrastructure/entities/academic-semester/academic.semester.entity";
import { ClassEntity } from "@/infrastructure/entities/class/class.entity";
import { CommentEntity } from "@/infrastructure/entities/comment/comment.entity";
import { ParentStudentEntity } from "@/infrastructure/entities/parent-student/parent.student.entity";
import { ParentEntity } from "@/infrastructure/entities/parent/parent.entity";
import { QuarterEntity } from "@/infrastructure/entities/quarter/quarter.entity";
import { RatingEntity } from "@/infrastructure/entities/rating/rating.entity";
import { StudentEntity } from "@/infrastructure/entities/student/student.entity";
import { UserEntity } from "@/infrastructure/entities/user/user.entity";
import { WorkerEntity } from "@/infrastructure/entities/worker/worker.entity";
import { DataSource } from "typeorm";

export class AppDataSource {

    static getAppDataSource(): DataSource {
        return new DataSource({
            type: "postgres",
            host: "localhost",
            port: 5432,
            username: "postgres",
            password: "root",
            database: "test_schola",
            entities: [
                WorkerEntity,
                PersonEntity,
                StudentEntity,
                ParentEntity,
                ClassEntity,
                AcademicSemesterEntity,
                CommentEntity,
                RatingEntity,
                UserEntity,
                ParentStudentEntity,
                QuarterEntity,
            ],
            synchronize: true,
            logging: false,
            // driver: 'pg'
        });
    }

}
