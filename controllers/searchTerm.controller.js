const SearchTerm = require('../models/SearchTerm.model');
const User = require("../models/User.model")

exports.getSearchTerm = async (req, res, next) => {
    const userId = req.payload._id;
    try {
        const searchTerms = await SearchTerm.find({ users: userId }).select('-users').sort({ term: 1 });
        res.status(200).json({ searchTerms, error: false });
    } catch (error) {
        next(error);
    }
};

// Handler for creating a new user
exports.createSearchTerm = async (req, res, next) => {
    const userId = req.payload._id;
    const { term, location, jobType } = req.body;

    if (!term || !location) {
        res.status(400).json({ message: "All fields are required", error: true });
        return;
    }

    try {
        // serchTermExists = await SearchTerm.findOne({ term: term.trim().toLowerCase(), location: location.trim().toLowerCase(), jobType: jobType ? jobType.trim().toLowerCase() : jobType });

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
            // Add the searchTermId to the user's searchTerms
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

exports.deleteSearchTerm = async (req, res, next) => {
    const searchTermToDelete = req.params.searchTermId;
    const userId = req.payload._id;
    try {
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