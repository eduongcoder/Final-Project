import React from 'react'

const SearchHeader = () => {
    return (
        <form className="items-center gap-2 rounded-full bg-gray-200 flex">
            <div className="relative flex items-center">
                <select id="categories" className="border-2 border-transparent text-gray-900 bg-gray-200 rounded-full
                                appearance-none
                                focus:bg-white focus:border-black block py-3 px-5 w-17 md:w-40 font-bold text-md
                            ">
                    <option value=""> All categories </option>
                    <option value=""> United States </option>
                    <option value=""> Canada </option>
                    <option value=""> France </option>
                    <option value=""> Germany </option>
                </select>

                <svg className="w-5 absolute right-2 pointer-events-none" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.25 7.5L10 13.75L3.75 7.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
            </div>

            <div className='w-full flex items-center border-l border-gray-400 pl-2'>
                <input type="text"
                    className="bg-transparent outline-none w-full"
                    placeholder="What are you looking for?"
                />
            </div>
        </form>
    )
}

export default SearchHeader