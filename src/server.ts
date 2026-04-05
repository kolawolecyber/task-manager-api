import http from "http";
import app from "./app";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { initSocket } from "./config/socket";

dotenv.config();

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);

    const server = http.createServer(app);

    initSocket(server); // 👈 attach socket

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
}

start();