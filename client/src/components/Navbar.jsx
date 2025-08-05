import React from 'react';
import { assets } from '../assets/assets.js';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useClerk, UserButton, useUser } from '@clerk/clerk-react';
import './Navbar.css'; // Regular CSS import

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { openSignIn } = useClerk();
  
  return (
    <div className="navbar"> {/* Use string className */}
      <img 
        src={assets.logo} 
        alt="logo" 
        onClick={() => navigate('/')} 
        className="navbarLogo"  
      />

      {user ? (
        <UserButton appearance={{
          elements: {
            userButtonAvatarBox: "w-9 h-9"
          }
        }} />
      ) : (
        <button 
          onClick={openSignIn} 
          className="getStartedBtn"  
        >
          Get Started <ArrowRight className='w-4 h-4' />
        </button>
      )}
    </div>
  );
};

export default Navbar;