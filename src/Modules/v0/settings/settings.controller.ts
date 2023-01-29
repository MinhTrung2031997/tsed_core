import { Controller } from "@tsed/di";
import { Get } from "@tsed/schema";
import { SettingsService } from "./settings.service";

@Controller("/settings")
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}
  @Get("/")
  async getSettings(): Promise<string> {
    return this.settingsService.getSettings();
  }
}
