import { Inject, Injectable, ProviderScope, ProviderType } from "@tsed/di";
import _ from "lodash";
import { CreateUserDto } from "../../../dto/UserDto";
import { Pagination } from "../../../models/Pagination";
import { User } from "../../../models/User";
import { UserRepository } from "../../../repositories/UserRepository";
import { UserPageable } from "./users.controller";

Injectable({
  type: ProviderType.SERVICE,
  scope: ProviderScope.SINGLETON
});
export class UsersService {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: UserRepository
  ) {}

  async getUsers(options: UserPageable) {
    const filter: any = {};
    if (options.s) {
      const escapedS = _.escapeRegExp(options.s);
      const sRegExp = new RegExp(`.*${escapedS}.*`, "i");
      filter["$and"].push({
        $or: [
          {
            firstName: sRegExp
          },
          {
            lastName: sRegExp
          },
          {
            fullName: sRegExp
          },
          {
            email: sRegExp
          }
        ]
      });
    }
    return new Promise((resolve, reject) => {
      this.userRepository
        .model()
        .find(filter)
        .skip(options.offset)
        .limit(options.limit)
        .sort(options.sortObj)
        .lean()
        .exec(async (err, data) => {
          if (err) return reject(err);
          this.userRepository
            .model()
            .count(filter)
            .exec((err, total) => {
              if (err) return reject(err);
              return resolve(new Pagination<User>({ data, total, pageable: options }));
            });
        });
    });
  }

  async createUser(body: CreateUserDto): Promise<User> {
    return this.userRepository.model().create(body);
  }
}
