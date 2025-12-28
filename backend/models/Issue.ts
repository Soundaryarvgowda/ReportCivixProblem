import mongoose from 'mongoose';

const issueSchema = new mongoose.Schema({
    type: { type: String, required: true },
    description: { type: String, required: true },
    photo: { type: String, required: true }, // Base64 string for now, as per frontend logic
    location: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true }
    },
    address: { type: String },
    wardNumber: { type: String, required: true },
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    userContact: { type: String, required: true },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'resolved', 'escalated'],
        default: 'pending'
    },
    assignedCorporator: { type: String },
    createdAt: { type: Date, default: Date.now },
    acceptedAt: { type: Date },
    resolvedAt: { type: Date },
    workReport: { type: String },
    resolvedPhoto: { type: String },
    resolvedLocation: {
        latitude: { type: Number },
        longitude: { type: Number }
    }
});

export const Issue = mongoose.model('Issue', issueSchema);
