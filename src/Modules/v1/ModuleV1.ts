import { Module } from "@tsed/di";
import * as v1Controllers from "./index";

require("dotenv").config();
export const basePathV1 = `${process.env.BASE_PATH}/V1`;
@Module({
  mount: {
    [basePathV1]: [...Object.values(v1Controllers)]
  }
})
export class ModuleV1 {}
