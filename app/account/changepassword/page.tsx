"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter } from 'next/navigation';
import axiosInstance from "../../services/axiosInstance";
import { AuthContext, AuthContextType, } from "../../context/authorizationold";

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [newPassword2, setNewPassword2] = useState<string>("");
  const { userEnrolled } = useContext(AuthContext) as AuthContextType;
  const router = useRouter();

  useEffect(() => {
    if (userEnrolled === false) {
      router.push('/');
    }
  }, [router, userEnrolled]);


  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>) => {
    setter(event.target.value);
  };

  const handleSaveChangePassword = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    // Validate not null and that values are not already in the array
    if (!oldPassword || !newPassword || !newPassword2) {
      console.log("Please fill in all fields");
      return;
    }

    if (newPassword !== newPassword2) {
      console.log("Passwords do not match");
      return;
    }

    try {
      const changePasswordResponse = await axiosInstance.put("/api/auth/newpassword", {
        oldPassword: oldPassword,
        newPassword: newPassword,
      });

      if (changePasswordResponse.data.error) {
        console.log(changePasswordResponse.data.message);
        return;
      }

      console.log("changePasswordResponse: ", changePasswordResponse.data.message);

    } catch (error) {
      console.log(error);
    }

  };

  return (
    <div>
      <h1>ChangePassword</h1>
      Here you can change you password!
      <form>
        <div>
          <label htmlFor="oldPassword">Old Password: </label>
          <input
            id="oldpassword"
            type="password"
            value={oldPassword}
            onChange={(event) => handleInputChange(event, setOldPassword)}
          />
        </div>
        <div>
          <label htmlFor="oldPassword">New Password: </label>
          <input
            id="newpassword"
            type="password"
            value={newPassword}
            onChange={(event) => handleInputChange(event, setNewPassword)}
          />
        </div>
        <div>
          <label htmlFor="oldPassword">New Password: </label>
          <input
            id="newpassword2"
            type="password"
            value={newPassword2}
            onChange={(event) => handleInputChange(event, setNewPassword2)}
          />
        </div>
        <div>
          <button onClick={(event) => handleSaveChangePassword(event)}>Save</button>
        </div>
        <div>
          <button onClick={() => router.push("/account/user")}>Back</button>
        </div>
      </form>



    </div>
  )
}

export default ChangePassword