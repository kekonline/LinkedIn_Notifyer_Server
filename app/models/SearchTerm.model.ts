import { Schema, model, models, Document, Types } from 'mongoose';

interface SearchTerm extends Document {
    _id: Types.ObjectId;
    term: string;
    location: string;
    jobType?: 'Remote' | 'Hybrid' | 'On-site' | '';
    users: Types.ObjectId[];
    jobListings: Types.ObjectId[];
    lastScraped?: Date;
    URL?: string;
}

const searchTermSchema = new Schema<SearchTerm>(
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
        },
        URL: {
            type: String
        }
    }
);

searchTermSchema.index({ term: 1, location: 1, jobType: 1 }, { unique: true });

const SearchTerm = models.SearchTerm || model<SearchTerm>('SearchTerm', searchTermSchema);
export default SearchTerm;
