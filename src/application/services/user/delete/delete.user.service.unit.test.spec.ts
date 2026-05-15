import { AccessType } from "@/domain/user/access.type";
import { mockUser } from "../../../../../tests/mocks/domain/user.mock";
import { MockRepositoriesForUnitTest } from "../../../../../tests/mocks/mock-repositories/mockRepositories"
import { DeleteUserService } from '../delete/delete.user.service';


describe('DeleteUserService unit test', () =>{

    it('should delete an user', async () =>{
        let user = mockUser(AccessType.TEACHER);
        let userRepository = MockRepositoriesForUnitTest.mockRepositories();
        const service = new DeleteUserService(userRepository);
        expect(await service.execute(user.getId())).toBe(void 0);
        expect(userRepository.delete).toHaveBeenCalledTimes(1);
        expect(userRepository.delete).toHaveBeenCalledWith(user.getId())
    })

})