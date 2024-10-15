import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SearchTermDocument } from './schemas/search-term.schema';
import { User } from '../user/schemas/user.schema';

@Injectable()
export class SearchTermService {
    constructor(
        @InjectModel('SearchTerm') private searchTermModel: Model<SearchTermDocument>,
        @InjectModel('User') private userModel: Model<User>
    ) { }

    async getSearchTerms(userId: string) {
        try {
            const searchTerms = await this.searchTermModel
                .find({ users: userId })
                .select('-users')
                .sort({ term: 1 });
            return { searchTerms, error: false };
        } catch (error) {
            console.log('Error fetching search terms:', error);
            throw new HttpException('Error fetching search terms', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async createSearchTerm(userId: string, term: string, location: string, jobType?: string) {
        if (!term || !location) {
            throw new HttpException('All fields are required', HttpStatus.BAD_REQUEST);
        }

        try {
            const updatedSearchTerm = await this.searchTermModel.findOneAndUpdate(
                {
                    term: term.trim().toLowerCase(),
                    location: location.trim().toLowerCase(),
                    jobType: jobType ? jobType.trim().toLowerCase() : jobType
                },
                {
                    $addToSet: { users: userId }
                },
                {
                    new: true,
                    upsert: true // Create a new document if none match the query
                }
            );

            const searchTermId = updatedSearchTerm ? updatedSearchTerm._id : null;

            if (searchTermId) {
                await this.userModel.findByIdAndUpdate(
                    userId,
                    {
                        $addToSet: { searchTerms: searchTermId }
                    }
                );
            }

            return { message: 'Search term updated successfully', error: false };
        } catch (error) {
            console.log('Error creating search term:', error);
            throw new HttpException('Error creating search term', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async deleteSearchTerm(searchTermToDelete: string, userId: string) {
        try {
            const searchTerm = await this.searchTermModel.findById(searchTermToDelete);
            if (!searchTerm) {
                throw new HttpException('Search term not found', HttpStatus.NOT_FOUND);
            }

            await this.searchTermModel.findOneAndUpdate(
                {
                    _id: searchTermToDelete
                },
                {
                    $pull: { users: userId }
                }
            );

            await this.userModel.findOneAndUpdate(
                {
                    _id: userId
                },
                {
                    $pull: { searchTerms: searchTermToDelete }
                }
            );

            return { message: 'Search term deleted successfully', error: false };
        } catch (error) {
            console.log('Error deleting search term:', error);
            throw new HttpException('Error deleting search term', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
