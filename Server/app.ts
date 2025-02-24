import express, { Application } from "express";
import mongoose from "mongoose"; // Import mongoose để kết nối MongoDB

const app: Application = express();

// Middleware
app.use(express.json());

// Kết nối MongoDB
const URI = "mongodb://127.0.0.1:27017/Guitars"; // Thay "your_database_name" bằng tên database của bạn

mongoose
    .connect(URI)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
    });

// Routes (ví dụ: bạn có thể thêm route của mình ở đây)

export default app;
