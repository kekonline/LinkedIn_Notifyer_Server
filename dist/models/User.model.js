"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Create the user schema
const userSchema = new mongoose_1.Schema({
    email: {
        type: String,
        unique: true,
        sparse: true // Allows multiple documents to have null values
    },
    password: {
        type: String,
    },
    searchTerms: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "SearchTerm"
        }],
    seenJobListings: [{
            jobListing: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: "JobListing"
            },
            seen: {
                type: Boolean,
                default: false
            },
            starred: {
                type: Boolean,
                default: false
            }
        }],
    getNotifications: {
        type: Boolean,
        default: false
    },
    token: {
        value: String,
        expiry: Date // Fixed typo here as well
    },
    isActive: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});
// Create and export the User model
const UserModel = (0, mongoose_1.model)('User', userSchema);
exports.default = UserModel;
