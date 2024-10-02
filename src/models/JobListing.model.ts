import { Schema, model, Document, Types } from 'mongoose';

interface JobListing extends Document {
    _id: Types.ObjectId;
    title: string;
    company: string;
    description: string;
    jobURL: string;
    applyURL?: string;
    searchTerms: Types.ObjectId[];
    scrapeRetries: number;
    createdAt: Date;
    updatedAt: Date;
}

const jobListingSchema = new Schema<JobListing>(
    {
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
    },
    {
        timestamps: true
    }
);

const JobListing = model<JobListing>('JobListing', jobListingSchema);
export default JobListing;
