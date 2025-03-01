import express from "express";
// import NoteModel from "./models/notes";
import { Request, Response, NextFunction } from "express";
import notesRoutes from "./routes/notes";
import userRoutes from "./routes/users";
import morgan from "morgan";
import createHttpError, { isHttpError } from "http-errors";
import session from "express-session";
import validateEnv from "./util/validateEnv";
import MongoStore from "connect-mongo";
import projectsRoutes from "./routes/projects";
import cors from "cors";

const app = express();
app.use(
  cors({
    origin: validateEnv.CLIENT_URL,
    credentials: true,
  })
);

// app.use(
//   session({
//     secret: validateEnv.SESSION_SECRET, // Ensure this is set properly in your environment
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
//     },
//     store: MongoStore.create({
//       mongoUrl: validateEnv.MONGO_CONNECTION_STRING,
//     }), // Store the session in MongoDB
//   })
// );

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: validateEnv.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: validateEnv.NODE_ENV === "production", // Ensure HTTPS in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
    store: MongoStore.create({
      mongoUrl: validateEnv.MONGO_CONNECTION_STRING,
      ttl: 14 * 24 * 60 * 60, // 14 days
    }),
  })
);

app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/users", userRoutes);
app.use("/api/notes", notesRoutes);
app.use("/uploads", express.static("uploads")); // Serve images

app.use("/api/projects", projectsRoutes);

app.use((req, res, next) => {
  next(createHttpError(404, "END POINT NOT FOUND"));
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.log(error);
  let errorMessage = "Something went wrong";
  let statusCode = 500;
  if (isHttpError(error)) {
    statusCode = error.status;
    errorMessage = error.message;
  }
  // if (error instanceof Error) errorMessage = error.message;
  res.status(statusCode).json({ error: errorMessage });
});

export default app;
