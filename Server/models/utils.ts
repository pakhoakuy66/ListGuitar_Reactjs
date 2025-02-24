import { Schema, model, Document } from "mongoose";

// Định nghĩa schema cho việc theo dõi ID
interface IDTracker extends Document {
    lastId: number;
}

const IDTrackerSchema = new Schema<IDTracker>({
    lastId: { type: Number, required: true, default: 0 }, // ID ban đầu là 0
});

const IDTrackerModel = model<IDTracker>("IDTracker", IDTrackerSchema, "IDTracker");

export default IDTrackerModel;
