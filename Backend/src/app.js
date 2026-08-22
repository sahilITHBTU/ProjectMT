import express from "express";
import cors from  "cors";
const app = express();
import cookieParser from "cookie-parser";

app.use(cookieParser());
app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true,limit:"16kb"}));
app.use(express.static("public"))
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(","),
    credentials: true,
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

//import routes
import healthCheckRouter from "./routes/healthCheck.routes.js";
import authRouter from "./routes/auth.routes.js"
import ProjectRouter from "./routes/project.routes.js"
app.use("/api/v1/healthcheck",healthCheckRouter)
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/projects", ProjectRouter);


export default app;