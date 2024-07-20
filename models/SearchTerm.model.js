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
            enum: ['Remote', 'Hybrid', 'On-site'],
            required: true
        },
        users: [{
            type: Schema.Types.ObjectId,
            ref: "User"
        }],
        jobListings: [{
            type: Schema.Types.ObjectId,
            ref: "JobListing"
        }]
    }
);

const SearchTerm = model("SearchTerm", searchTermSchema);
module.exports = SearchTerm;
