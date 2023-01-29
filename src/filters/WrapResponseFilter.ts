import { ResponseFilter, ResponseFilterMethods } from "@tsed/common";

@ResponseFilter("application/json")
export class WrapResponseFilter implements ResponseFilterMethods {
  transform(data: any) {
    //TODO more contexts to the response
    return { success: true, data };
  }
}
