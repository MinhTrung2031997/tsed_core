import { Inject } from "@tsed/di";
import { MongooseModel } from "@tsed/mongoose";
import { User } from "../models/User";
import { Repository } from "./Repository";

export class UserRepository extends Repository<User> {
  @Inject(User)
  protected Model: MongooseModel<User>;
}
