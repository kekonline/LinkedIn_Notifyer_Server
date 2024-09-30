"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const SearchTerm = require('../models/SearchTerm.model');
const User = require("../models/User.model");
exports.getSearchTerm = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.payload._id;
    try {
        const searchTerms = yield SearchTerm.find({ users: userId }).select('-users').sort({ term: 1 });
        res.status(200).json({ searchTerms, error: false });
    }
    catch (error) {
        next(error);
    }
});
// Handler for creating a new user
exports.createSearchTerm = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.payload._id;
    const { term, location, jobType } = req.body;
    if (!term || !location) {
        res.status(400).json({ message: "All fields are required", error: true });
        return;
    }
    try {
        // serchTermExists = await SearchTerm.findOne({ term: term.trim().toLowerCase(), location: location.trim().toLowerCase(), jobType: jobType ? jobType.trim().toLowerCase() : jobType });
        const updatedSearchTerm = yield SearchTerm.findOneAndUpdate({
            term: term.trim().toLowerCase(),
            location: location.trim().toLowerCase(),
            jobType: jobType ? jobType.trim().toLowerCase() : jobType
        }, {
            $addToSet: { users: userId }
        }, {
            new: true,
            upsert: true // Create a new document if none match the query
        });
        const searchTermId = updatedSearchTerm ? updatedSearchTerm._id : null;
        if (searchTermId) {
            // Add the searchTermId to the user's searchTerms
            yield User.findByIdAndUpdate(userId, {
                $addToSet: { searchTerms: searchTermId }
            });
        }
        res.status(201).json({ message: "Search term updated successfully", error: false });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteSearchTerm = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const searchTermToDelete = req.params.searchTermId;
    const userId = req.payload._id;
    try {
        yield SearchTerm.findOneAndUpdate({
            _id: searchTermToDelete
        }, {
            $pull: { users: userId }
        });
        yield User.findOneAndUpdate({
            _id: userId
        }, {
            $pull: { searchTerms: searchTermToDelete }
        });
        res.status(200).json({ message: "Search term deleted successfully", error: false });
    }
    catch (error) {
        next(error);
    }
});
