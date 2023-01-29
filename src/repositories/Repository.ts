import { Service } from "@tsed/di";
import { MongooseDocumentMethods, MongooseModel } from "@tsed/mongoose";
import { Document, InsertManyOptions, QueryOptions, SaveOptions, isValidObjectId } from "mongoose";
import { Pageable } from "../models/Pageable";
import { Pagination } from "../models/Pagination";

@Service()
export abstract class Repository<T> {
  protected abstract Model: MongooseModel<T>;

  /**
   * Check whether something has already existed in the database.
   * @param options _id or a filter query
   * @returns boolean
   */
  exists(options?: string | object) {
    return this.Model.exists(typeof options === "string" ? { _id: options } : options || {});
  }

  /**
   * Find a single record in the database either by id or a query.
   * @param options _id or a filter query
   * @returns Promise<T | null> The object or null if not found
   */
  find(options?: string | object, projection?: any): Promise<T | null> {
    if (typeof options === "string") {
      return this.Model.findById(options, projection).exec();
    }
    return this.Model.findOne(options || {}, projection).exec();
  }

  /**
   * Find multiple records in the database by a query.
   * @param filter A filter query
   * @returns Promise<T[] | null> An array of objects or null if not found
   */
  findMany(filter?: object): Promise<T[] | null> {
    return this.Model.find(filter || {}).exec();
  }

  /**
   * Save the record into database.
   * @param model The object
   * @returns Promise<T> The object itself with _id (and other properties) populated
   */
  async save(model: T, options?: SaveOptions): Promise<T> {
    const m = new this.Model(model);
    await m.save(options);
    return m;
  }

  async saveMany(models: T[], options?: InsertManyOptions): Promise<T[]> {
    const mm = models.map((m) => new this.Model(m));
    await this.Model.insertMany(mm, options || {});
    return mm;
  }

  /**
   * Delete a single record from the database.
   * @param filter _id or a filter query
   * @returns Promise<any> a result indicating whether the deletion went successfully
   */
  delete(filter?: string | object, options?: QueryOptions): Promise<any> {
    if (typeof filter === "string" || isValidObjectId(filter)) {
      filter = { _id: filter };
    }
    return this.Model.deleteOne(filter, options).exec();
  }

  /**
   * Delete multiple records from the database.
   * @param filter A filter query
   * @returns Promise<any> a result indicating the number of objects were deleted
   */
  deleteMany(filter?: object, options?: QueryOptions): Promise<any> {
    return this.Model.deleteMany(filter, options).exec();
  }

  /**
   * Load a list of records by page.
   * @param pageable Pageable object to determine page size, page number, etc.
   * @param filter A filter query
   * @returns Promise<Pagination<T> | null> A list of objects
   */
  paginate(pageable: Pageable, filter?: object): Promise<Pagination<T> | null> {
    return new Promise((resolve, reject) => {
      this.Model.find(filter || {})
        .skip(pageable.offset)
        .limit(pageable.limit)
        .sort(pageable.sortObj as any)
        .populate("nftCount")
        .exec((err, data) => {
          if (err) return reject(err);
          this.Model.count(filter || {}).exec((err, total) => {
            if (err) return reject(err);
            return resolve(new Pagination<T>({ data, total, pageable }));
          });
        });
    });
  }

  /**
   * Return the mongoose model
   */
  aggregate(pipeline: any[]) {
    return this.Model.aggregate(pipeline);
  }

  // startSession(options?: ClientSessionOptions) {
  //   return this.Model.db.startSession(options);
  // }

  model(): MongooseModel<T> {
    return this.Model;
  }

  create(): T & Document & MongooseDocumentMethods<T> {
    return new this.Model();
  }

  // update(
  //   filter?: any,
  //   update?:
  //     | UpdateQuery<MongooseMergedDocument<Document<any, any, any> & T & MongooseDocumentMethods<T>>>
  //     | UpdateWithAggregationPipeline,
  //   options?: QueryOptions | null
  // ) {
  //   return this.Model.updateOne(filter, update, options);
  // }
}
