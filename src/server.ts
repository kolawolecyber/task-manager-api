import dotenv from "dotenv";
dotenv.config();

import http from "http";
import app from "./app";
import mongoose from "mongoose";

import { initSocket } from "./config/socket";



const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);

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