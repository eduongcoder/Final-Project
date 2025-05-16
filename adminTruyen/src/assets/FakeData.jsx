// #region [Footer Contact]------------------------------------------------------------
// #endregion [Footer Contact]---------------------------------------------------------

// [2. CATEGORY LIST]----------------------------------------------------------------------------------------------------------
export const categoryList = [
    { id: 0, name: "Sale Items", url: "src/assets/category-menu/collection-sales.png" },
    { id: 1, name: "Press Tables", url: "src/assets/category-menu/Turn-Table-Mono.png" },
    { id: 2, name: "Lighting", url: "src/assets/category-menu/Pendantlamp-1.png" },
    { id: 3, name: "Spoke Sofa", url: "src/assets/category-menu/Spoke-Sofa-Basic.png" },
    { id: 4, name: "Storage", url: "src/assets/category-menu/Curve-Coat-Rack-Shelf.png" },
    { id: 5, name: "Turn Chairs", url: "src/assets/category-menu/Arc-Chair-dark.png" },
    { id: 6, name: "Longe Chairs", url: "src/assets/category-menu/Turn-chair-Warm.png" },
    { id: 7, name: "Curve Coat", url: "src/assets/category-menu/Curve-Coat-Rack.png" },
    { id: 8, name: "Bend Chairs", url: "src/assets/category-menu/Turn-chair-colorful.png" },
    { id: 9, name: "Accessories", url: "src/assets/category-menu/bottlegrinder.png" },
    { id: 10, name: "Cross Tables", url: "src/assets/category-menu/Cross-Table-dark_b9e51138-56b9-45fa-a3a6-89b1f918425a.png" },
    { id: 11, name: "Bar Chairs", url: "src/assets/category-menu/Arc-Chair-dark.png" },
];
// [2. CATEGORY LIST - END]----------------------------------------------------------------------------------------------------

// [3. HERO LIST]-------------------------------------------------------------------------------------------------------------
export const HeroList = [
    {
        id: 0,
        txt1: "Cotton Made",
        txt2: "New Season July",
        url_desk: "src/assets/hero-swiper/slideshow-1.png",
        url_mobile: "src/assets/hero-swiper/slideshow-1--mb.png",
    },
    {
        id: 1,
        txt1: "Modern Elegance",
        txt2: "Spoke Sofa",
        url_desk: "src/assets/hero-swiper/slideshow-2.png",
        url_mobile: "src/assets/hero-swiper/slideshow-2--mb.png",
    },
];
// [3. HERO LIST - END]-------------------------------------------------------------------------------------------------------

// [4. ALBUM SWIPER]----------------------------------------------------------------------------------------------------------
export const AlbumSwiperData = [
    {
        id: 0,
        title: "Welcome Home",
        url: "src/assets/GetInspiredbySpaces/lookbook-slider-1.png",
        description:
            "lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ",
        categories: ["Travel", "History"],
    },
    {
        id: 1,
        title: "Welcome Home",
        url: "src/assets/GetInspiredbySpaces/lookbook-slider-1.png",
        description:
            "lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ",
        categories: ["Travel", "History"],
    },
    {
        id: 2,
        title: "Welcome Home",
        url: "src/assets/GetInspiredbySpaces/lookbook-slider-1.png",
        description:
            "lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ",
        categories: ["Travel", "History"],
    },
    {
        id: 3,
        title: "Welcome Home",
        url: "src/assets/GetInspiredbySpaces/lookbook-slider-1.png",
        description:
            "lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ",
        categories: ["Travel", "History"],
    },
    {
        id: 4,
        title: "Welcome Home",
        url: "src/assets/GetInspiredbySpaces/lookbook-slider-1.png",
        description:
            "lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ",
        categories: ["Travel", "History"],
    },
    {
        id: 5,
        title: "Welcome Home",
        url: "src/assets/GetInspiredbySpaces/lookbook-slider-1.png",
        description:
            "lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ",
        categories: ["Travel", "History"],
    },
];
// [4. ALBUM SWIPER - END]----------------------------------------------------------------------------------------------------

