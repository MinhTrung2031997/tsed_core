import { Inject, Injectable, ProviderScope, ProviderType } from "@tsed/di";
import _ from "lodash";
import { CreateTokenDto } from "../../../dto/TokenDto";
import { Pagination } from "../../../models/Pagination";
import { Token } from "../../../models/Token";
import { TokenRepository } from "../../../repositories/TokenRepository";
import { TokenPageable } from "./token.controller";

@Injectable({
  type: ProviderType.SERVICE,
  scope: ProviderScope.SINGLETON
})
export class TokensService {
  constructor(
    @Inject(TokenRepository)
    private readonly tokenRepository: TokenRepository
  ) {}

  async getTokens(options: TokenPageable) {
    const filter: any = {};
    const escapedS = _.escapeRegExp(options.s);
    const sRegExp = new RegExp(`.*${escapedS}.*`, "i");
    if (options.s) {
      filter["$or"] = [
        {
          userId: sRegExp
        },
        {
          token: sRegExp
        }
      ];
    }
    return new Promise((resolve, reject) => {
      this.tokenRepository
        .model()
        .find(filter)
        .skip(options.offset)
        .limit(options.limit)
        .sort(options.sortObj)
        .exec(async (err, data) => {
          if (err) return reject(err);
          this.tokenRepository
            .model()
            .count()
            .exec((err, total) => {
              if (err) return reject(err);
              return resolve(new Pagination<Token>({ data, total, pageable: options }));
            });
        });
    });
  }

  async createToken(body: CreateTokenDto): Promise<Token> {
    return this.tokenRepository.model().create(body);
  }
}
