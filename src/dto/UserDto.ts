import { Email, Property, Required } from "@tsed/schema";

export class CreateUserDto {
  @Property()
  @Required()
  firstName: string;

  @Property()
  @Required()
  lastName: string;

  @Email()
  email: string;
}
