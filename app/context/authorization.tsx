"use client";

import { useState, useEffect, createContext, ReactNode } from "react";
import { useQuery, gql } from "@apollo/client";
import { VERIFY_TOKEN, GET_TOKEN } from "../graphql/queries/user";

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

    const {
        data: verifyTokenData,
        loading: verifyTokenLoading,
        error: verifyTokenError,
    } = useQuery(VERIFY_TOKEN);

    const {
        data: getTokenData,
        loading: getTokenLoading,
        error: getTokenError,
    } = useQuery(GET_TOKEN);

    useEffect(() => {
        if (getTokenData) {
            const { authToken } = getTokenData.getToken; // Ensure query returns an object with authToken
            if (authToken) {
                localStorage.setItem("authToken", authToken);
            }
        }

        if (verifyTokenData) {
            const { enrolled, email, getNotifications, isActive } = verifyTokenData.verifyToken; // Ensure query returns this structure
            setUserEnrolled(enrolled);
            setUserEmail(email);
            setUserGetNotifications(getNotifications);
            setUserIsActive(isActive);
            setuserCheckedIn(true);
        }

        if (verifyTokenError || getTokenError) {
            console.error("Error verifying token or fetching new token", verifyTokenError || getTokenError);
            localStorage.setItem("authToken", "");
            setError((verifyTokenError || getTokenError)?.message || "An error occurred");
        }
    }, [verifyTokenData, getTokenData, verifyTokenError, getTokenError]);

    const verifyToken = () => {
        // This function can be used for manual re-verification if needed.
        // Leaving it empty for now as GraphQL queries handle this reactively.
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
