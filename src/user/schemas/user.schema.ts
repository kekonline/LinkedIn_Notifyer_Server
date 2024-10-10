/* eslint-disable prettier/prettier */
// src/user/schemas/user.schema.ts

import { Schema as MongooseSchema, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

// Define the interface for the SeenJobListing
interface SeenJobListing {
    jobListing: Types.ObjectId; // Reference to JobListing
    seen: boolean;
    starred: boolean;
}

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true })
    email?: string; // Optional due to sparse

    @Prop()
    password?: string;

    @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'SearchTerm' }] })
    searchTerms: Types.ObjectId[]; // Array of references to SearchTerm

    @Prop({
        type: [
            {
                jobListing: { type: MongooseSchema.Types.ObjectId, ref: 'JobListing' },
                seen: { type: Boolean, default: false },
                starred: { type: Boolean, default: false }
            }
        ]
    })
    seenJobListings: SeenJobListing[];

    @Prop({ default: false })
    getNotifications: boolean;

    @Prop({
        type: {
            value: String,
            expiry: Date
        }
    })
    token: {
        value: string;
        expiry: Date;
    };

    @Prop({ default: false })
    isActive: boolean;

    @Prop({ default: Date.now })
    createdAt?: Date; // Optional, included with timestamps

    @Prop({ default: Date.now })
    updatedAt?: Date; // Optional, included with timestamps
}

export const UserSchema = SchemaFactory.createForClass(User);
