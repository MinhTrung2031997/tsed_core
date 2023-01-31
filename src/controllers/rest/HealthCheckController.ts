import {Controller, Get} from "@tsed/common";
import {Description, Returns, Summary, Tags} from "@tsed/schema";

@Controller("/healthcheck")
@Tags("Internal APIs")
export class HealthCheckController {
  @Get("")
  @Summary("Healthcheck endpoint")
  @Description(
    "A healthcheck endpoint. This does nothing except return a 200 response indicating that the service is running."
  )
  @Returns(200, String).Description("Just a text.")
  async test() {
    return "Hello, world";
  }
}
