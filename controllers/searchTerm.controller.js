const SearchTerm = require('../models/SearchTerm.model');

exports.getSearchTerm = async (req, res, next) => {
    const userId = req.payload._id;
    try {
        const searchTerms = await SearchTerm.find({ users: userId }).select('-users');
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

        await SearchTerm.findOneAndUpdate(
            {
                term: term.trim().toLowerCase(),
                location: location.trim().toLowerCase(),
                jobType: jobType ? jobType.trim().toLowerCase() : jobType
            },
            {
                $addToSet: { users: userId }
            },
            {
                upsert: true     // Create a new document if none match the query
            }
        );
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
        res.status(200).json({ message: "Search term deleted successfully", error: false });
    } catch (error) {
        next(error);
    }

};