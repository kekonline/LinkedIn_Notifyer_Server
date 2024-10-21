import {
    Controller,
    Get,
    Put,
    Param,
    Body,
    UseGuards,
    Req,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { JobListingService } from './job-listing.service';
import { AuthGuard } from '../user/guards/auth.guard'; // Assuming you're using JWT authentication
import { MarkJobDto } from './dto/mark-job.dto'; // Create a DTO for the request body
import { AuthRequest } from '../user/request.interface';

@Controller('job')
export class JobListingController {
    constructor(private readonly jobListingService: JobListingService) { }

    // GET - /api/job/:page
    @UseGuards(AuthGuard) // Protecting the route with a JWT authentication guard
    @Get('/:page')
    async getAllJobs(@Param('page') page: string, @Req() req: AuthRequest) {

        const userId = req.payload?._id; // Assuming `user` is attached to the request object by the auth middleware
        if (!userId) {
            throw new HttpException('User not authenticated', HttpStatus.UNAUTHORIZED);
        }

        try {
            const jobListings = await this.jobListingService.getAllJobs(userId, page);
            return jobListings;
        } catch (error) {
            console.error(error);
            throw new HttpException(
                'An error occurred while fetching job listings',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    // GET - /api/job/:jobId
    @Get('/:jobId')
    async getJobById(@Param('jobId') jobId: string) {
        try {
            const jobListing = await this.jobListingService.getJobById(jobId);
            return jobListing;
        } catch (error) {
            console.error(error);
            throw new HttpException(
                'An error occurred while fetching the job listing',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    // PUT - /api/job/:jobId
    @UseGuards(AuthGuard)
    @Put('/:jobId')
    async markJobId(
        @Param('jobId') jobId: string,
        @Body() markJobDto: MarkJobDto,
        @Req() req: AuthRequest,
    ) {
        const userId = req.payload?._id;
        if (!userId) {
            throw new HttpException('User not authenticated', HttpStatus.UNAUTHORIZED);
        }

        try {
            await this.jobListingService.markJobId(userId, jobId, markJobDto.markAs);
            return { message: 'Job listing updated successfully' };
        } catch (error) {
            console.error(error);
            throw new HttpException(
                'An error occurred while updating the job listing',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
