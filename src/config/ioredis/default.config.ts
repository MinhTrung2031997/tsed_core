export default {
  name: "default",
  // add redis configuration
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379"),
  username: process.env.REDIS_USER,
  password: process.env.REDIS_PASSWORD
};
