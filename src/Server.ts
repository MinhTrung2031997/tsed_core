import "@tsed/ajv";
import { PlatformApplication } from "@tsed/common";
import { Env } from "@tsed/core";
import { Configuration, Inject } from "@tsed/di";
import "@tsed/ioredis";
import "@tsed/mongoose";
import "@tsed/platform-express"; // /!\ keep this import
import "@tsed/swagger";
import bodyParser from "body-parser";
import compress from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import methodOverride from "method-override";
import { join } from "path";
import { ModuleV0 } from "./Modules/v0/ModuleV0";
import { ModuleV1 } from "./Modules/v1/ModuleV1";
import { config } from "./config/index";
import * as pages from "./controllers/pages/index";
import * as rest from "./controllers/rest/index";
import { WrapResponseFilter } from "./filters/WrapResponseFilter";
import { removeTrailingSlash } from "./utils";

require("dotenv").config();

export const rootDir = __dirname;
export const isProduction = process.env.NODE_ENV === Env.PROD;
export const basePath = removeTrailingSlash(process.env.BASE_PATH || "/");

@Configuration({
  ...config,
  acceptMimes: ["application/json"],
  httpPort: process.env.PORT || 8083,
  httpsPort: false, // CHANGE
  componentsScan: false,
  mount: {
    "/rest": [...Object.values(rest)],
    "/": [...Object.values(pages)]
  },
  imports: [ModuleV0, ModuleV1],
  swagger: [
    {
      path: removeTrailingSlash(`${basePath}${process.env.SWAGGER_BASE_PATH || ""}/docs`),
      specVersion: "3.0.3",
      spec: {
        components: {
          securitySchemes: {
            bearerAuth: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT"
            }
          }
        }
      }
    }
  ],
  views: {
    root: join(process.cwd(), "../views"),
    extensions: {
      ejs: "ejs"
    }
  },
  exclude: ["**/*.spec.ts"],
  ajv: {
    errorFormatter: (error) => `${error.modelName}${error.schemaPath} ${error.message}`
  },
  responseFilters: [WrapResponseFilter]
})
export class Server {
  @Inject()
  protected app: PlatformApplication;

  @Configuration()
  protected settings: Configuration;

  $beforeRoutesInit(): void {
    this.app
      .use(cors())
      .use(cookieParser())
      .use(compress({}))
      .use(methodOverride())
      .use(bodyParser.json())
      .use(
        bodyParser.urlencoded({
          extended: true
        })
      );
  }
}
