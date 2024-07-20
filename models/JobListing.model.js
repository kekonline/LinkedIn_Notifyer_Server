const { Schema, model } = require("mongoose");

const jobListingSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        company: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        applyLink: {
            type: String,
            required: true
        },
        searchTerms: [{
            type: Schema.Types.ObjectId,
            ref: "SearchTerm"
        }]
    },
    {
        timestamps: true
    }
);

const JobListing = model("JobListing", jobListingSchema);
module.exports = JobListing;
