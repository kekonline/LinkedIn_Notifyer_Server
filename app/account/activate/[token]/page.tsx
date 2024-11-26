'use client'

import { useEffect, useState, useContext } from "react";
import axiosInstance from "../../../services/axiosInstance";
import { AuthContext, AuthContextType } from "../../../context/authorizationOld";
import { useParams } from 'next/navigation'

function ActivateUser() {
  const [userIsActive, setUserIsActive] = useState<boolean>(false);
  const params = useParams<{ token: string }>();
  const { token } = params;
  const { userEnrolled, verifyToken } = useContext(AuthContext) as AuthContextType;
  const [activationMessage, setActivationMessage] = useState<string | null>(null);

  useEffect(() => {
    const activateUser = async () => {
      if (!userEnrolled) {
        console.log("No user registered");
        setActivationMessage("No user registered");
        return;
      }

      if (!token) {
        console.log("No token");
        setActivationMessage("No token");
        return;
      }

      try {
        const response = await axiosInstance.get(`/api/auth/activate/${token}`);
        if (response.data.error) {
          // console.log("Error activating user");
          setUserIsActive(false);
          setActivationMessage("User activation failed.");
        } else {
          setUserIsActive(true);
          verifyToken();
          setActivationMessage("User activated successfully.");
        }
        console.log(response.data.message);
      } catch (error) {
        console.log("Error:", error);
        setUserIsActive(false);
        setActivationMessage("An error occurred during activation.");
      }
    };

    activateUser();
  }, [token, userEnrolled]);

  return (
    <div>
      <h1>Activate User</h1>
      <br />
      {userEnrolled ? (
        userIsActive === null ? (
          "Activating user..."
        ) : (
          activationMessage
        )
      ) : (
        "You are not logged in"
      )}
    </div>
  );
}

export default ActivateUser;
