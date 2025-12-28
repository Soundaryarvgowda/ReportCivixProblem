import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    contact: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['citizen', 'corporator', 'president'], required: true },
    wardNumber: { type: String },
    houseNumber: { type: String },
    buildingName: { type: String },
    streetName: { type: String },
    city: { type: String },
    pincode: { type: String },
    createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.model('User', userSchema);
