"use client";

import { useState, useEffect, useContext } from "react";
import axiosInstance from "../../services/axiosInstance";
import { useRouter } from 'next/navigation';
import { AuthContext, AuthContextType, } from "../../context/authorizationOld";

function ForgotPassword() {
  const [email, setEmail] = useState<string>("");
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState<string>("");

  const { userEnrolled } = useContext(AuthContext) as AuthContextType;
  const router = useRouter();

  useEffect(() => {
    if (userEnrolled === true) {
      router.push('/');
    }
  }, [router, userEnrolled]);


  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setter(event.target.value);
  };

  useEffect(() => {
    if (forgotPasswordMessage) {
      const timeout = setTimeout(() => {
        setForgotPasswordMessage("");
      }, 3000);

      // Cleanup function to clear the timeout if the component unmounts
      return () => clearTimeout(timeout);
    }
  }, [forgotPasswordMessage]);

  const handleSendForgotPasswordEmail = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); // Prevent button click from refreshing the page

    try {
      if (!email) {
        console.log("Please fill in all fields");
        return;
      }

      const enrollResponse = await axiosInstance.post(`/api/auth/sendforgotpasswordemail`, { email });

      if (enrollResponse.data.error) {
        console.log("Error: ", enrollResponse.data.message);
        setForgotPasswordMessage(enrollResponse.data.message); // Display error message
        return;
      }

      console.log("sendEmailResponse: ", enrollResponse.data.message);
      setForgotPasswordMessage(enrollResponse.data.message);
    } catch (error: any) {
      console.log("Error: ", error.response ? error.response.data : error.message);
      setForgotPasswordMessage("An error occurred while sending the email.");
    }
  };

  return (
    <div>
      <h1>Forgot Password</h1>
      <br />
      <br />
      <div>
        <label htmlFor="email">Email: </label>
        <input
          id="email"
          type="text"
          value={email}
          onChange={(event) => handleInputChange(event, setEmail)}
        />
      </div>
      <div>
        <button onClick={handleSendForgotPasswordEmail}>Send Forgot Password Email</button>
        {forgotPasswordMessage && <p>{forgotPasswordMessage}</p>}
      </div>
    </div>
  );
}

export default ForgotPassword;
