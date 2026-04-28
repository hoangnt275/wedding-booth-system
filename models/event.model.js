const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
    {
        eventName: {
            type: String,
            required: true,
            trim: true,
        },
        eventCode: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        note: {
            type: String,
            default: "",
        },
        eventType: {
            type: String,
            required: true,
            enum: ["wedding", "general"],
            default: "wedding",
        },
        packageType: {
            type: String,
            required: true,
            enum: ["basic", "premium"],
            default: "basic",
        },
        date: {
            type: Date,
            required: true,
        },
        time: {
            type: String,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        contactName: {
            type: String,
            required: true,
            trim: true,
        },
        phone: {
            type: String,
            required: true,
            trim: true,
        },
        social: {
            type: String,
            trim: true,
        },
        groomName: {
            type: String,
            trim: true,
        },
        brideName: {
            type: String,
            trim: true,
        },
        status: {
            type: String,
            enum: ["upcoming", "completed", "cancelled"],
            default: "upcoming",
        },
        deleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const Event = mongoose.models.Event || mongoose.model("Event", eventSchema);

module.exports = Event;
