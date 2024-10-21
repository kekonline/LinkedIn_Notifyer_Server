

import { UserSchema } from '../user/schemas/user.schema';
import { SearchTermSchema } from '../search-term/schemas/search-term.schema';
import * as mongoose from 'mongoose';
const User = mongoose.model('User', UserSchema);
const SearchTerm = mongoose.model('SearchTerm', SearchTermSchema);


export const deleteUsersWithoutEmailAndOldCreatedDate = async () => {

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    try {
        const usersWithoutEmail = await User.find({
            email: { $exists: false },
            createdAt: { $lt: oneWeekAgo }
        });

        const usersToDelete = [];

        for (const user of usersWithoutEmail) {
            const hasSearchTerms = await SearchTerm.exists({
                users: user._id
            });

            if (!hasSearchTerms) {
                usersToDelete.push(user._id);
            }
        }

        if (usersToDelete.length > 0) {
            await User.deleteMany({ _id: { $in: usersToDelete } });
            console.log(`${usersToDelete.length} users deleted without email and no search terms`);
        } else {
            console.log("No users found for deletion");
        }

    } catch (error) {
        console.error("Error deleting users:", error);
    }
};
