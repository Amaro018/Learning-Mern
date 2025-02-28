import "dotenv/config";
import { cleanEnv, str, port, url } from "envalid";
// import { port, str, url } from "envalid/dist/validators";

export default cleanEnv(process.env, {
  MONGO_CONNECTION_STRING: url(),
  PORT: port(),
  SESSION_SECRET: str(),
  CLOUD_NAME: str(),
  CLOUD_KEY: str(),
  CLOUD_SECRET: str(),
  CLOUD_URL: url(),
  CLIENT_URL: url(),
});
