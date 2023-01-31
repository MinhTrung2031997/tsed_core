import { BodyParams, Get, Post, QueryParams } from "@tsed/common";
import { Controller } from "@tsed/di";
import { Description, Returns, Summary, Tags } from "@tsed/schema";
import { Auth } from "../../../decorators/Auth";
import { CreateTokenDto } from "../../../dto/TokenDto";
import { Pageable } from "../../../models/Pageable";
import { Pagination } from "../../../models/Pagination";
import { Token } from "../../../models/Token";
import { TokensService } from "./token.service";

export class TokenPageable extends Pageable {
  @Description("Search keywords.")
  s: string;
}

@Controller("/tokens")
@Tags("Token APIs")
export class TokenController {
  constructor(private readonly tokenService: TokensService) {}
  @Get("/")
  @Summary("Get a paginated list of tokens")
  @Description("Get a paginated list of tokens. Page number and/or page size can be specified to get the list from specific page or range.")
  @Returns(206, Pagination).Of(Token)
  @Returns(200, Pagination).Of(Token)
  @Auth({ roles: ["user, admin"] })
  async getTokens(
    @QueryParams()
    options: TokenPageable
  ) {
    return this.tokenService.getTokens(options);
  }

  @Post("/")
  @Summary("Create a token")
  @Returns(200, Token).Description("Return a token when created successfully")
  async createToken(@BodyParams() body: CreateTokenDto): Promise<Token> {
    return this.tokenService.createToken(body);
  }
}
