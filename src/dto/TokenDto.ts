import { Default, Property, Required } from "@tsed/schema";

export class CreateTokenDto {
  @Property()
  @Required()
  userId: string;

  @Property()
  token: string;

  @Property()
  userAgent: string;

  @Property()
  ipAddress: string;

  @Property()
  @Default(false)
  revoked: boolean;
}
