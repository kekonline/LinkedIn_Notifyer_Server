const { Schema, model } = require("mongoose");

const userSchema = new Schema(
    {
        email: {
            type: String,
            unique: true,
            sparse: true // Allows multiple documents to have null values
        },
        password: {
            type: String
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
            }
        }]
    }
);

const User = model("User", userSchema);
module.exports = User;
