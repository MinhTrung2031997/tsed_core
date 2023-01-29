import { Model, MongooseDocument, ObjectID, PreHook } from "@tsed/mongoose";
import { Default, Email, Format, Property, Required } from "@tsed/schema";

@Model({
  name: "auth_users",
  schemaOptions: {
    toJSON: {
      virtuals: true
    },
    toObject: { virtuals: true }
  }
})
export class User {
  @ObjectID("id")
  _id: string;

  @Property()
  @Required()
  firstName: string;

  @Property()
  @Required()
  lastName: string;

  @Property()
  @Required()
  fullName: string;

  @Email()
  email: string;

  @Format("date-time")
  @Default(Date.now())
  createdAt: number = Date.now();

  @Format("date-time")
  @Default(Date.now())
  updatedAt: number = Date.now();

  @PreHook("save")
  @PreHook("updateOne")
  @PreHook("findOneAndUpdate")
  static preSave(item: MongooseDocument<User>, next: any) {
    if (!item.isNew) {
      item.updatedAt = Date.now();
    }
    item.fullName = item.firstName + " " + item.lastName;
    next();
  }
}
