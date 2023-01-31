import { NotFound } from "@tsed/exceptions";

export class UserNotFound extends NotFound {
  constructor() {
    super("User not found.");
    this.name = "ERR_USER_NOT_FOUND";
  }
}
