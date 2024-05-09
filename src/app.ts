import "dotenv/config";
import http from "http";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import express, { Request, Response, NextFunction } from "express";
import userRoutes from "./user/user.routes";

const app = express();
app.use(bodyParser.json());

const server = http.createServer(app);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  next();
});

app.use("/user", userRoutes);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL!);
    console.log("App successfully connected to database");
  } catch (err) {
    console.error("Error connecting to database:", err);
  }
};

connectDB();

server.listen(process.env.PORT, () => {
  console.log(`App listening at port ${process.env.PORT}...`);
});
