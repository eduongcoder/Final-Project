import React from 'react'
import clsx from 'clsx'

// 👇 Mapping các màu hover text để Tailwind biết và build sẵn
const ColorSelectiton = {
  defualt: "text-black bg-white",
  // white_black: 'text-black bg-white',
  black_white: 'text-white bg-black',
  amber_black: 'text-black bg-amber-200',
}

const ColorHoverSelectiton = {
  defualt: "hover:before:bg-white hover:text-black",
  black_amber: 'hover:before:bg-black hover:text-amber-200',
  white_black: 'hover:before:bg-white hover:text-black',
}

const ButtonHovCustom = ({
  children, colorSelect, colorHoverSelect
}) => {
  
  return (

    <button
      className={clsx(
        `block relative overflow-hidden rounded-4xl px-5 py-2 transition-all before:absolute 
        before:z-0 before:top-0 before:left-0 before:bottom-0 before:h-full before:w-0 
        before:transition-all before:duration-400  hover:before:left-0 hover:before:w-full`,
        ColorSelectiton[colorSelect],
        ColorHoverSelectiton[colorHoverSelect],
      )}
    >
      <span className="relative font-bold flex items-center gap-x-2 z-10">{children}</span>
    </button>
  )
}

export default ButtonHovCustom