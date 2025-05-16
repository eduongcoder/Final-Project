import React from "react";

const NavItem7 = () => {
    return (
        <>
            <li className="relative inline-flex items-center text-red-500">
                <details className="group">
                    <summary className="list-none appearance-none px-4 marker:hidden">
                        <span className="inline-block w-full py-1">
                            <p className="group underline-hover-text flex flex-wrap items-center gap-2">On Sale</p>
                        </span>
                        {/* Star Twinkle */}
                        <div>
                            <span className="animate-fade-in-scale-delay-1 absolute top-1 left-0">
                                <img
                                    className="filter-red w-3"
                                    src="./src/assets/sub-icon/sparkle.png"
                                    alt=""
                                />
                            </span>
                            <span className="animate-fade-in-scale-delay-2 absolute top-0 right-1">
                                <img
                                    className="filter-red w-3"
                                    src="./src/assets/sub-icon/sparkle.png"
                                    alt=""
                                />
                            </span>
                            <span className="animate-fade-in-scale-delay-3 absolute top-5 right-2">
                                <img
                                    className="filter-red w-3"
                                    src="./src/assets/sub-icon/sparkle.png"
                                    alt=""
                                />
                            </span>
                        </div>
                    </summary>

                    <div className="">Hello</div>
                </details>
            </li>
        </>
    );
};

export default NavItem7;
