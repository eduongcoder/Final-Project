import ButtonHov from "@/components/tailwind-custom/ButtonHov";
import React from "react";

const NavItem1 = () => {
    return (
        <>
            {/* Shop By Categories */}
            <li className="inline-flex items-center">
                <details className="group" open>
                    <summary className="list-none appearance-none px-4 marker:hidden">
                        <span className="inline-block w-full py-1">
                            <p className="group underline-hover-text flex flex-wrap items-center gap-2">
                                Shop By Categories
                                <svg
                                    className="icon icon-caret-down icon--2xs icon--thick"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width={20}
                                    height={20}
                                >
                                    <path
                                        d="M16.25 7.5L10 13.75L3.75 7.5"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    ></path>
                                </svg>
                            </p>
                        </span>
                    </summary>

                    <div className="fixed left-0 z-10 mt-[17px] hidden w-full bg-white shadow-2xl group-hover:block">
                        <div className="custom-scrollbar z-50 mx-auto max-w-screen overflow-auto scroll-smooth px-4 transition-all 2xl:max-w-7xl">
                            <div className="flex flex-wrap">
                                <div className="nav-custom-grid flex-1">
                                    <div className="mega-menu__column flex flex-col gap-8">
                                        <div className="mega-menu__item">
                                            <a
                                                href="#"
                                                className="mega-menu__link"
                                            >
                                                Furniture
                                            </a>
                                            <ul className="font-medium text-gray-500">
                                                <li className="gap-0.5">
                                                    <a
                                                        href="/collections/sofas"
                                                        className="mega-menu__link block"
                                                    >
                                                        <span className="reversed-link__text">Sofas</span>
                                                    </a>
                                                </li>
                                                <li className="gap-0.5">
                                                    <a
                                                        href="/collections/tables-desk"
                                                        className="mega-menu__link block"
                                                    >
                                                        <span className="reversed-link__text">Tables &amp; Desks</span>
                                                    </a>
                                                </li>
                                                <li className="gap-0.5">
                                                    <a
                                                        href="/collections/chairs-stool"
                                                        className="mega-menu__link block"
                                                    >
                                                        <span className="reversed-link__text">Chair &amp; Stools</span>
                                                    </a>
                                                </li>
                                                <li className="gap-0.5">
                                                    <a
                                                        href="/collections/shelves"
                                                        className="mega-menu__link block"
                                                    >
                                                        <span className="reversed-link__text">Shelves</span>
                                                    </a>
                                                </li>
                                                <li className="gap-0.5">
                                                    <a
                                                        href="/collections/all"
                                                        className="mega-menu__link block"
                                                    >
                                                        <span className="reversed-link__text">Shop All</span>
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="mega-menu__item">
                                            <a
                                                href="#"
                                                className="mega-menu__link"
                                            >
                                                Furniture
                                            </a>
                                            <ul className="font-medium text-gray-500">
                                                <li className="gap-0.5">
                                                    <a
                                                        href="/collections/sofas"
                                                        className="mega-menu__link block"
                                                    >
                                                        <span className="reversed-link__text">Sofas</span>
                                                    </a>
                                                </li>
                                                <li className="gap-0.5">
                                                    <a
                                                        href="/collections/tables-desk"
                                                        className="mega-menu__link block"
                                                    >
                                                        <span className="reversed-link__text">Tables &amp; Desks</span>
                                                    </a>
                                                </li>
                                                <li className="gap-0.5">
                                                    <a
                                                        href="/collections/chairs-stool"
                                                        className="mega-menu__link block"
                                                    >
                                                        <span className="reversed-link__text">Chair &amp; Stools</span>
                                                    </a>
                                                </li>
                                                <li className="gap-0.5">
                                                    <a
                                                        href="/collections/shelves"
                                                        className="mega-menu__link block"
                                                    >
                                                        <span className="reversed-link__text">Shelves</span>
                                                    </a>
                                                </li>
                                                <li className="gap-0.5">
                                                    <a
                                                        href="/collections/all"
                                                        className="mega-menu__link block"
                                                    >
                                                        <span className="reversed-link__text">Shop All</span>
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="mega-menu__column flex flex-col gap-8">
                                        <div className="mega-menu__item">
                                            <a
                                                href="#"
                                                className="mega-menu__link"
                                            >
                                                Furniture
                                            </a>
                                            <ul className="font-medium text-gray-500">
                                                <li className="gap-0.5">
                                                    <a
                                                        href="/collections/sofas"
                                                        className="mega-menu__link block"
                                                    >
                                                        <span className="reversed-link__text">Sofas</span>
                                                    </a>
                                                </li>
                                                <li className="gap-0.5">
                                                    <a
                                                        href="/collections/tables-desk"
                                                        className="mega-menu__link block"
                                                    >
                                                        <span className="reversed-link__text">Tables &amp; Desks</span>
                                                    </a>
                                                </li>
                                                <li className="gap-0.5">
                                                    <a
                                                        href="/collections/chairs-stool"
                                                        className="mega-menu__link block"
                                                    >
                                                        <span className="reversed-link__text">Chair &amp; Stools</span>
                                                    </a>
                                                </li>
                                                <li className="gap-0.5">
                                                    <a
                                                        href="/collections/shelves"
                                                        className="mega-menu__link block"
                                                    >
                                                        <span className="reversed-link__text">Shelves</span>
                                                    </a>
                                                </li>
                                                <li className="gap-0.5">
                                                    <a
                                                        href="/collections/all"
                                                        className="mega-menu__link block"
                                                    >
                                                        <span className="reversed-link__text">Shop All</span>
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="mega-menu__item">
                                            <a
                                                href="#"
                                                className="mega-menu__link"
                                            >
                                                Furniture
                                            </a>
                                            <ul className="font-medium text-gray-500">
                                                <li className="gap-0.5">
                                                    <a
                                                        href="/collections/sofas"
                                                        className="mega-menu__link block"
                                                    >
                                                        <span className="reversed-link__text">Sofas</span>
                                                    </a>
                                                </li>
                                                <li className="gap-0.5">
                                                    <a
                                                        href="/collections/tables-desk"
                                                        className="mega-menu__link block"
                                                    >
                                                        <span className="reversed-link__text">Tables &amp; Desks</span>
                                                    </a>
                                                </li>
                                                <li className="gap-0.5">
                                                    <a
                                                        href="/collections/chairs-stool"
                                                        className="mega-menu__link block"
                                                    >
                                                        <span className="reversed-link__text">Chair &amp; Stools</span>
                                                    </a>
                                                </li>
                                                <li className="gap-0.5">
                                                    <a
                                                        href="/collections/shelves"
                                                        className="mega-menu__link block"
                                                    >
                                                        <span className="reversed-link__text">Shelves</span>
                                                    </a>
                                                </li>
                                                <li className="gap-0.5">
                                                    <a
                                                        href="/collections/all"
                                                        className="mega-menu__link block"
                                                    >
                                                        <span className="reversed-link__text">Shop All</span>
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="mega-menu__column flex flex-col gap-8">
                                        <div className="mega-menu__item">
                                            <a
                                                href="#"
                                                className="mega-menu__link"
                                            >
                                                Furniture
                                            </a>
                                            <ul className="font-medium text-gray-500">
                                                <li className="gap-0.5">
                                                    <a
                                                        href="/collections/sofas"
                                                        className="mega-menu__link block"
                                                    >
                                                        <span className="reversed-link__text">Sofas</span>
                                                    </a>
                                                </li>
                                                <li className="gap-0.5">
                                                    <a
                                                        href="/collections/tables-desk"
                                                        className="mega-menu__link block"
                                                    >
                                                        <span className="reversed-link__text">Tables &amp; Desks</span>
                                                    </a>
                                                </li>
                                                <li className="gap-0.5">
                                                    <a
                                                        href="/collections/chairs-stool"
                                                        className="mega-menu__link block"
                                                    >
                                                        <span className="reversed-link__text">Chair &amp; Stools</span>
                                                    </a>
                                                </li>
                                                <li className="gap-0.5">
                                                    <a
                                                        href="/collections/shelves"
                                                        className="mega-menu__link block"
                                                    >
                                                        <span className="reversed-link__text">Shelves</span>
                                                    </a>
                                                </li>
                                                <li className="gap-0.5">
                                                    <a
                                                        href="/collections/all"
                                                        className="mega-menu__link block"
                                                    >
                                                        <span className="reversed-link__text">Shop All</span>
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="mega-menu__item">
                                            <a
                                                href="#"
                                                className="mega-menu__link"
                                            >
                                                Furniture
                                            </a>
                                            <ul className="font-medium text-gray-500">
                                                <li className="gap-0.5">
                                                    <a
                                                        href="/collections/sofas"
                                                        className="mega-menu__link block"
                                                    >
                                                        <span className="reversed-link__text">Sofas</span>
                                                    </a>
                                                </li>
                                                <li className="gap-0.5">
                                                    <a
                                                        href="/collections/tables-desk"
                                                        className="mega-menu__link block"
                                                    >
                                                        <span className="reversed-link__text">Tables &amp; Desks</span>
                                                    </a>
                                                </li>
                                                <li className="gap-0.5">
                                                    <a
                                                        href="/collections/chairs-stool"
                                                        className="mega-menu__link block"
                                                    >
                                                        <span className="reversed-link__text">Chair &amp; Stools</span>
                                                    </a>
                                                </li>
                                                <li className="gap-0.5">
                                                    <a
                                                        href="/collections/shelves"
                                                        className="mega-menu__link block"
                                                    >
                                                        <span className="reversed-link__text">Shelves</span>
                                                    </a>
                                                </li>
                                                <li className="gap-0.5">
                                                    <a
                                                        href="/collections/all"
                                                        className="mega-menu__link block"
                                                    >
                                                        <span className="reversed-link__text">Shop All</span>
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="mega-menu__column flex flex-col gap-8">
                                        <div className="mega-menu__item">
                                            <a
                                                href="#"
                                                className="mega-menu__link"
                                            >
                                                Furniture
                                            </a>
                                            <ul className="font-medium text-gray-500">
                                                <li className="gap-0.5">
                                                    <a
                                                        href="/collections/sofas"
                                                        className="mega-menu__link block"
                                                    >
                                                        <span className="reversed-link__text">Sofas</span>
                                                    </a>
                                                </li>
                                                <li className="gap-0.5">
                                                    <a
                                                        href="/collections/tables-desk"
                                                        className="mega-menu__link block"
                                                    >
                                                        <span className="reversed-link__text">Tables &amp; Desks</span>
                                                    </a>
                                                </li>
                                                <li className="gap-0.5">
                                                    <a
                                                        href="/collections/chairs-stool"
                                                        className="mega-menu__link block"
                                                    >
                                                        <span className="reversed-link__text">Chair &amp; Stools</span>
                                                    </a>
                                                </li>
                                                <li className="gap-0.5">
                                                    <a
                                                        href="/collections/shelves"
                                                        className="mega-menu__link block"
                                                    >
                                                        <span className="reversed-link__text">Shelves</span>
                                                    </a>
                                                </li>
                                                <li className="gap-0.5">
                                                    <a
                                                        href="/collections/all"
                                                        className="mega-menu__link block"
                                                    >
                                                        <span className="reversed-link__text">Shop All</span>
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="mega-menu__item">
                                            <a
                                                href="#"
                                                className="mega-menu__link"
                                            >
                                                Furniture
                                            </a>
                                            <ul className="font-medium text-gray-500">
                                                <li className="gap-0.5">
                                                    <a
                                                        href="/collections/sofas"
                                                        className="mega-menu__link block"
                                                    >
                                                        <span className="reversed-link__text">Sofas</span>
                                                    </a>
                                                </li>
                                                <li className="gap-0.5">
                                                    <a
                                                        href="/collections/tables-desk"
                                                        className="mega-menu__link block"
                                                    >
                                                        <span className="reversed-link__text">Tables &amp; Desks</span>
                                                    </a>
                                                </li>
                                                <li className="gap-0.5">
                                                    <a
                                                        href="/collections/chairs-stool"
                                                        className="mega-menu__link block"
                                                    >
                                                        <span className="reversed-link__text">Chair &amp; Stools</span>
                                                    </a>
                                                </li>
                                                <li className="gap-0.5">
                                                    <a
                                                        href="/collections/shelves"
                                                        className="mega-menu__link block"
                                                    >
                                                        <span className="reversed-link__text">Shelves</span>
                                                    </a>
                                                </li>
                                                <li className="gap-0.5">
                                                    <a
                                                        href="/collections/all"
                                                        className="mega-menu__link block"
                                                    >
                                                        <span className="reversed-link__text">Shop All</span>
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                {/* -[RECOMMENDATION PICTURE]--------------------------------------*/}
                                <div className="nav-promotion-custom nav-promotion-custom-grid pt-[30px] pb-[60px] pl-[30px]">
                                    <div className="">
                                        <a href="#">
                                            <div className="relative grid grid-cols-[1fr] overflow-hidden">
                                                <div className="block h-full w-full overflow-hidden">
                                                    <img
                                                        className="rounded-md"
                                                        src="https://hyper-garace.myshopify.com/cdn/shop/files/collection-menu-banner.jpg?v=1734424636&width=1100"
                                                        alt=""
                                                    />
                                                </div>
                                                <div className="content-overlay">
                                                    <p className="mb-4 text-center text-xl"> Home&Decor </p>
                                                    <p className="text-center text-3xl"> Decoration From $10 </p>
                                                    <div className="mt-8 flex flex-1 items-end">
                                                        <p className="">
                                                            <ButtonHov />
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                                {/* -[RECOMMENDATION PICTURE]--------------------------------------*/}
                            </div>
                        </div>
                    </div>
                </details>
            </li>
        </>
    );
};

export default NavItem1;
