import {isArray, isString} from "@tsed/core";
import {OnDeserialize, OnSerialize} from "@tsed/json-mapper";
import {array, Default, Description, For, Integer, Min, oneOf, SpecTypes, string} from "@tsed/schema";
import {SortOrder} from "mongoose";

export class Pageable {
  @Integer()
  @Min(1)
  @Default(1)
  @Description("Page number.")
  page: number = 1;

  @Integer()
  @Min(1)
  @Default(20)
  @Description("Number of objects per page.")
  size: number = 20;

  @For(SpecTypes.JSON, oneOf(string(), array().items(string())))
  @For(SpecTypes.OPENAPI, array().items(string()))
  @For(SpecTypes.SWAGGER, array().items(string()))
  @OnDeserialize((value: string | string[]) => (isString(value) ? value.split(",") : value))
  @OnSerialize((value: string[]) => (isArray(value) ? value.join(",") : value))
  @Description(
    "Sorting criteria. This accepts format [prop1],[prop2],-[prop3],... where `-` indicates sort by descending otherwise ascending."
  )
  sort: string[];

  constructor({page, size, sort}: Partial<Pageable>) {
    page && (this.page = page);
    size && (this.size = size);
    sort && (this.sort = sort);
  }

  get offset(): number {
    return Math.max(0, this.page - 1) * this.limit;
  }

  get limit(): number {
    return this.size;
  }

  get sortObj() {
    const obj: {[k: string]: SortOrder} = {};

    if (!this.sort) {
      return {};
    }

    return this.sort.reduce((prev, curr) => {
      let direction: SortOrder = -1;
      if (curr.indexOf("-") === 0) {
        curr = curr.slice(1);
        direction = -1;
      }
      prev[curr] = direction;
      return prev;
    }, obj);
  }
}
