import FeatureSection from "@/components/Home/FeatureSection";
import AlbumSwiper from "@/components/Swiper-Components/AlbumSwiper";
import CategorySwiper from "@/components/Swiper-Components/CategorySwiper";
import HeroSwiper from "@/components/Swiper-Components/HeroSwiper";
import NewArrivalsSwiper from "@/components/Swiper-Components/NewArrivalsSwiper";
import Test from "@/components/Swiper-Components/test";
import React from "react";

{
    /* <Test/> */
}
const Home = () => {
    return (
        <main>
            {/* 1. Swiper danh mục */}
            <CategorySwiper />
            {/* 2. Swiper Banner Hero */}
            <HeroSwiper />
            {/* 3. New Arrivals Swiper */}
            <NewArrivalsSwiper/>
            {/* 4. Album Swiper */}
            <AlbumSwiper />
            {/* 5. FeatureSection */}
            <FeatureSection />
        </main>
    );
};

export default Home;
