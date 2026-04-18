import { User } from "@/domain/user/user";
import { UserRepositoryInterface } from "@/domain/user/user.repository.interface";
import { UserEntity } from "@/infrastructure/entities/user/user.entity";
import { PeronRepositoryInterface } from "../../../../domain/@shared/repository/person.repository.interface";
import { InputCreateUserDto } from "./input.create.user.dto";
import { AccessType } from "@/domain/user/access.type";
import { PersonEntity } from "@/infrastructure/entities/@shared/person.entity";
import { WorkerEntity } from "@/infrastructure/entities/worker/worker.entity";
import { Worker } from "@/domain/worker/worker";
import { Parent } from "@/domain/parent/parent";
import { ParentEntity } from "@/infrastructure/entities/parent/parent.entity";
import { StudentEntity } from "@/infrastructure/entities/student/student.entity";
import { Student } from "@/domain/student/student";
import { TrataErros } from "@/infrastructure/utils/trata-erros/trata-erros";
import { RepositoryInterface } from "@/domain/@shared/repository/repository.interface";
import { PasswordHasher } from "@/helpers/password-encryption/password-hasher";

export class CreateUserService {

    private userRepository: UserRepositoryInterface;
    public personRepository: RepositoryInterface<any>;

    constructor(
        userRepository: UserRepositoryInterface,
        personRepository: RepositoryInterface<any>,
    ) {
        this.userRepository = userRepository;
        this.personRepository = personRepository
    }

    async execute(dto: InputCreateUserDto) {
        try {
            let personEntity = await this.personRepository.find(dto.personId);
            let person = this.typePerson(dto.accesstype, personEntity);
            let hashedPassword = PasswordHasher.encryptPassword(dto.password);
            let user = new User(person, dto.email, dto.nickname, hashedPassword, dto.accesstype);
            let entity = UserEntity.toUserEntity(user);
            await this.userRepository.create(entity);
        } catch (error) {
            throw error;
        }
    }

    public typePerson(accessType: AccessType, person: PersonEntity): any {
        if (AccessType.ADMIN == accessType || AccessType.TEACHER == accessType) {
            let workerEntity = person as WorkerEntity;
            return Worker.toDomain(workerEntity, accessType);
        } else if (AccessType.PARENT == accessType) {
            let parentEntity = person as ParentEntity;
            return Parent.toDomain(parentEntity);
        } else {
            let entity = person as StudentEntity;
            return Student.toDomain(entity);
        }
    }


}



