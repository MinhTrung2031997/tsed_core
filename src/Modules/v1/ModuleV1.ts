import { Module } from "@tsed/di";
import * as v1Controllers from "./index";

@Module({
  mount: {
    "/rest/v1": [...Object.values(v1Controllers)]
  }
})
export class ModuleV1 {}
