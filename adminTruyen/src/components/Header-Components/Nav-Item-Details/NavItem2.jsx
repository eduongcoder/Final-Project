import ButtonHov from '@/components/tailwind-custom/ButtonHov'
import React from 'react'

const NavItem2 = () => {
  return (
    <li className='inline-flex items-center'>
      <details className='group'>
        <summary className="px-4 list-none appearance-none marker:hidden">
          <span className='inline-block w-full py-1'>
            <p className="group underline-hover-text flex flex-wrap items-center gap-2">
              Shop By Room
              <svg className="icon icon-caret-down icon--2xs icon--thick" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" width={20} height={20}>
                <path d="M16.25 7.5L10 13.75L3.75 7.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </p>
          </span>
        </summary>

        <div className='w-full fixed left-0 mt-[17px] bg-white z-10 shadow-2xl'>
            <div className="z-50 2xl:max-w-7xl px-4 mx-auto max-w-screen overflow-auto scroll-smooth custom-scrollbar transition-all ">
              <div className="flex flex-wrap">
                <div className="nav-custom-grid flex-1">
                  <div className="mega-menu__column flex flex-col gap-8">
                    <div className="mega-menu__item">
                      <a href="#" className="mega-menu__link">Furniture</a>
                      <ul className='font-medium text-gray-500'>
                        <li className="gap-0.5">
                          <a href="/collections/sofas" className="block mega-menu__link">
                            <span className="reversed-link__text">Sofas</span>
                          </a>
                        </li>
                        <li className="gap-0.5">
                          <a href="/collections/tables-desk" className="block mega-menu__link">
                            <span className="reversed-link__text">Tables &amp; Desks</span>
                          </a>
                        </li><li className="gap-0.5">
                          <a href="/collections/chairs-stool" className="block mega-menu__link">
                            <span className="reversed-link__text">Chair &amp; Stools</span>
                          </a>
                        </li><li className="gap-0.5">
                          <a href="/collections/shelves" className="block mega-menu__link">
                            <span className="reversed-link__text">Shelves</span>
                          </a>
                        </li><li className="gap-0.5">
                          <a href="/collections/all" className="block mega-menu__link">
                            <span className="reversed-link__text">Shop All</span>
                          </a>
                        </li>
                      </ul>
                    </div>
                    <div className="mega-menu__item">
                      <a href="#" className="mega-menu__link">Furniture</a>
                      <ul className='font-medium text-gray-500'>
                        <li className="gap-0.5">
                          <a href="/collections/sofas" className="block mega-menu__link">
                            <span className="reversed-link__text">Sofas</span>
                          </a>
                        </li>
                        <li className="gap-0.5">
                          <a href="/collections/tables-desk" className="block mega-menu__link">
                            <span className="reversed-link__text">Tables &amp; Desks</span>
                          </a>
                        </li><li className="gap-0.5">
                          <a href="/collections/chairs-stool" className="block mega-menu__link">
                            <span className="reversed-link__text">Chair &amp; Stools</span>
                          </a>
                        </li><li className="gap-0.5">
                          <a href="/collections/shelves" className="block mega-menu__link">
                            <span className="reversed-link__text">Shelves</span>
                          </a>
                        </li><li className="gap-0.5">
                          <a href="/collections/all" className="block mega-menu__link">
                            <span className="reversed-link__text">Shop All</span>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="mega-menu__column flex flex-col gap-8">
                    <div className="mega-menu__item">
                      <a href="#" className="mega-menu__link">Furniture</a>
                      <ul className='font-medium text-gray-500'>
                        <li className="gap-0.5">
                          <a href="/collections/sofas" className="block mega-menu__link">
                            <span className="reversed-link__text">Sofas</span>
                          </a>
                        </li>
                        <li className="gap-0.5">
                          <a href="/collections/tables-desk" className="block mega-menu__link">
                            <span className="reversed-link__text">Tables &amp; Desks</span>
                          </a>
                        </li><li className="gap-0.5">
                          <a href="/collections/chairs-stool" className="block mega-menu__link">
                            <span className="reversed-link__text">Chair &amp; Stools</span>
                          </a>
                        </li><li className="gap-0.5">
                          <a href="/collections/shelves" className="block mega-menu__link">
                            <span className="reversed-link__text">Shelves</span>
                          </a>
                        </li><li className="gap-0.5">
                          <a href="/collections/all" className="block mega-menu__link">
                            <span className="reversed-link__text">Shop All</span>
                          </a>
                        </li>
                      </ul>
                    </div>
                    <div className="mega-menu__item">
                      <a href="#" className="mega-menu__link">Furniture</a>
                      <ul className='font-medium text-gray-500'>
                        <li className="gap-0.5">
                          <a href="/collections/sofas" className="block mega-menu__link">
                            <span className="reversed-link__text">Sofas</span>
                          </a>
                        </li>
                        <li className="gap-0.5">
                          <a href="/collections/tables-desk" className="block mega-menu__link">
                            <span className="reversed-link__text">Tables &amp; Desks</span>
                          </a>
                        </li><li className="gap-0.5">
                          <a href="/collections/chairs-stool" className="block mega-menu__link">
                            <span className="reversed-link__text">Chair &amp; Stools</span>
                          </a>
                        </li><li className="gap-0.5">
                          <a href="/collections/shelves" className="block mega-menu__link">
                            <span className="reversed-link__text">Shelves</span>
                          </a>
                        </li><li className="gap-0.5">
                          <a href="/collections/all" className="block mega-menu__link">
                            <span className="reversed-link__text">Shop All</span>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="mega-menu__column flex flex-col gap-8">
                    <div className="mega-menu__item">
                      <a href="#" className="mega-menu__link">Furniture</a>
                      <ul className='font-medium text-gray-500'>
                        <li className="gap-0.5">
                          <a href="/collections/sofas" className="block mega-menu__link">
                            <span className="reversed-link__text">Sofas</span>
                          </a>
                        </li>
                        <li className="gap-0.5">
                          <a href="/collections/tables-desk" className="block mega-menu__link">
                            <span className="reversed-link__text">Tables &amp; Desks</span>
                          </a>
                        </li><li className="gap-0.5">
                          <a href="/collections/chairs-stool" className="block mega-menu__link">
                            <span className="reversed-link__text">Chair &amp; Stools</span>
                          </a>
                        </li><li className="gap-0.5">
                          <a href="/collections/shelves" className="block mega-menu__link">
                            <span className="reversed-link__text">Shelves</span>
                          </a>
                        </li><li className="gap-0.5">
                          <a href="/collections/all" className="block mega-menu__link">
                            <span className="reversed-link__text">Shop All</span>
                          </a>
                        </li>
                      </ul>
                    </div>
                    <div className="mega-menu__item">
                      <a href="#" className="mega-menu__link">Furniture</a>
                      <ul className='font-medium text-gray-500'>
                        <li className="gap-0.5">
                          <a href="/collections/sofas" className="block mega-menu__link">
                            <span className="reversed-link__text">Sofas</span>
                          </a>
                        </li>
                        <li className="gap-0.5">
                          <a href="/collections/tables-desk" className="block mega-menu__link">
                            <span className="reversed-link__text">Tables &amp; Desks</span>
                          </a>
                        </li><li className="gap-0.5">
                          <a href="/collections/chairs-stool" className="block mega-menu__link">
                            <span className="reversed-link__text">Chair &amp; Stools</span>
                          </a>
                        </li><li className="gap-0.5">
                          <a href="/collections/shelves" className="block mega-menu__link">
                            <span className="reversed-link__text">Shelves</span>
                          </a>
                        </li><li className="gap-0.5">
                          <a href="/collections/all" className="block mega-menu__link">
                            <span className="reversed-link__text">Shop All</span>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="mega-menu__column flex flex-col gap-8">
                    <div className="mega-menu__item">
                      <a href="#" className="mega-menu__link">Furniture</a>
                      <ul className='font-medium text-gray-500'>
                        <li className="gap-0.5">
                          <a href="/collections/sofas" className="block mega-menu__link">
                            <span className="reversed-link__text">Sofas</span>
                          </a>
                        </li>
                        <li className="gap-0.5">
                          <a href="/collections/tables-desk" className="block mega-menu__link">
                            <span className="reversed-link__text">Tables &amp; Desks</span>
                          </a>
                        </li><li className="gap-0.5">
                          <a href="/collections/chairs-stool" className="block mega-menu__link">
                            <span className="reversed-link__text">Chair &amp; Stools</span>
                          </a>
                        </li><li className="gap-0.5">
                          <a href="/collections/shelves" className="block mega-menu__link">
                            <span className="reversed-link__text">Shelves</span>
                          </a>
                        </li><li className="gap-0.5">
                          <a href="/collections/all" className="block mega-menu__link">
                            <span className="reversed-link__text">Shop All</span>
                          </a>
                        </li>
                      </ul>
                    </div>
                    <div className="mega-menu__item">
                      <a href="#" className="mega-menu__link">Furniture</a>
                      <ul className='font-medium text-gray-500'>
                        <li className="gap-0.5">
                          <a href="/collections/sofas" className="block mega-menu__link">
                            <span className="reversed-link__text">Sofas</span>
                          </a>
                        </li>
                        <li className="gap-0.5">
                          <a href="/collections/tables-desk" className="block mega-menu__link">
                            <span className="reversed-link__text">Tables &amp; Desks</span>
                          </a>
                        </li><li className="gap-0.5">
                          <a href="/collections/chairs-stool" className="block mega-menu__link">
                            <span className="reversed-link__text">Chair &amp; Stools</span>
                          </a>
                        </li><li className="gap-0.5">
                          <a href="/collections/shelves" className="block mega-menu__link">
                            <span className="reversed-link__text">Shelves</span>
                          </a>
                        </li><li className="gap-0.5">
                          <a href="/collections/all" className="block mega-menu__link">
                            <span className="reversed-link__text">Shop All</span>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>

                </div>
                {/* -[RECOMMENDATION PICTURE]--------------------------------------*/}
                <div className="nav-promotion-custom nav-promotion-custom-grid pl-[30px] pt-[30px] pb-[60px]">
                  <div className="">
                    <a href="#">

                      <div className="grid grid-cols-[1fr] overflow-hidden relative">
                        <div className="overflow-hidden block w-full h-full">
                          <img className='rounded-md' src="https://hyper-garace.myshopify.com/cdn/shop/files/collection-menu-banner.jpg?v=1734424636&width=1100" alt="" />
                        </div>
                        <div className="content-overlay">
                          <p className="text-center mb-4 text-xl"> Home&Decor </p>
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
  )
}

export default NavItem2