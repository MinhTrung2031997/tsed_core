import { readFileSync } from "fs";
import agendaConfig from "./agenda/index";
import { envs } from "./envs/index";
import ioredisConfig from "./ioredis/index";
import loggerConfig from "./logger/index";
import mongooseConfig from "./mongoose/index";

const pkg = JSON.parse(readFileSync("./package.json", { encoding: "utf8" }));

export const config: Partial<TsED.Configuration> = {
  version: pkg.version,
  envs,
  logger: loggerConfig,
  mongoose: mongooseConfig,
  ioredis: ioredisConfig,
  agenda: agendaConfig
  // additional shared configuration
};
