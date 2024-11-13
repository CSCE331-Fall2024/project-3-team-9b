"use client";

import Link from "next/link";
import LoginButton from "./_components/login";
import LogOutButton from "./_components/logout";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useState, useEffect } from 'react';

const clientId = "32164770538-vg436on3johb97cfdlcpm35nm083s85r.apps.googleusercontent.com"

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedEmail = localStorage.getItem('userEmail');
    if (token) {
      setIsLoggedIn(true);
      setUserEmail(storedEmail || '');
    }
  }, []);

  const handleLoginSuccess = (email: string, token: string) => {
    setIsLoggedIn(true);
    setUserEmail(email);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserEmail('');
  };

  return (
    <GoogleOAuthProvider 
      clientId={clientId}
    >
      <div className="flex flex-col items-center h-screen rounded-full bg-red-800">
        <div className="text-6xl mt-10">
          Welcome to Panda Express!
        </div>
        <div className="">
          Produced by: Nick Truong, Anthony Huang, Carson Coen, Ethan Ghoreishi, Nathan Cornelius
        </div>
        
        {/* Login Status Display */}
        <div className="mt-4 text-white text-xl">
          Status: {isLoggedIn ? '✅ Logged In' : '❌ Not Logged In'}
          {isLoggedIn && userEmail && (
            <div className="text-lg">Logged in as: {userEmail}</div>
          )}
        </div>

        <div className="text-2xl mt-24">
          Login As:
        </div>
        <div className="flex flex-col items-center w-full gap-y-6 my-7 text-2xl text-gray-800 font-bold">
          <Link href="/customerView" className="w-1/5 py-10 bg-white rounded-lg shadow-lg  hover:scale-110 hover:duration-300 text-center">Customer</Link>
          <Link href="/cashierView" className="w-1/5 py-10 bg-white rounded-lg shadow-lg   hover:scale-110 hover:duration-300 text-center">Cashier</Link>
          <Link href="/managerView" className="w-1/5 py-10 bg-white rounded-lg shadow-lg  hover:scale-110 hover:duration-300 text-center">Manager</Link>
        </div>
        <div className="text-2xl mt-22">
          <Link href="/menuBoardView">Or View Menu</Link>
        </div>
        <div className="flex gap-4 mt-6">
          <LoginButton onLoginSuccess={handleLoginSuccess} />
          {isLoggedIn && <LogOutButton onLogoutSuccess={handleLogout} />}
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}