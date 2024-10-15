// src/schemas/search-term.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SearchTermDocument = SearchTerm & Document;

@Schema({ timestamps: true }) // You can use timestamps for automatic createdAt and updatedAt fields
export class SearchTerm {
    @Prop({ type: String, required: true })
    term: string;

    @Prop({ type: String, required: true })
    location: string;

    @Prop({ type: String, enum: ['Remote', 'Hybrid', 'On-site', ''] })
    jobType?: 'Remote' | 'Hybrid' | 'On-site' | '';

    @Prop({ type: [Types.ObjectId], ref: 'User' })
    users: Types.ObjectId[];

    @Prop({ type: [Types.ObjectId], ref: 'JobListing' })
    jobListings: Types.ObjectId[];

    @Prop({ type: Date })
    lastScraped?: Date;

    @Prop({ type: String })
    URL?: string;
}

export const SearchTermSchema = SchemaFactory.createForClass(SearchTerm);

// Creating a compound index like in Mongoose
SearchTermSchema.index({ term: 1, location: 1, jobType: 1 }, { unique: true });
