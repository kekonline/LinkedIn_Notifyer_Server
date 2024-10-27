import { useContext, ReactNode } from "react";
import { AuthContext } from "../context/authorization";
import { Navigate } from "react-router-dom";

interface KickBackProps {
    userEnrolledStatus: boolean;
    children: ReactNode;
}

function KickBack({ userEnrolledStatus, children }: KickBackProps) {

    const authContext = useContext(AuthContext);

    if (!authContext) {

        return <div>Loading...</div>;
    }
    const { userEnrolled } = authContext;

    if (userEnrolled === userEnrolledStatus) {
        return children;
    } else {
        return <Navigate to="/" />;
    }
}

export default KickBack;
