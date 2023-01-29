import { Controller } from "@tsed/di";
import { Get } from "@tsed/schema";
import { UsersService } from "./users.service";

@Controller("/users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get("/")
  async getUsers(): Promise<string> {
    return this.usersService.getUsers();
  }
}
