import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

import app from "./app.js";
import connectDB from "./db/index.js";

process.on("uncaughtException", (err) => {
  console.error("💥 CRITICAL STARTUP ERROR DETECTED:");
  console.error(err.stack);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("💥 UNHANDLED REJECTION AT:", promise, "REASON:", reason);
  process.exit(1);
});

connectDB()
  .then(() => {
    const port = process.env.PORT || 8000;
    app.listen(port, () => {
      console.log(`⚙️  Server is running at http://localhost:${port}`);
      console.log(
        `👤 Environment Name: ${process.env.name || "Not Specified"}`,
      );
    });
  })
  .catch((err) => {
    console.error("💥 MONGO DB connection failed !!! ", err);
    process.exit(1);
  });
