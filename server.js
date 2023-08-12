console.log("OAHKCV");

import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
dotenv.config();
import "express-async-errors";

//database
import connectDB from "./db/connect.js";

//middlewares
import notFound from "./Middlewares/notFound.js";
import errorHandler from "./Middlewares/errorHandler.js";
import AuthenticateUser from "./Middlewares/Auth.js";
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";

//routes
import authroutes from "./routes/authroutes.js";
import jobroutes from "./routes/jobroutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev")); //use to get method , response, url of requests
}

const __dirname = dirname(fileURLToPath(import.meta.url));

//this will provide json data to us
app.use(express.json());

// app.get("/", (req, res) => {
//   res.send("OAHKCV, MY FIRST SERVER");
// });
app.use(express.static(path.resolve(__dirname, "./client/build")));

app.use("/api/v1/auth", authroutes);
app.use("/api/v1/job", AuthenticateUser, jobroutes);

app.get("*", function (request, response) {
  response.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
});

app.use(notFound);
app.use(errorHandler);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
      console.log("Database connected");
      console.log(""); //just to have little bit space between frontend & backend in console
    });
  } catch (error) {
    console.log(error);
  }
};

start();
