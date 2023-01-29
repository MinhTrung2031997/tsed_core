import { Model, ObjectID, Unique } from "@tsed/mongoose";
import { Default, Name, Property, Required } from "@tsed/schema";

@Model({ name: "auth_tokens" })
export class Token {
  @Name("id")
  @ObjectID("id")
  _id: string;

  @Required()
  userId: string;

  @Unique()
  @Required()
  token: string;

  @Property()
  userAgent: string;

  @Property()
  ipAddress: string;

  @Property()
  @Default(false)
  revoked: boolean;
}