// [5. FEATURE SECTION]-------------------------------------------------------------------------------------------------------
export const FeatureSectionData = [
    {
        id: 0,
        title: "Comfortable",
        description: "Bow Chair is available in Natural or Black-stained Oak with full EU Ecolabel certification.",
        url: "src/assets/FeatureSection/multicolumn-1.png",
    },
    {
        id: 1,
        title: "Price transparency",
        description: "Fair pricing ensures you know exactly what you’re paying for, with no hidden costs or markups.",
        url: "src/assets/FeatureSection/multicolumn-2.png",
    },
    {
        id: 2,
        title: "All eco-certified",
        description: "All products consider a more holistic environmental impact and are designed for a longer lifetime in a way.",
        url: "src/assets/FeatureSection/multicolumn-3.png",
    },
    {
        id: 3,
        title: "Sustainability",
        description: "Committed to sustainable practices, ethical sourcing, and reducing environmental impact.",
        url: "src/assets/FeatureSection/multicolumn-4.png",
    },
];
// [5. FEATURE SECTION - END]-------------------------------------------------------------------------------------------------

// [6. NEW ARRIVALS]----------------------------------------------------------------------------------------------------------
// 6.1: TABS:
export const NewArrivalsTabs = {
    NewArrivals: {
        label: "New Arrivals",
        content: (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="rounded p-4">Sản phẩm mới 1</div>
                <div className="rounded p-4">Sản phẩm mới 2</div>
                <div className="rounded p-4">Sản phẩm mới 3</div>
                <div className="rounded p-4">Sản phẩm mới 4</div>
            </div>
        ),
    },
    HotItems: {
        label: "Hot Items",
        content: (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="rounded p-4">Sản phẩm hot 1</div>
                <div className="rounded p-4">Sản phẩm hot 2</div>
                <div className="rounded p-4">Sản phẩm hot 3</div>
                <div className="rounded p-4">Sản phẩm hot 4</div>
            </div>
        ),
    },
};

// [6. NEW ARRIVALS - END]----------------------------------------------------------------------------------------------------

