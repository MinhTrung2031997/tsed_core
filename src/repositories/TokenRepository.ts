import { Inject } from "@tsed/di";
import { MongooseModel } from "@tsed/mongoose";
import { Token } from "../models/Token";
import { Repository } from "./Repository";

export class TokenRepository extends Repository<Token> {
  @Inject(Token)
  protected Model: MongooseModel<Token>;
}
