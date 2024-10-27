"use client";

import Image from 'next/image';
import { AuthContext, AuthContextType } from "./context/authorization";
import BarLoader from "react-spinners/BarLoader";
import { useRouter } from 'next/navigation';
import { useState, useEffect, useContext } from 'react';
import './page.css';

const Home = () => {
  const { userCheckedIn } = useContext(AuthContext) as AuthContextType;
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (userCheckedIn !== false) {
        setLoading(false);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [userCheckedIn]);

  useEffect(() => {
    if (!loading && userCheckedIn !== false) {
      router.push('/joblisting/new');
    }
  }, [loading, userCheckedIn, router]);

  if (loading) {
    return (
      <div className="homeMainContainer">
        <Image
          className="splashScreenLogo"
          src="/splash_screen_logo.png"
          alt="Logo"
          width={135}
          height={135}
        />
        <BarLoader className="splashSpinner" color="#FFFFFF" width={135} />
      </div>
    );
  }

  return null;
}

export default Home;
