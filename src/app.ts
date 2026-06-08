import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(express.static("public"));
app.use(cookieParser());

import { authRouter } from "./routes/auth.routes.js";
import { userRouter } from "./routes/user.route.js";
import globalErrorHandler from "./middlewares/error.middleware.js";

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use(globalErrorHandler);

export default app;
