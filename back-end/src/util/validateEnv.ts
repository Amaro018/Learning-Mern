import "dotenv/config" 
import { cleanEnv } from "envalid";
import { port, str, url } from "envalid/dist/validators";

export default cleanEnv(process.env, {
    MONGO_CONNECTION_STRING: url(),
    PORT: port(),
    SESSION_SECRET: str()
});