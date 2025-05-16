import React from 'react'
import ButtonHov from '../tailwind-custom/ButtonHov'
import NavItem1 from './Nav-Item-Details/NavItem1'
import NavItem2 from './Nav-Item-Details/NavItem2'
import NavItem3 from './Nav-Item-Details/NavItem3'
import NavItem4 from './Nav-Item-Details/NavItem4'
import NavItem5 from './Nav-Item-Details/NavItem5'
import NavItem6 from './Nav-Item-Details/NavItem6'
import NavItem7 from './Nav-Item-Details/NavItem7'

const Navbar = () => {
    

    return (
        <nav className='hidden
            lg:flex mx-auto relative lg:pt-2 lg:pb-4 2xl:max-w-7xl
        '>
            <ul className='flex flex-wrap font-bold text-[15px]'>
                {/* Shop By Categories */}
                <NavItem1 />

                {/* Shop By Room */}
                <NavItem2 />

                {/* Table & Desk */}
                <NavItem3 />

                {/* Chairs & Stools */}
                <NavItem4 />

                {/* Pages */}
                <NavItem5 />

                {/* Theme Features */}
                <NavItem6 />

                {/* On Sale */}
                <NavItem7 />
            </ul>
        </nav>
    )
}

export default Navbar