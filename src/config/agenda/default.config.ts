import os from "os";

export default {
  enabled: true, // Enable Agenda jobs for this instance.
  // pass any options that you would normally pass to new Agenda(), e.g.
  db: {
    address:
      process.env.MONGO_URL ||
      `mongodb://${process.env.MONGO_HOST || "localhost"}:${process.env.MONGO_PORT || "27017"}/${process.env.MONGO_DATABASE || ""}`,
    // address: `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}`,
    collection: "agenda_jobs",
    options: {
      auth: {
        username: process.env.MONGO_USERNAME || "",
        password: process.env.MONGO_PASSWORD || ""
      },
      authSource: process.env.MONGO_AUTH_DB || process.env.MONGO_DATABASE || "admin"
    }
  },
  name: `shr-ms-agenda-${os.hostname}-${process.pid}`
  //revise the name with project equipvalent
};
