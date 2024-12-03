"use client";

import Link from "next/link";
import LoginButton from "./_components/login";
import LogOutButton from "./_components/logout";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useState, useEffect } from 'react';
import WeatherWidget from "./weather/WeatherWidget"; 
interface WindowWithGoogleLogout extends Window {
  googleLogout?: () => void;
}

// Ensure this matches the Google Cloud Console configuration
const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 
  "49243162226-hsvtotstbj808vdmp0k2jvhf0asfre40.apps.googleusercontent.com";

// Mock employee database (in a real app, this would be a database query)
const employees = [
  { email: 'employee0@gmail.com', position: 'Manager' },
  { email: 'employee1@gmail.com', position: 'Employee' },
  { email: 'employee2@gmail.com', position: 'Employee' },
  { email: 'employee3@gmail.com', position: 'Employee' },
  { email: 'employee4@gmail.com', position: 'Employee' },
  { email: 'employee5@gmail.com', position: 'Manager' },
  { email: 'employee6@gmail.com', position: 'Employee' },
  { email: 'employee7@gmail.com', position: 'Employee' },
  { email: 'employee8@gmail.com', position: 'Employee' },
  { email: 'employee9@gmail.com', position: 'Employee' },
  { email: 'carsoncoen@tamu.edu', position: 'Employee' },
  { email: 'keepswimming123@tamu.edu', position: 'Employee' },
  { email: 'nicktnc24@tamu.edu', position: 'Employee' },
  { email: 'nmcorn21@tamu.edu', position: 'Employee' },
  { email: 'ethan2004g@tamu.edu', position: 'Manager' }
];

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState<'Customer' | 'Employee' | 'Manager'>('Customer');

  // Function to check employee role
  const checkEmployeeRole = (email: string) => {
    const employee = employees.find(emp => emp.email === email);
    if (employee) {
      return employee.position === 'Manager' ? 'Manager' : 'Employee';
    }
    return 'Customer';
  };

  useEffect(() => {
    // Check sessionStorage instead of localStorage
    const token = sessionStorage.getItem('token');
    const storedEmail = sessionStorage.getItem('userEmail');
    if (token && storedEmail) {
      setIsLoggedIn(true);
      setUserEmail(storedEmail);
      setUserRole(checkEmployeeRole(storedEmail));
      console.log(token);
    }

    // Add event listener for beforeunload
    const handleBeforeUnload = () => {
      // Clear session data
      sessionStorage.clear();
      // Perform logout
      if (isLoggedIn) {
        const windowWithGoogleLogout = window as WindowWithGoogleLogout;
        windowWithGoogleLogout.googleLogout?.();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isLoggedIn]);

  const handleLoginSuccess = (email: string, token: string) => {
    setIsLoggedIn(true);
    setUserEmail(email);
    setUserRole(checkEmployeeRole(email));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserEmail('');
    setUserRole('Customer');
    sessionStorage.clear();
  };

  // Render navigation links based on user role
  const renderNavigationLinks = () => {
    switch (userRole) {
      case 'Customer':
        return (<Link href="/customerView" className="w-1/5 py-10 bg-white rounded-lg shadow-lg hover:scale-110 hover:duration-300 text-center"> Customer </Link>);
      case 'Employee':
        return (<Link href="/cashierView" className="w-1/5 py-10 bg-white rounded-lg shadow-lg hover:scale-110 hover:duration-300 text-center"> Cashier </Link>);
      case 'Manager':
        return (
          <>
            <Link href="/cashierView" className="w-1/5 py-10 bg-white rounded-lg shadow-lg hover:scale-110 hover:duration-300 text-center"> Cashier </Link>
            <Link href="/managerView" className="w-1/5 py-10 bg-white rounded-lg shadow-lg hover:scale-110 hover:duration-300 text-center"> Manager </Link>
          </>
        );
    }
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="flex flex-col items-center h-screen min-h-fit rounded-full bg-red-800">
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
            <div className="text-lg">
              Logged in as: {userEmail} ({userRole})
            </div>
          )}
        </div>

        <div className="text-2xl mt-24">
          Login As:
        </div>
        <div className="flex flex-col items-center w-full gap-y-6 my-7 text-2xl text-gray-800 font-bold">
          {renderNavigationLinks()}
        </div>
        <div className="text-2xl mt-22">
          <Link href="/menuBoardView">Or View Menu</Link>
        </div>
        <div className="flex gap-4 mt-6">
          <LoginButton onLoginSuccess={handleLoginSuccess} />
          {isLoggedIn && <LogOutButton onLogoutSuccess={handleLogout} />}
        </div>
      </div>
      <WeatherWidget/>
    </GoogleOAuthProvider>
  );
}