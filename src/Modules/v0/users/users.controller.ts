import { BodyParams, Get, Post, QueryParams } from "@tsed/common";
import { Controller } from "@tsed/di";
import { Description, Returns, Summary, Tags } from "@tsed/schema";
import { CreateUserDto } from "../../../dto/UserDto";
import { Pageable } from "../../../models/Pageable";
import { Pagination } from "../../../models/Pagination";
import { User } from "../../../models/User";
import { UsersService } from "./users.service";

export class UserPageable extends Pageable {
  @Description("Search keywords.")
  s: string;
}

@Controller("/users")
@Tags("User APIs")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("/")
  @Summary("Get a paginated list of users")
  @Description("Get a paginated list of users. Page number and/or page size can be specified to get the list from specific page or range.")
  @Returns(206, Pagination).Of(User)
  @Returns(200, Pagination).Of(User)
  async getUsers(
    @QueryParams()
    options: UserPageable
  ) {
    return this.usersService.getUsers(options);
  }

  @Post("/")
  @Summary("Create a user")
  @Returns(200, User).Description("Return a user when created successfully")
  async createUser(@BodyParams() body: CreateUserDto): Promise<User> {
    return this.usersService.createUser(body);
  }
}
