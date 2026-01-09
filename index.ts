import express, { Express } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import postsRouter from "./routes/postsRoutes";
import commentsRouter from "./routes/commentsRoutes";
import usersRouter from "./routes/usersRoutes";
import authRouter from "./routes/authRoutes";

const app = express();
dotenv.config({ path: ".env" });

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/mydatabase";

function init(): Promise<Express> {
    const promise = new Promise<Express>((resolve, reject) => {
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());

    app.use("/api/posts", postsRouter);
    app.use("/api/comments", commentsRouter);
    app.use("/api/users", usersRouter);
    app.use("/api/auth", authRouter);


    const mongoURL = MONGO_URI;
    if (!mongoURL) {
      console.error("MONGODB_URI is not defined in the environment variables.");
      reject(new Error("MONGODB_URI is not defined"));
    } else {
      mongoose
        .connect(mongoURL, {})
        .then(() => {
          resolve(app);
        });
    }

    const db = mongoose.connection;
    db.on("error", (error) => {
      console.error(error);
    });
    db.once("open", () => {
      console.log("Connected to MongoDB");
    });
  });

  return promise;
}

export default init;