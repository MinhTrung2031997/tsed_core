import { UseAuth } from "@tsed/common";
import { useDecorators } from "@tsed/core";
import { Forbidden, Unauthorized } from "@tsed/exceptions";
import { Returns, Security } from "@tsed/schema";
import { AuthOptions } from "../interfaces/Auth";
import JwtAuth from "../middlewares/JwtAuth";

export function Auth(options: AuthOptions = {}) {
  return useDecorators(
    UseAuth(JwtAuth, options),
    Security("bearerAuth"),
    Returns(401, Unauthorized).Description("Unauthorized"),
    Returns(403, Forbidden).Description("Forbidden")
  );
}
