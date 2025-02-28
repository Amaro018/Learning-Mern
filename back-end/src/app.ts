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
    origin: "https://archi-raphael-profile.vercel.app/", // Ensure this matches your frontend's deployed domain
    credentials: true, // Required for sessions
  })
);

app.use(
  session({
    secret: validateEnv.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // Must be true for HTTPS
      httpOnly: true, // Prevents client-side access to cookies
      sameSite: "none", // Allows cross-origin cookies (important for Vercel + Render)
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    },
    rolling: true,
    store: MongoStore.create({
      mongoUrl: validateEnv.MONGO_CONNECTION_STRING,
    }),
  })
);

app.use(morgan("dev"));

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

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
