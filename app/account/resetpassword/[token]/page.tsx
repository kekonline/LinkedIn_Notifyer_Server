import { useEffect, useState, useContext } from "react";
import axiosInstance from "../../../services/axiosInstance";
import { useParams } from 'next/navigation'
import { AuthContext, AuthContextType } from "../../../context/authorization";
import { useRouter } from 'next/navigation';

function ResetPassword() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [password2, setPassword2] = useState<string>("");
  const params = useParams<{ token: string }>();
  const { token } = params;
  const [resetPasswordMessage, setResetPasswordMessage] = useState<string | null>(null);


  const authContext = useContext(AuthContext);
  const { userEnrolled } = authContext as AuthContextType;
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

  useEffect(() => {
    if (resetPasswordMessage) {
      setTimeout(() => {
        setResetPasswordMessage("");
      }, 3000);
    }
  }, [resetPasswordMessage]);

  const handleResetPassword = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!email || !password || !password2) {
      console.log("Please fill in all fields");
      return;
    }

    if (password !== password2) {
      console.log("Passwords do not match");
      return;
    }

    try {
      const resetPasswordResponse = await axiosInstance.post(`auth/resetpassword`, {
        email,
        password,
        token
      });

      // if (resetPasswordResponse.data.error) {
      //     console.log("Error: ", resetPasswordResponse.data.message);
      //     return;
      // }

      console.log("resetPasswordResponse: ", resetPasswordResponse.data.message);
      setResetPasswordMessage(resetPasswordResponse.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1>Reset Password</h1>
      <br />
      <br />

      <form onSubmit={handleResetPassword}>
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
          <label htmlFor="password">Password: </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => handleInputChange(event, setPassword)}
          />
        </div>
        <div>
          <label htmlFor="password2">Confirm Password: </label>
          <input
            id="password2"
            type="password"
            value={password2}
            onChange={(event) => handleInputChange(event, setPassword2)}
          />
        </div>
        <div>
          <button type="submit">Reset Password</button>
          {resetPasswordMessage && <p>{resetPasswordMessage}</p>}
        </div>
      </form>
    </div>
  )
}

export default ResetPassword