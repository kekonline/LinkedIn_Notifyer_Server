import { Controller, Get, Post, Delete, Param, Body, Request, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { SearchTermService } from './search-term.service';
import { AuthRequest } from '../user/request.interface';
import { AuthGuard } from '../user/guards/auth.guard';

@Controller('searchterm')
@UseGuards(AuthGuard)
export class SearchTermController {
    constructor(private readonly searchTermService: SearchTermService) { }

    // GET - /api/searchterm
    @Get()
    async getSearchTerm(@Request() req: AuthRequest) {
        const userId = req.payload?._id;
        try {
            return await this.searchTermService.getSearchTerms(userId);
        } catch (error) {
            console.log('Error fetching search terms:', error);
            throw new HttpException('Failed to get search terms', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // POST - /api/searchterm
    @Post()
    async createSearchTerm(
        @Request() req: AuthRequest,
        @Body('term') term: string,
        @Body('location') location: string,
        @Body('jobType') jobType: string
    ) {
        const userId = req.payload?._id;
        if (!term || !location) {
            throw new HttpException('All fields are required', HttpStatus.BAD_REQUEST);
        }
        try {
            return await this.searchTermService.createSearchTerm(userId, term, location, jobType);
        } catch (error) {
            console.log('Error creating search term:', error);
            throw new HttpException('Failed to create search term', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // DELETE - /api/searchterm/:searchTermId
    @Delete('/:searchTermId')
    async deleteSearchTerm(@Param('searchTermId') searchTermId: string, @Request() req: AuthRequest) {
        const userId = req.payload?._id;
        try {
            return await this.searchTermService.deleteSearchTerm(userId, searchTermId);
        } catch (error) {
            console.log('Error deleting search term:', error);
            throw new HttpException('Failed to delete search term', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
