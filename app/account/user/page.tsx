"use client";

import { useContext, useEffect } from "react";
import { AuthContext, AuthContextType } from "../../context/authorizationold";
import axiosInstance from "../../services/axiosInstance";
import { useRouter } from 'next/navigation';

function User() {
  const {
    setUserEnrolled,
    setuserCheckedIn,
    userEmail,
    setUserEmail,
    userGetNotifications,
    setUserGetNotifications,
    userEnrolled,
    userIsActive,
  } = useContext(AuthContext) as AuthContextType;

  // console.log("userGetNotifications", userGetNotifications);
  const router = useRouter();

  useEffect(() => {
    if (userEnrolled === false) {
      router.push('/');
    }
  }, [router, userEnrolled]);

  const handleCheckboxChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newNotificationsSetting = event.target.checked;
    setUserGetNotifications(newNotificationsSetting);

    try {
      const notificationResponse = await axiosInstance.put("/api/auth/user", {
        getNotifications: newNotificationsSetting,
      });

      if (notificationResponse.data.error) {
        // console.log("Error: ", notificationResponse.data.message);
        return;
      }

      // console.log("notificationResponse: ", notificationResponse.data);
    } catch (error) {
      console.error("Failed to update notification settings:", error);
    }
  };


  const handleSendActivationEmail = async () => {



    try {
      const sendEmailResponse = await axiosInstance.get("/api/auth/resendactivation");
      if (sendEmailResponse.data.error) {
        // console.log("Error: ", sendEmailResponse.data.message);
        // return;
      }
      console.log("sendEmailResponse: ", sendEmailResponse.data.message);
    } catch (error) {
      console.error("Failed to send email:", error);
    }
  }
  const handleLogout = () => {
    setUserEnrolled(false);
    setuserCheckedIn(false);
    setUserEmail("");
    localStorage.removeItem("authToken");
    router.push("/");
    window.location.reload();
  };

  return (
    <div>
      <h1>User</h1>
      <div>hello {userEmail}</div>
      <br />
      <div>
        {userIsActive ? (<label>
          <input
            type="checkbox"
            checked={userGetNotifications}
            onChange={handleCheckboxChange} // Correctly pass the event here
          />
          Want to receive email notifications
        </label>) : (<div>
          <button
            onClick={handleSendActivationEmail}
          >
            Send me the verification email
          </button>
          You need to activate your account to receive email notifications check you email for the verification link
        </div>)}

      </div>
      <br />
      <div>
        Need to change you password?
        <button
          onClick={() => {
            router.push("/account/changepassword");
          }}
        >
          Click here
        </button>

      </div>
      <br />
      <div>
        <button onClick={handleLogout}>Log Out</button>
      </div>
    </div>
  );
}

export default User;
