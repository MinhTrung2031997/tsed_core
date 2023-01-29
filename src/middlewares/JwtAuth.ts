import { Configuration, Context, Inject, Middleware, MiddlewareMethods, Req } from "@tsed/common";
import { Forbidden, Unauthorized } from "@tsed/exceptions";
import ms from "ms";
import { verify } from "shr-jwt";
import { AuthOptions } from "../interfaces/Auth";

function seconds(date: Date | string | number): number {
  if (date instanceof Date) {
    return Math.floor(date.getTime() / 1000);
  }
  const ts = Math.floor(Date.now() / 1000);
  if (typeof date === "string") {
    const mss = ms(date);
    if (typeof mss === "undefined") {
      throw new Error("Date string is invalid.");
    }
    return ts + Math.floor(mss / 1000);
  }
  return date;
}

function isExpired(date: string | number | Date) {
  return seconds(date) < Math.floor(Date.now() / 1000);
}

@Middleware()
export default class JwtAuth implements MiddlewareMethods {
  @Inject(Configuration)
  config: Configuration;

  public async use(@Req() request: Req, @Context() ctx: Context) {
    // retrieve options given to the @UseAuth decorator
    const options: AuthOptions = ctx.endpoint.get(JwtAuth) || {};
    const bearer = request.headers.authorization;

    if (!bearer || !/^[Bb]earer\s\S+/.test(bearer) || bearer.split(" ").length !== 2) {
      throw new Unauthorized("Unauthorized");
    }

    const token = bearer.split(" ")[1];
    if (!token) {
      throw new Unauthorized("No token provided.");
    }

    const { verified, obj } = await verify(this.config.get("jwt").publicKey, token);
    if (!verified) {
      throw new Unauthorized("Token is invalid.");
    }

    if (typeof obj.payload === "string") {
      return;
    }

    if (obj.payload.expirationTime && isExpired(obj.payload.expirationTime)) {
      throw new Unauthorized("Token has expired.");
    }

    // roles checking
    if (options.roles?.length) {
      if (!(obj.payload.roles || []).some((r: string) => options.roles?.includes(r))) {
        throw new Forbidden("Forbidden");
      }
    }

    // TODO is there a better way to do?
    if (!ctx.has("auth")) {
      ctx.set("auth", { payload: obj.payload });
    }
  }
}
