import { Protect, useClerk, useUser } from '@clerk/clerk-react'
import { Eraser, FileText, Hash, House, Image, LogOut, Scissors, SquarePen, Users } from 'lucide-react';
import React from 'react'
import { NavLink } from 'react-router-dom';

const navItems = [
    {
        to:'/ai',label:'Dashboard', Icon: House
    },
    {
        to:'/ai/write-article',label:'Write Article', Icon: SquarePen
    },
    {
        to:'/ai/blog-titles',label:'Blog Titles', Icon: Hash
    },
    {
        to:'/ai/generate-images',label:'Generate Images', Icon: Image
    },
    {
        to:'/ai/remove-background',label:'Remove Background', Icon: Eraser
    },
    {
        to:'/ai/remove-object',label:'Remove Object', Icon: Scissors
    },
    {
        to:'/ai/review-resume',label:'Review Resume', Icon: FileText
    },
    {
        to:'/ai/community',label:'Community', Icon: Users
    }
]

const SideBar = ({sidebar,setSidebar}) => {
    const {user} = useUser();
    const {signOut, openUserProfile} = useClerk();

    return (
        <div className={`w-64 bg-white border-r border-gray-200 flex flex-col justify-between items-center max-sm:absolute top-0 bottom-0 z-50 ${sidebar ? 'translate-x-0' :'max-sm:-translate-x-full'} transition-all duration-300 ease-in-out shadow-lg`}>
            {/* Top Section */}
            <div className='w-full pt-8 pb-4 px-6'>
                {/* User Profile */}
                <div className='flex flex-col items-center mb-8'>
                    <img 
                        src={user.imageUrl} 
                        alt="User Profile" 
                        className='w-16 h-16 rounded-full mx-auto border-4 border-indigo-100 object-cover shadow-sm hover:border-indigo-200 transition-colors cursor-pointer'
                        onClick={openUserProfile}
                    />
                    <h1 className='mt-3 text-lg font-semibold text-gray-800'>{user.fullName}</h1>
                    <div className='mt-1 px-3 py-1 bg-indigo-50 rounded-full text-xs font-medium text-indigo-600'>
                        <Protect plan='premium' fallback="Free Plan">
                            Premium Plan
                        </Protect>
                    </div>
                </div>

                {/* Navigation Items */}
                <nav className='space-y-1'>
                    {navItems.map(({to,label,Icon}) => (
                        <NavLink 
                            key={to} 
                            to={to} 
                            end={to === '/ai'} 
                            onClick={() => setSidebar(false)}
                            className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            {({isActive}) => (
                                <>
                                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                                    <span className='text-sm font-medium'>{label}</span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>
            </div>

            {/* Bottom Section */}
            <div className='w-full border-t border-gray-200 p-4'>
                <div className='flex items-center justify-between px-3'>
                    <div 
                        onClick={openUserProfile} 
                        className='flex gap-3 items-center cursor-pointer group'
                    >
                        <img 
                            src={user.imageUrl} 
                            className="w-9 h-9 rounded-full border-2 border-white group-hover:border-indigo-100 transition-colors" 
                            alt="User" 
                        />
                        <div>
                            <h1 className='text-sm font-medium text-gray-800'>{user.fullName}</h1>
                            <p className='text-xs text-gray-500'>
                                <Protect plan='premium' fallback="Free">
                                    Premium
                                </Protect>
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={signOut}
                        className='p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-red-500'
                        aria-label="Sign out"
                    >
                        <LogOut className='w-5 h-5'/>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SideBar