import jwt from "jsonwebtoken";
import validateEnv from "./validateEnv";

export function generateToken(userId: string) {
  const token = jwt.sign({ userId }, validateEnv.JWT_SECRET as string, {
    expiresIn: "1d",
  });
  return token;
}
