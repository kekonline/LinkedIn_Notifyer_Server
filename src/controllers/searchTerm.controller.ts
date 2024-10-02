import { Request, Response, NextFunction } from 'express';
import SearchTerm from '../models/SearchTerm.model';
import User from '../models/User.model';

export const getSearchTerm = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = (req as Request & { payload?: { _id: string } }).payload?._id;
    try {
        const searchTerms = await SearchTerm.find({ users: userId }).select('-users').sort({ term: 1 });
        res.status(200).json({ searchTerms, error: false });
    } catch (error) {
        next(error);
    }
};

export const createSearchTerm = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = (req as Request & { payload?: { _id: string } }).payload?._id;
    const { term, location, jobType } = req.body;

    if (!term || !location) {
        res.status(400).json({ message: "All fields are required", error: true });
        return;
    }

    try {
        const updatedSearchTerm = await SearchTerm.findOneAndUpdate(
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
                upsert: true     // Create a new document if none match the query
            }
        );

        const searchTermId = updatedSearchTerm ? updatedSearchTerm._id : null;

        if (searchTermId) {
            await User.findByIdAndUpdate(
                userId,
                {
                    $addToSet: { searchTerms: searchTermId }
                }
            );
        }

        res.status(201).json({ message: "Search term updated successfully", error: false });
    } catch (error) {
        next(error);
    }
};

export const deleteSearchTerm = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const searchTermToDelete = req.params.searchTermId;
    const userId = (req as Request & { payload?: { _id: string } }).payload?._id;
    try {
        const searchTerm = await SearchTerm.findById(searchTermToDelete);
        if (!searchTerm) {
            res.status(404).json({ message: "Search term not found", error: true });
            return
        }

        await SearchTerm.findOneAndUpdate(
            {
                _id: searchTermToDelete
            },
            {
                $pull: { users: userId }
            }
        );

        await User.findOneAndUpdate(
            {
                _id: userId
            },
            {
                $pull: { searchTerms: searchTermToDelete }
            }
        );

        res.status(200).json({ message: "Search term deleted successfully", error: false });

    } catch (error) {
        next(error);
    }

};