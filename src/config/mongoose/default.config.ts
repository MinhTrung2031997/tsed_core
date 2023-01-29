export default {
  id: "default",
  url: process.env.MONGO_URL || `mongodb://${process.env.MONGO_HOST || "localhost"}:${process.env.MONGO_PORT || "27017"}`,
  connectionOptions: {
    dbName: process.env.MONGO_DATABASE || "admin",
    authSource: process.env.MONGO_DATABASE || "admin",
    auth:
      process.env.MONGO_USERNAME && process.env.MONGO_PASSWORD
        ? {
            username: process.env.MONGO_USERNAME || "",
            password: process.env.MONGO_PASSWORD || ""
          }
        : undefined
  }
};
