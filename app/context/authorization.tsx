"use client";

import { useState, useEffect, createContext, ReactNode, use } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { VERIFY_TOKEN } from "../graphql/queries/user";
import { GET_TOKEN } from "../graphql/mutations/user";

// Define the shape of your context
export interface AuthContextType {
    verifyToken: () => void;
    userEnrolled: boolean;
    setUserEnrolled: React.Dispatch<React.SetStateAction<boolean>>;
    userCheckedIn: boolean;
    setuserCheckedIn: React.Dispatch<React.SetStateAction<boolean>>;
    userEmail: string;
    setUserEmail: React.Dispatch<React.SetStateAction<string>>;
    userGetNotifications: boolean;
    setUserGetNotifications: React.Dispatch<React.SetStateAction<boolean>>;
    userIsActive: boolean;
    error: string | null;
}

// Create the context with default values
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthWrapperProps {
    children: ReactNode; // To allow passing child components
}

function AuthWrapper({ children }: AuthWrapperProps) {
    const [error, setError] = useState<string | null>(null);
    const [userCheckedIn, setuserCheckedIn] = useState<boolean>(false);
    const [userEnrolled, setUserEnrolled] = useState<boolean>(false);
    const [userEmail, setUserEmail] = useState<string>("");
    const [userGetNotifications, setUserGetNotifications] = useState<boolean>(false);
    const [userIsActive, setUserIsActive] = useState<boolean>(false);

    const [getToken] = useMutation(GET_TOKEN);
    const { data: verifyData, refetch: refetchVerifyToken } = useQuery(VERIFY_TOKEN, {
        skip: true, // We'll trigger this manually after ensuring the token is set
    });

    useEffect(() => {
        verifyToken();
    }, []);

    const verifyToken = async () => {
        try {
            let authToken = localStorage.getItem("authToken");

            // Fetch a new token if none exists
            if (!authToken || authToken === "undefined" || authToken === null || authToken === "") {
                const { data } = await getToken();
                if (data.getToken.errorMessage) {
                    throw new Error(data.getToken.errorMessage);
                }

                authToken = data.getToken.authToken;
                localStorage.setItem("authToken", authToken || "");;
            }

            // Verify the token by fetching user details
            const { data: userInfo } = await refetchVerifyToken();
            if (userInfo.verifyToken.errorMessage) {
                throw new Error(userInfo.verifyToken.errorMessage);
            }

            const { enrolled, email, getNotifications, isActive } = userInfo.verifyToken;

            setUserEnrolled(enrolled);
            setUserEmail(email);
            setUserGetNotifications(getNotifications);
            setUserIsActive(isActive);
            setuserCheckedIn(true);
        } catch (error: any) {
            console.error("Error verifying token or fetching user info:", error.message);
            localStorage.setItem("authToken", "");
            setError(error.message);
        }
    };

    const passedContext: AuthContextType = {
        verifyToken,
        userEnrolled,
        setUserEnrolled,
        userCheckedIn,
        setuserCheckedIn,
        userEmail,
        setUserEmail,
        userGetNotifications,
        setUserGetNotifications,
        userIsActive,
        error,
    };

    return <AuthContext.Provider value={passedContext}>{children}</AuthContext.Provider>;
}

export { AuthContext, AuthWrapper };