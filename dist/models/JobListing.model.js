"use strict";
const { Schema, model } = require("mongoose");
const jobListingSchema = new Schema({
    title: {
        type: String,
    },
    company: {
        type: String,
    },
    description: {
        type: String,
    },
    jobURL: {
        type: String,
        required: true,
        unique: true
    },
    applyURL: {
        type: String,
    },
    searchTerms: [{
            type: Schema.Types.ObjectId,
            ref: "SearchTerm"
        }],
    scrapeRetries: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});
const JobListing = model("JobListing", jobListingSchema);
module.exports = JobListing;
