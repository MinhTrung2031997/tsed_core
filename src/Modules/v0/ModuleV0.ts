import { Module } from "@tsed/di";
import * as v0Controllers from "./index";

require("dotenv").config();
export const basePathV0 = `${process.env.BASE_PATH}/V0`;

@Module({
  mount: {
    [basePathV0]: [...Object.values(v0Controllers)]
  }
})
export class ModuleV0 {}
