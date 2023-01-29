import { Service } from "@tsed/di";

@Service()
export class UsersService {
  async getUsers() {
    return "Users V1";
  }
}
