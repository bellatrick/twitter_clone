import { BellIcon, InboxIcon, SearchIcon } from '@heroicons/react/outline';
import { HomeIcon } from '@heroicons/react/solid';
import { useSession } from 'next-auth/react';
import React from 'react'

const MobileNav = () => {
    const { data: session }: any = useSession();
    return (
        <div className="border-t bg-black px-8 z-200 border-gray-700 fixed left-0 bottom-0 w-full flex justify-between items-center sm:hidden h-16">
          <div className="h-11 w-11 flex justify-center items-center hoverAnimation">
            <HomeIcon className="text-white h-6" />
          </div>
          <div className="h-11 w-11 flex justify-center items-center hoverAnimation">
            <SearchIcon className="text-white h-6" />
          </div>
          <div className="h-11 w-11 flex justify-center items-center hoverAnimation">
            <BellIcon className="text-white h-6" />
          </div>
          <div className="h-11 w-11 flex justify-center items-center hoverAnimation">
            <InboxIcon className="text-white h-6" />
          </div>
          <div className="h8 w-8 rounded-full flex justify-center items-center">
          <img className="rounded-full w-full" src={`${session.user?.image}`} alt="" />
          </div>
        </div>
    )
}

export default MobileNav
