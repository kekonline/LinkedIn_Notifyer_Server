

export class CreateUserDto {
    readonly email: string;
    readonly password: string;
    readonly searchTerms: string[]; // Array of SearchTerm IDs
    readonly seenJobListings: any[];
    readonly getNotifications: boolean;
    readonly token: { value: string; expiry: Date };
    readonly isActive: boolean;
}
