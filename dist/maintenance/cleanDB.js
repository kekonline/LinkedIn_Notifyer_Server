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
const User = require("../models/User.model");
const SearchTerm = require("../models/SearchTerm.model");
const deleteUsersWithoutEmailAndOldCreatedDate = () => __awaiter(void 0, void 0, void 0, function* () {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    try {
        const usersWithoutEmail = yield User.find({
            email: { $exists: false },
            createdAt: { $lt: oneWeekAgo }
        });
        const usersToDelete = [];
        for (const user of usersWithoutEmail) {
            const hasSearchTerms = yield SearchTerm.exists({
                users: user._id
            });
            if (!hasSearchTerms) {
                usersToDelete.push(user._id);
            }
        }
        if (usersToDelete.length > 0) {
            yield User.deleteMany({ _id: { $in: usersToDelete } });
            console.log(`${usersToDelete.length} users deleted without email and no search terms`);
        }
        else {
            console.log("No users found for deletion");
        }
    }
    catch (error) {
        console.error("Error deleting users:", error);
    }
});
module.exports = {
    deleteUsersWithoutEmailAndOldCreatedDate
};
