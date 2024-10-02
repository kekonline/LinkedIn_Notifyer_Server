import { Schema, model, Document, Types } from 'mongoose';

// Define the interface for the User model
interface SeenJobListing {
    jobListing: Types.ObjectId; // Reference to JobListing
    seen: boolean;
    starred: boolean;
}

interface User extends Document {
    _id: Types.ObjectId;
    email?: string; // Optional due to sparse
    password?: string;
    searchTerms: Types.ObjectId[]; // Array of references to SearchTerm
    seenJobListings: SeenJobListing[];
    getNotifications: boolean;
    token: {
        value: string;
        expiry: Date; // Fixed typo: "expircy" to "expiry"
    };
    isActive: boolean;
    createdAt?: Date; // Optional, included with timestamps
    updatedAt?: Date; // Optional, included with timestamps
}

// Create the user schema
const userSchema = new Schema<User>(
    {
        email: {
            type: String,
            unique: true,
            sparse: true // Allows multiple documents to have null values
        },
        password: {
            type: String,
        },
        searchTerms: [{
            type: Schema.Types.ObjectId,
            ref: "SearchTerm"
        }],
        seenJobListings: [{
            jobListing: {
                type: Schema.Types.ObjectId,
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
            expiry: Date
        },
        isActive: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

const UserModel = model<User>('User', userSchema);
export default UserModel;
