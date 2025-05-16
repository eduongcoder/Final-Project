import React from 'react'
import showHeader from '../hooks/showHeader'
import Topbar from './Header-Components/Topbar';
import SearchHeader from './Header-Components/SearchHeader';
import Navbar from './Header-Components/Navbar';

const Header = () => {
    const showHead = showHeader();

    return (<>
        {/* -[TOPBAR]-------------------------------------------------------------------------- */}
        <Topbar />
        {/* -[TOPBAR - END]-------------------------------------------------------------------- */}


        {/* -[HEADER]-------------------------------------------------------------------------- */}
        <header className={`sticky top-0 bg-white transition-transform duration-300 
            ${showHead ? 'translate-y-0' : '-translate-y-full'}  border-b-[0.5px]  
            border-gray-300 z-50`
        }>
            {/* Trên Desktop */}
            <div className="pt-5 pb-3 mx-auto px-3 gap-2 grid grid-cols-[1fr_1fr]
                max-md:grid-cols-[1fr_1.5fr]
                lg:grid-cols-[auto_auto_1fr]
                2xl:max-w-7xl 
            ">
                {/* Hambergur Menu & Main Logo  */}
                <div className="flex flex-wrap items-center">
                    {/* Hambergur Menu CÓ RESPONSIVE */}
                    <button className='mr-2 lg:hidden'>
                        <span><img className='w-7' src="../src/assets/sub-icon/burger-bar.png" alt="" /></span>
                    </button>
                    {/* Main Logo CÓ RESPONSIVE */}
                    <a href='/' className='flex flex-wrap relative'>
                        <img className='w-24 sm:w-28 md:w-37' src="../src/assets/main-logo/image.png" alt="" />
                    </a>
                </div>

                {/* Thanh tìm kiếm */}
                <div className="hidden lg:block
                    lg:w-[44rem] lg:px-10
                ">
                    <SearchHeader />
                </div>

                {/* Thanh Nav gồm: giỏ hàng, Login/ Register, Find a store*/}
                <div className="w-full">
                    <div className="h-full flex justify-end items-center gap-4 sm:gap-6">
                        <a href="" className='flex '>
                            <svg className="icon icon-location icon--large icon--thick shrink-0" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 20 20" fill="none"><path d="M10 10.625C11.3808 10.625 12.5 9.50575 12.5 8.125C12.5 6.74429 11.3808 5.625 10 5.625C8.61925 5.625 7.5 6.74429 7.5 8.125C7.5 9.50575 8.61925 10.625 10 10.625Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                <path d="M16.25 8.125C16.25 13.75 10 18.125 10 18.125C10 18.125 3.75 13.75 3.75 8.125C3.75 6.46740 4.40848 4.87768 5.58058 3.70558C6.75268 2.53348 8.34242 1.875 10 1.875C11.6576 1.875 13.2473 2.53348 14.4194 3.70558C15.5915 4.87768 16.25 6.46740 16.25 8.125Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                            </svg>

                            <p className='hidden min-sm:block min-lg:hidden max-xl:hidden xl:block'>Find a store</p>
                        </a>
                        <a href="" className='flex'>
                            <svg className="icon icon-account icon--large icon--thick shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="25" height="25">
                                <path d="M12 15C15.3137 15 18 12.3137 18 9C18 5.68629 15.3137 3 12 3C8.68629 3 6 5.68629 6 9C6 12.3137 8.68629 15 12 15Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                <path d="M2.90625 20.2508C3.82775 18.6544 5.15328 17.3287 6.74958 16.407C8.34588 15.4853 10.1567 15 12 15C13.8433 15 15.6541 15.4853 17.2504 16.407C18.8467 17.3287 20.1722 18.6544 21.0938 20.2508" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"></path>
                            </svg>

                            <p className='hidden min-sm:block min-lg:hidden max-xl:hidden xl:block'>Sign in/ Register</p>
                        </a>
                        <a href="" className='sm:bg-gray-200 sm:p-3 sm:rounded-full'>
                            <svg viewBox="0 0 20 20" fill="none" className="icon icon-shopping-bag icon--large icon--thick" xmlns="http://www.w3.org/2000/svg" width="25" height="25">
                                <path d="M16.3804 16.25H3.61947C3.46585 16.25 3.31752 16.1939 3.20241 16.0922C3.0873 15.9904 3.01334 15.8501 2.99447 15.6977L1.88119 6.32267C1.87089 6.2347 1.87941 6.14556 1.90617 6.06113C1.93294 5.9767 1.97734 5.89893 2.03644 5.83296C2.09553 5.767 2.16797 5.71434 2.24896 5.67849C2.32995 5.64264 2.41763 5.62441 2.50619 5.62501H17.4937C17.5823 5.62441 17.6699 5.64264 17.7509 5.67849C17.8319 5.71434 17.9044 5.767 17.9634 5.83296C18.0225 5.89893 18.0669 5.9767 18.0937 6.06113C18.1205 6.14556 18.129 6.2347 18.1187 6.32267L17.0054 15.6977C16.9865 15.8501 16.9126 15.9904 16.7975 16.0922C16.6824 16.1939 16.534 16.25 16.3804 16.25Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                <path d="M6.875 5.625V5C6.875 4.1712 7.20424 3.37634 7.79029 2.79029C8.37634 2.20424 9.1712 1.875 10 1.875C10.8288 1.875 11.6237 2.20424 12.2097 2.79029C12.7958 3.37634 13.125 4.1712 13.125 5V5.625" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                            </svg>
                        </a>
                    </div>
                </div>

            </div>

            {/* Trên Mobile: Thanh tìm kiếm */}
            <div className="pt-2 pb-4 mx-auto px-4 w-full lg:hidden">
                <SearchHeader />
            </div>

            {/* Thanh Nav Menu */}
            <Navbar />
        </header>
        {/* -[HEADER - END]-------------------------------------------------------------------- */}
    </>)
}

export default Header