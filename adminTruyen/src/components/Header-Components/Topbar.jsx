import React from 'react'

const Topbar = () => {
    return (
        <div className="bg-[#1D349A] ">
            <div className="px-4 py-[9px] text-[1rem] text-white mx-auto
                    lg:grid lg:grid-cols-3 lg:gap-3
                    2xl:max-w-7xl
                ">
                <ul className='hidden
                        lg:flex lg:flex-wrap lg:gap-5
                    '>
                    <li>Help Center</li>
                    <li>Find a Store</li>
                    <li>Contact</li>
                </ul>

                <p className='text-center'> ✌🏼 Free Express Shipping on orders $500! </p>

                <ul className='hidden 
                        lg:flex lg:flex-wrap lg:justify-end lg:items-center lg:gap-4 
                    '>
                    <li className='w-4'><span><img className='invert' src="../src/assets/social-logo/facebook.png" alt="" /></span></li>
                    <li className='w-4'><span><img className='invert' src="../src/assets/social-logo/twitter.png" alt="" /></span></li>
                    <li className='w-4'><span><img className='invert' src="../src/assets/social-logo/instagram.png" alt="" /></span></li>
                    <li className='w-4'><span><img className='invert' src="../src/assets/social-logo/tik-tok.png" alt="" /></span></li>
                </ul>
            </div>
        </div>
    )
}

export default Topbar