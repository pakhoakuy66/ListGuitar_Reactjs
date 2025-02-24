import { Schema, model, Document } from "mongoose";
import IDTrackerModel from "./utils"; // Import model IDTracker

interface Guitar extends Document {
    id: string;
    name: string;
    image: string;
    price: number;
    brand: string;
}

const GuitarSchema = new Schema<Guitar>(
    {
        id: { type: String, immutable: true, unique: true, index: true },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        image: { type: String, default: "" },
        price: { type: Number, required: true, min: 0 },
        brand: { type: String, required: true, maxlength: 30, trim: true },
    }
);

// Middleware để tự động tạo ID tăng dần
GuitarSchema.pre("save", async function (next) {
    const guitar = this;

    if (!guitar.id) {
        try {
            // Lấy ID cuối cùng từ collection IDTracker
            const lastIDDoc = await IDTrackerModel.findOne()
                .sort({ lastId: -1 })
                .limit(1);

            if (lastIDDoc) {
                // Lấy ID mới
                const newID = `GUI${(lastIDDoc.lastId + 1)
                    .toString()
                    .padStart(3, "0")}`;
                guitar.id = newID;

                // Cập nhật ID cuối cùng
                await IDTrackerModel.updateOne(
                    {},
                    { lastId: lastIDDoc.lastId + 1 }
                );
            } else {
                // Nếu không có giá trị trước đó, bắt đầu từ GUI001
                guitar.id = "GUI001";
                await IDTrackerModel.create({ lastId: 1 });
            }
        } catch (error) {
            return next(error as any);
        }
    }

    next();
});

// Tạo model từ schema
const GuitarModel = model<Guitar>("Guitar", GuitarSchema, "Guitars");

export default GuitarModel;
