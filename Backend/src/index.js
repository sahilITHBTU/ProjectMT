import app from "./app.js";
import connectDB from "./db/index.js"
import dotenv from "dotenv";
dotenv.config({
    path: "./.env"
})

connectDB()
  .then(()=>{
    app.listen(process.env.PORT, () => {
      console.log(`Server is listing at https://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error", err);
    process.exit(1);
  });

console.log(`${process.env.name}`);