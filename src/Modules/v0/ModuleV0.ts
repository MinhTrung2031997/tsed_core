import { Module } from "@tsed/di";
import * as v0Controllers from "./index";

@Module({
  mount: {
    "/rest/v0": [...Object.values(v0Controllers)]
  }
})
export class ModuleV0 {}
