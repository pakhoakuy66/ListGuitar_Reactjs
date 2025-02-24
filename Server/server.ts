import express, { Application } from "express";
import mongoose from "mongoose";
import cors from "cors";
import Guitar from "./models/guitarsModel"; // Import model Guitar
import { guitarRoute } from "./routes/guitarRoute";

const app: Application = express();
const PORT = 3000;
const URI = "mongodb://127.0.0.1:27017/Guitars"; // Đảm bảo kết nối với database 'Guitars'

// Kết nối MongoDB
mongoose
    .connect(URI)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
    });

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use("/guitar", guitarRoute);
app.use("/images", express.static("IMG"));

// API Route để lấy dữ liệu từ MongoDBs
app.get("/guitars", async (req, res) => {
    try {
        const guitars = await Guitar.find(); // Lấy tất cả dữ liệu từ MongoDB trong collection 'Guitars'
        res.json(guitars); // Trả về dữ liệu dưới dạng JSON
    } catch (error) {
        console.error("Error fetching guitars:", error);
        res.status(500).json({ error: "Failed to fetch guitars" });
    }
});

// Start server chỉ khi kết nối MongoDB thành công
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
