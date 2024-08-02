const { Schema, model } = require("mongoose");

const searchTermSchema = new Schema(
    {
        term: {
            type: String,
            required: true
        },
        location: {
            type: String,
            required: true
        },
        jobType: {
            type: String,
            enum: ['Remote', 'Hybrid', 'On-site', ''],
        },
        users: [{
            type: Schema.Types.ObjectId,
            ref: "User"
        }],
        jobListings: [{
            type: Schema.Types.ObjectId,
            ref: "JobListing"
        }],
        lastScraped: {
            type: Date
        }
    }
);

// Create a compound index to ensure unique combination of term, location, and jobType
searchTermSchema.index({ term: 1, location: 1, jobType: 1 }, { unique: true });

const SearchTerm = model("SearchTerm", searchTermSchema);
module.exports = SearchTerm;
