import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class JobListing extends Document {
    @Prop({ type: String })
    title: string;

    @Prop({ type: String })
    company: string;

    @Prop({ type: String })
    description: string;

    @Prop({ type: String, required: true, unique: true })
    jobURL: string;

    @Prop({ type: String })
    applyURL?: string;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'SearchTerm' }] })
    searchTerms: Types.ObjectId[];

    @Prop({ type: Number, default: 0 })
    scrapeRetries: number;

    @Prop({ type: Date })
    createdAt: Date;

    @Prop({ type: Date })
    updatedAt: Date;
}

export const JobListingSchema = SchemaFactory.createForClass(JobListing);
