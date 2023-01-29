import { Service } from "@tsed/di";

@Service()
export class SettingsService {
  async getSettings() {
    return "Settings V1";
  }
}