// #region [Footer Contact]---------------------------------------------------------
export const FooterContact = [
    {
        id: 0,
        headingContact: "Customer Service",
        svgHTML:
            '<svg className="icon icon-chat icon--medium icon--thick shrink-0" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 20 20" fill="none"><path d="M10 10.3125C10.5178 10.3125 10.9375 9.89277 10.9375 9.375C10.9375 8.85723 10.5178 8.4375 10 8.4375C9.48223 8.4375 9.0625 8.85723 9.0625 9.375C9.0625 9.89277 9.48223 10.3125 10 10.3125Z" fill="currentColor"></path><path d="M6.5625 10.3125C7.08027 10.3125 7.5 9.89277 7.5 9.375C7.5 8.85723 7.08027 8.4375 6.5625 8.4375C6.04473 8.4375 5.625 8.85723 5.625 9.375C5.625 9.89277 6.04473 10.3125 6.5625 10.3125Z" fill="currentColor"></path><path d="M13.4375 10.3125C13.9553 10.3125 14.375 9.89277 14.375 9.375C14.375 8.85723 13.9553 8.4375 13.4375 8.4375C12.9197 8.4375 12.5 8.85723 12.5 9.375C12.5 9.89277 12.9197 10.3125 13.4375 10.3125Z" fill="currentColor"></path><path d="M8.20859 15L9.45859 17.1875C9.51322 17.2833 9.59222 17.363 9.68758 17.4184C9.78294 17.4738 9.89127 17.503 10.0016 17.503C10.1119 17.503 10.2202 17.4738 10.3155 17.4184C10.4109 17.363 10.4899 17.2833 10.5445 17.1875L11.7945 15H16.875C17.0408 15 17.1997 14.9342 17.3169 14.8169C17.4342 14.6997 17.5 14.5408 17.5 14.375V4.375C17.5 4.20924 17.4342 4.05027 17.3169 3.93306C17.1997 3.81585 17.0408 3.75 16.875 3.75H3.125C2.95924 3.75 2.80027 3.81585 2.68306 3.93306C2.56585 4.05027 2.5 4.20924 2.5 4.375V14.375C2.5 14.5408 2.56585 14.6997 2.68306 14.8169C2.80027 14.9342 2.95924 15 3.125 15H8.20859Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path></svg>',
        text: "Mon-Sat, 9am-6pm EST.",
    },
    {
        id: 1,
        headingContact: "Call Us",
        svgHTML:
            '<svg className="icon icon-phone icon--medium icon--thick shrink-0" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 20 20" fill="none"><path d="M12.843 11.3544C12.9295 11.2968 13.0291 11.2617 13.1326 11.2523C13.2362 11.2429 13.3404 11.2594 13.4359 11.3005L17.1203 12.9512C17.2445 13.0043 17.3481 13.0962 17.4157 13.2131C17.4833 13.3299 17.5112 13.4656 17.4953 13.5997C17.3739 14.5067 16.9273 15.3389 16.2383 15.9413C15.5494 16.5437 14.6652 16.8754 13.75 16.8747C10.9321 16.8747 8.22957 15.7553 6.23699 13.7627C4.24442 11.7701 3.125 9.0676 3.125 6.24968C3.1243 5.33452 3.456 4.45026 4.05841 3.76134C4.66082 3.07242 5.49293 2.62574 6.4 2.50436C6.53409 2.48844 6.66973 2.51636 6.78662 2.58396C6.90351 2.65156 6.99537 2.7552 7.04844 2.87936L8.69922 6.56686C8.73978 6.66157 8.7563 6.76484 8.7473 6.86748C8.7383 6.97012 8.70407 7.06894 8.64766 7.15515L6.97813 9.1403C6.9189 9.22966 6.88388 9.33286 6.87649 9.43981C6.86909 9.54676 6.88958 9.6538 6.93594 9.75046C7.58203 11.0731 8.94922 12.4239 10.2758 13.0637C10.373 13.1099 10.4805 13.1299 10.5878 13.1218C10.695 13.1138 10.7983 13.0778 10.8875 13.0176L12.843 11.3544Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path></svg>',
        text: "+1888-234-1234 (tool-free)",
    },
    {
        id: 2,
        headingContact: "Get in Touch",
        svgHTML:
            '<svg className="icon icon-paperplane icon--medium icon--thick shrink-0" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 20 20" fill="none"><path d="M10 9.42969V14.4297" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path><path d="M10.0006 14.3746L17.2881 16.8363C17.4081 16.8802 17.5387 16.8863 17.6623 16.8537C17.7859 16.8212 17.8965 16.7515 17.9793 16.6541C18.0621 16.5567 18.113 16.4362 18.1251 16.309C18.1373 16.1818 18.1102 16.0539 18.0475 15.9425L10.5405 2.81754C10.4864 2.71985 10.4072 2.63842 10.311 2.58172C10.2148 2.52502 10.1052 2.49512 9.99358 2.49512C9.88194 2.49512 9.77233 2.52502 9.67616 2.58172C9.57998 2.63842 9.50076 2.71985 9.44671 2.81754L1.95843 15.9425C1.89634 16.0536 1.8696 16.1809 1.88178 16.3075C1.89396 16.4341 1.94448 16.554 2.02658 16.6511C2.10869 16.7482 2.21849 16.818 2.3413 16.8511C2.46411 16.8842 2.5941 16.879 2.71389 16.8363L10.0006 14.3746Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path></svg>',
        text: "touch@garacestore.com",
    },
    {
        id: 3,
        headingContact: "Address",
        svgHTML:
            '<svg className="icon icon-map-pin icon--medium icon--thick shrink-0" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 20 20" fill="none"><path d="M10 10.625C11.3807 10.625 12.5 9.50571 12.5 8.125C12.5 6.74429 11.3807 5.625 10 5.625C8.61929 5.625 7.5 6.74429 7.5 8.125C7.5 9.50571 8.61929 10.625 10 10.625Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M16.25 8.125C16.25 13.75 10 18.125 10 18.125C10 18.125 3.75 13.75 3.75 8.125C3.75 6.4674 4.40848 4.87769 5.58058 3.70558C6.75269 2.53348 8.3424 1.875 10 1.875C11.6576 1.875 13.2473 2.53348 14.4194 3.70558C15.5915 4.87769 16.25 6.4674 16.25 8.125Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>',
        text: "382 NE 191st St # 87394 Miami",
    },
];
export const FooterList = [
    {
        id: 0,
        footerHeading: "Company",
        footerList: ["About us", "Contact", "FAQs", "Blog", "Find a Store"],
    },
    {
        id: 1,
        footerHeading: "Collection",
        footerList: ["Tables", "Bow Chairs", "Turn Table", "Turn Chair", "Cross Bar Chair"],
    },
    {
        id: 2,
        footerHeading: "Shop",
        footerList: ["Sofas", "Outdoor", "Seating", "Lighting", "Accessories"],
    },
];
export const FooterSocial = [
    {
        id: 0,
        svgHTML: `<svg width="20" height="20" aria-hidden="true" focusable="false" role="presentation" className="icon icon-facebook icon--large" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M9.1875 13.5223V21H13.2656V13.5223H16.3066L16.9395 10.084H13.2656V8.86758C13.2656 7.05 13.9793 6.35391 15.8215 6.35391C16.3945 6.35391 16.8551 6.36797 17.1223 6.39609V3.27773C16.6195 3.14062 15.3891 3 14.6789 3C10.9207 3 9.1875 4.77539 9.1875 8.60391V10.084H6.86719V13.5223H9.1875Z" fill="currentColor"></path></svg>`,
    },
    {
        id: 1,
        svgHTML:
            '<svg width="20" height="20" aria-hidden="true" focusable="false" role="presentation" className="icon icon-twitter icon--large" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M3.04221 4L9.72655 12.9408L3 20.21H4.51388L10.403 13.8457L15.1612 20.21H20.313L13.2525 10.7663L19.5135 4H17.9997L12.5761 9.86141L8.19399 4H3.04221ZM5.26848 5.11552H7.63522L18.0863 19.0943H15.7196L5.26848 5.11552Z" fill="currentColor"></path></svg>',
    },
    {
        id: 2,
        svgHTML:
            '<svg width="20" height="20" aria-hidden="true" focusable="false" role="presentation" className="icon icon-instagram icon--large" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11.7255 3C9.35597 3 9.0586 3.01036 8.12796 3.05271C7.19914 3.09525 6.56515 3.2423 6.0104 3.45806C5.43656 3.68091 4.9498 3.97902 4.46485 4.46416C3.97953 4.94913 3.68144 5.43591 3.45787 6.00958C3.24157 6.56453 3.09434 7.19872 3.05253 8.12721C3.01091 9.05788 3 9.35544 3 11.725C3 14.0946 3.01054 14.391 3.05271 15.3217C3.09543 16.2506 3.24248 16.8846 3.45805 17.4393C3.68107 18.0132 3.97917 18.5 4.4643 18.9849C4.94907 19.4703 5.43584 19.7691 6.00931 19.9919C6.56442 20.2077 7.1986 20.3548 8.12724 20.3973C9.05787 20.4396 9.35506 20.45 11.7244 20.45C14.094 20.45 14.3905 20.4396 15.3211 20.3973C16.25 20.3548 16.8847 20.2077 17.4398 19.9919C18.0135 19.7691 18.4995 19.4703 18.9843 18.9849C19.4696 18.5 19.7677 18.0132 19.9912 17.4395C20.2057 16.8846 20.353 16.2504 20.3966 15.3219C20.4384 14.3912 20.4493 14.0946 20.4493 11.725C20.4493 9.35544 20.4384 9.05806 20.3966 8.12739C20.353 7.19854 20.2057 6.56453 19.9912 6.00976C19.7677 5.43591 19.4696 4.94913 18.9843 4.46416C18.4989 3.97884 18.0136 3.68073 17.4393 3.45806C16.8831 3.2423 16.2487 3.09525 15.3199 3.05271C14.3892 3.01036 14.093 3 11.7227 3H11.7255ZM10.9428 4.57232C11.1751 4.57195 11.4343 4.57232 11.7255 4.57232C14.055 4.57232 14.3311 4.58068 15.251 4.62249C16.1016 4.66139 16.5633 4.80353 16.8709 4.92295C17.278 5.08109 17.5683 5.27014 17.8735 5.57551C18.1789 5.88089 18.3679 6.17172 18.5264 6.57889C18.6458 6.88608 18.7881 7.34778 18.8269 8.19846C18.8687 9.11822 18.8777 9.39452 18.8777 11.723C18.8777 14.0515 18.8687 14.3278 18.8269 15.2475C18.788 16.0982 18.6458 16.5599 18.5264 16.8671C18.3683 17.2743 18.1789 17.5642 17.8735 17.8694C17.5681 18.1748 17.2782 18.3638 16.8709 18.522C16.5637 18.6419 16.1016 18.7837 15.251 18.8226C14.3313 18.8644 14.055 18.8735 11.7255 18.8735C9.39578 18.8735 9.11968 18.8644 8.19994 18.8226C7.34928 18.7833 6.8876 18.6412 6.57987 18.5218C6.17271 18.3636 5.88189 18.1746 5.57652 17.8692C5.27116 17.5638 5.08212 17.2737 4.92362 16.8664C4.8042 16.5592 4.66188 16.0975 4.62316 15.2468C4.58136 14.3271 4.573 14.0508 4.573 11.7208C4.573 9.39088 4.58136 9.11604 4.62316 8.19628C4.66206 7.3456 4.8042 6.8839 4.92362 6.57634C5.08176 6.16917 5.27116 5.87834 5.57652 5.57297C5.88189 5.26759 6.17271 5.07855 6.57987 4.92005C6.88741 4.80008 7.34928 4.6583 8.19994 4.61921C9.0048 4.58286 9.31671 4.57195 10.9428 4.57014V4.57232ZM16.3827 6.02103C15.8046 6.02103 15.3357 6.48945 15.3357 7.06767C15.3357 7.6457 15.8046 8.11467 16.3827 8.11467C16.9607 8.11467 17.4296 7.6457 17.4296 7.06767C17.4296 6.48964 16.9607 6.02067 16.3827 6.02067V6.02103ZM11.7255 7.24435C9.25109 7.24435 7.24495 9.25055 7.24495 11.725C7.24495 14.1994 9.25109 16.2047 11.7255 16.2047C14.1998 16.2047 16.2053 14.1994 16.2053 11.725C16.2053 9.25055 14.1997 7.24435 11.7253 7.24435H11.7255ZM11.7255 8.81667C13.3315 8.81667 14.6337 10.1187 14.6337 11.725C14.6337 13.3311 13.3315 14.6333 11.7255 14.6333C10.1192 14.6333 8.81722 13.3311 8.81722 11.725C8.81722 10.1187 10.1192 8.81667 11.7255 8.81667Z" fill="currentColor"></path></svg>',
    },
    {
        id: 3,
        svgHTML:
            '<svg width="20" height="20" aria-hidden="true" focusable="false" role="presentation" className="icon icon-tiktok icon--large" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M10.2664 17.2589C11.6014 17.2589 12.6837 16.3032 12.6837 14.8417V4H15.5826C15.42 5.97723 17.3855 7.88718 19.5532 7.8435V10.5695C17.6994 10.5695 16.123 9.78561 15.5743 9.35059V14.8417C15.5743 17.2589 13.6728 20 10.2664 20C6.8601 20 5 17.2589 5 14.8417C5 11.43 8.61044 9.45136 11.0017 9.93497V12.7115C10.8814 12.669 10.5712 12.6061 10.3069 12.6061C8.96086 12.5564 7.8492 13.6482 7.8492 14.8417C7.8492 16.1767 8.93143 17.2589 10.2664 17.2589Z" fill="currentColor"></path></svg>',
    },
    {
        id: 4,
        svgHTML:
            '<svg width="20" height="20" aria-hidden="true" focusable="false" role="presentation" className="icon icon-youtube icon--large" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M19.8212 5.42824C20.6776 5.65882 21.3529 6.33412 21.5835 7.19059C22.0118 8.75529 21.9953 12.0165 21.9953 12.0165C21.9953 12.0165 21.9953 15.2612 21.5835 16.8259C21.3529 17.6824 20.6776 18.3576 19.8212 18.5882C18.2565 19 11.9976 19 11.9976 19C11.9976 19 5.75529 19 4.17412 18.5718C3.31765 18.3412 2.64235 17.6659 2.41176 16.8094C2 15.2612 2 12 2 12C2 12 2 8.75529 2.41176 7.19059C2.64235 6.33412 3.33412 5.64235 4.17412 5.41176C5.73882 5 11.9976 5 11.9976 5C11.9976 5 18.2565 5 19.8212 5.42824ZM15.2091 11.8857L10.0044 14.8834V8.88807L15.2091 11.8857Z" fill="currentColor"></path></svg>',
    },
];
export const FooterPaymentIcon = [
    {
        id: 0,
        svgHTML: `<svg class="icon icon--full-color" viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" role="img" width="38" height="24" aria-labelledby="pi-visa"><title id="pi-visa">Visa</title><path opacity=".07" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"></path><path fill="#fff" d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"></path><path d="M28.3 10.1H28c-.4 1-.7 1.5-1 3h1.9c-.3-1.5-.3-2.2-.6-3zm2.9 5.9h-1.7c-.1 0-.1 0-.2-.1l-.2-.9-.1-.2h-2.4c-.1 0-.2 0-.2.2l-.3.9c0 .1-.1.1-.1.1h-2.1l.2-.5L27 8.7c0-.5.3-.7.8-.7h1.5c.1 0 .2 0 .2.2l1.4 6.5c.1.4.2.7.2 1.1.1.1.1.1.1.2zm-13.4-.3l.4-1.8c.1 0 .2.1.2.1.7.3 1.4.5 2.1.4.2 0 .5-.1.7-.2.5-.2.5-.7.1-1.1-.2-.2-.5-.3-.8-.5-.4-.2-.8-.4-1.1-.7-1.2-1-.8-2.4-.1-3.1.6-.4.9-.8 1.7-.8 1.2 0 2.5 0 3.1.2h.1c-.1.6-.2 1.1-.4 1.7-.5-.2-1-.4-1.5-.4-.3 0-.6 0-.9.1-.2 0-.3.1-.4.2-.2.2-.2.5 0 .7l.5.4c.4.2.8.4 1.1.6.5.3 1 .8 1.1 1.4.2.9-.1 1.7-.9 2.3-.5.4-.7.6-1.4.6-1.4 0-2.5.1-3.4-.2-.1.2-.1.2-.2.1zm-3.5.3c.1-.7.1-.7.2-1 .5-2.2 1-4.5 1.4-6.7.1-.2.1-.3.3-.3H18c-.2 1.2-.4 2.1-.7 3.2-.3 1.5-.6 3-1 4.5 0 .2-.1.2-.3.2M5 8.2c0-.1.2-.2.3-.2h3.4c.5 0 .9.3 1 .8l.9 4.4c0 .1 0 .1.1.2 0-.1.1-.1.1-.1l2.1-5.1c-.1-.1 0-.2.1-.2h2.1c0 .1 0 .1-.1.2l-3.1 7.3c-.1.2-.1.3-.2.4-.1.1-.3 0-.5 0H9.7c-.1 0-.2 0-.2-.2L7.9 9.5c-.2-.2-.5-.5-.9-.6-.6-.3-1.7-.5-1.9-.5L5 8.2z" fill="#142688"></path></svg>`,
    },
    {
        id: 1,
        svgHTML: `<svg class="icon icon--full-color" viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" role="img" width="38" height="24" aria-labelledby="pi-master"><title id="pi-master">Mastercard</title><path opacity=".07" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"></path><path fill="#fff" d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"></path><circle fill="#EB001B" cx="15" cy="12" r="7"></circle><circle fill="#F79E1B" cx="23" cy="12" r="7"></circle><path fill="#FF5F00" d="M22 12c0-2.4-1.2-4.5-3-5.7-1.8 1.3-3 3.4-3 5.7s1.2 4.5 3 5.7c1.8-1.2 3-3.3 3-5.7z"></path></svg>`,
    },
    {
        id: 2,
        svgHTML: `<svg class="icon icon--full-color" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="pi-american_express" viewBox="0 0 38 24" width="38" height="24"><title id="pi-american_express">American Express</title><path fill="#000" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3Z" opacity=".07"></path><path fill="#006FCF" d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32Z"></path><path fill="#FFF" d="M22.012 19.936v-8.421L37 11.528v2.326l-1.732 1.852L37 17.573v2.375h-2.766l-1.47-1.622-1.46 1.628-9.292-.02Z"></path><path fill="#006FCF" d="M23.013 19.012v-6.57h5.572v1.513h-3.768v1.028h3.678v1.488h-3.678v1.01h3.768v1.531h-5.572Z"></path><path fill="#006FCF" d="m28.557 19.012 3.083-3.289-3.083-3.282h2.386l1.884 2.083 1.89-2.082H37v.051l-3.017 3.23L37 18.92v.093h-2.307l-1.917-2.103-1.898 2.104h-2.321Z"></path><path fill="#FFF" d="M22.71 4.04h3.614l1.269 2.881V4.04h4.46l.77 2.159.771-2.159H37v8.421H19l3.71-8.421Z"></path><path fill="#006FCF" d="m23.395 4.955-2.916 6.566h2l.55-1.315h2.98l.55 1.315h2.05l-2.904-6.566h-2.31Zm.25 3.777.875-2.09.873 2.09h-1.748Z"></path><path fill="#006FCF" d="M28.581 11.52V4.953l2.811.01L32.84 9l1.456-4.046H37v6.565l-1.74.016v-4.51l-1.644 4.494h-1.59L30.35 7.01v4.51h-1.768Z"></path></svg>`,
    },
    {
        id: 3,
        svgHTML: `<svg class="icon icon--full-color" viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" width="38" height="24" role="img" aria-labelledby="pi-paypal"><title id="pi-paypal">PayPal</title><path opacity=".07" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"></path><path fill="#fff" d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"></path><path fill="#003087" d="M23.9 8.3c.2-1 0-1.7-.6-2.3-.6-.7-1.7-1-3.1-1h-4.1c-.3 0-.5.2-.6.5L14 15.6c0 .2.1.4.3.4H17l.4-3.4 1.8-2.2 4.7-2.1z"></path><path fill="#3086C8" d="M23.9 8.3l-.2.2c-.5 2.8-2.2 3.8-4.6 3.8H18c-.3 0-.5.2-.6.5l-.6 3.9-.2 1c0 .2.1.4.3.4H19c.3 0 .5-.2.5-.4v-.1l.4-2.4v-.1c0-.2.3-.4.5-.4h.3c2.1 0 3.7-.8 4.1-3.2.2-1 .1-1.8-.4-2.4-.1-.5-.3-.7-.5-.8z"></path><path fill="#012169" d="M23.3 8.1c-.1-.1-.2-.1-.3-.1-.1 0-.2 0-.3-.1-.3-.1-.7-.1-1.1-.1h-3c-.1 0-.2 0-.2.1-.2.1-.3.2-.3.4l-.7 4.4v.1c0-.3.3-.5.6-.5h1.3c2.5 0 4.1-1 4.6-3.8v-.2c-.1-.1-.3-.2-.5-.2h-.1z"></path></svg>`,
    },
    {
        id: 4,
        svgHTML: `<svg class="icon icon--full-color" viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" role="img" width="38" height="24" aria-labelledby="pi-diners_club"><title id="pi-diners_club">Diners Club</title><path opacity=".07" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"></path><path fill="#fff" d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"></path><path d="M12 12v3.7c0 .3-.2.3-.5.2-1.9-.8-3-3.3-2.3-5.4.4-1.1 1.2-2 2.3-2.4.4-.2.5-.1.5.2V12zm2 0V8.3c0-.3 0-.3.3-.2 2.1.8 3.2 3.3 2.4 5.4-.4 1.1-1.2 2-2.3 2.4-.4.2-.4.1-.4-.2V12zm7.2-7H13c3.8 0 6.8 3.1 6.8 7s-3 7-6.8 7h8.2c3.8 0 6.8-3.1 6.8-7s-3-7-6.8-7z" fill="#3086C8"></path></svg>`,
    },
    {
        id: 5,
        svgHTML: `<svg class="icon icon--full-color" viewBox="0 0 38 24" width="38" height="24" role="img" aria-labelledby="pi-discover" fill="none" xmlns="http://www.w3.org/2000/svg"><title id="pi-discover">Discover</title><path fill="#000" opacity=".07" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"></path><path d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32z" fill="#fff"></path><path d="M3.57 7.16H2v5.5h1.57c.83 0 1.43-.2 1.96-.63.63-.52 1-1.3 1-2.11-.01-1.63-1.22-2.76-2.96-2.76zm1.26 4.14c-.34.3-.77.44-1.47.44h-.29V8.1h.29c.69 0 1.11.12 1.47.44.37.33.59.84.59 1.37 0 .53-.22 1.06-.59 1.39zm2.19-4.14h1.07v5.5H7.02v-5.5zm3.69 2.11c-.64-.24-.83-.4-.83-.69 0-.35.34-.61.8-.61.32 0 .59.13.86.45l.56-.73c-.46-.4-1.01-.61-1.62-.61-.97 0-1.72.68-1.72 1.58 0 .76.35 1.15 1.35 1.51.42.15.63.25.74.31.21.14.32.34.32.57 0 .45-.35.78-.83.78-.51 0-.92-.26-1.17-.73l-.69.67c.49.73 1.09 1.05 1.9 1.05 1.11 0 1.9-.74 1.9-1.81.02-.89-.35-1.29-1.57-1.74zm1.92.65c0 1.62 1.27 2.87 2.9 2.87.46 0 .86-.09 1.34-.32v-1.26c-.43.43-.81.6-1.29.6-1.08 0-1.85-.78-1.85-1.9 0-1.06.79-1.89 1.8-1.89.51 0 .9.18 1.34.62V7.38c-.47-.24-.86-.34-1.32-.34-1.61 0-2.92 1.28-2.92 2.88zm12.76.94l-1.47-3.7h-1.17l2.33 5.64h.58l2.37-5.64h-1.16l-1.48 3.7zm3.13 1.8h3.04v-.93h-1.97v-1.48h1.9v-.93h-1.9V8.1h1.97v-.94h-3.04v5.5zm7.29-3.87c0-1.03-.71-1.62-1.95-1.62h-1.59v5.5h1.07v-2.21h.14l1.48 2.21h1.32l-1.73-2.32c.81-.17 1.26-.72 1.26-1.56zm-2.16.91h-.31V8.03h.33c.67 0 1.03.28 1.03.82 0 .55-.36.85-1.05.85z" fill="#231F20"></path><path d="M20.16 12.86a2.931 2.931 0 100-5.862 2.931 2.931 0 000 5.862z" fill="url(#pi-paint0_linear)"></path><path opacity=".65" d="M20.16 12.86a2.931 2.931 0 100-5.862 2.931 2.931 0 000 5.862z" fill="url(#pi-paint1_linear)"></path><path d="M36.57 7.506c0-.1-.07-.15-.18-.15h-.16v.48h.12v-.19l.14.19h.14l-.16-.2c.06-.01.1-.06.1-.13zm-.2.07h-.02v-.13h.02c.06 0 .09.02.09.06 0 .05-.03.07-.09.07z" fill="#231F20"></path><path d="M36.41 7.176c-.23 0-.42.19-.42.42 0 .23.19.42.42.42.23 0 .42-.19.42-.42 0-.23-.19-.42-.42-.42zm0 .77c-.18 0-.34-.15-.34-.35 0-.19.15-.35.34-.35.18 0 .33.16.33.35 0 .19-.15.35-.33.35z" fill="#231F20"></path><path d="M37 12.984S27.09 19.873 8.976 23h26.023a2 2 0 002-1.984l.024-3.02L37 12.985z" fill="#F48120"></path><defs><linearGradient id="pi-paint0_linear" x1="21.657" y1="12.275" x2="19.632" y2="9.104" gradientUnits="userSpaceOnUse"><stop stop-color="#F89F20"></stop><stop offset=".25" stop-color="#F79A20"></stop><stop offset=".533" stop-color="#F68D20"></stop><stop offset=".62" stop-color="#F58720"></stop><stop offset=".723" stop-color="#F48120"></stop><stop offset="1" stop-color="#F37521"></stop></linearGradient><linearGradient id="pi-paint1_linear" x1="21.338" y1="12.232" x2="18.378" y2="6.446" gradientUnits="userSpaceOnUse"><stop stop-color="#F58720"></stop><stop offset=".359" stop-color="#E16F27"></stop><stop offset=".703" stop-color="#D4602C"></stop><stop offset=".982" stop-color="#D05B2E"></stop></linearGradient></defs></svg>`,
    },
];
// #endregion [Footer Contact - End]------------------------------------------------
