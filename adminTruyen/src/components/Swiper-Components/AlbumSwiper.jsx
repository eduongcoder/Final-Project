import React, { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "./AlbumSwiper.css";
import { AlbumSwiperData } from "@/assets/FakeData";

const AlbumSwiper = () => {
    const swiperWrappedRef = useRef(null);

    const adjustMargin = () => {
        const screenWidth = window.innerWidth; // Lấy chiều ngang của width

        if (swiperWrappedRef.current) {
            swiperWrappedRef.current.style.marginLeft =
                screenWidth <= 520 ? "0px" : screenWidth <= 650 ? "-50px" : screenWidth <= 800 ? "-100px" : "-150px";
        }
    };

    useEffect(() => {
        adjustMargin();
        window.addEventListener("resize", adjustMargin);
        return () => window.removeEventListener("resize", adjustMargin);
    }, []);

    return (
        <div className="pt-9">
            <div className="main-album-swiper">
                <div className="album-container">
                    <h2 className="container-custom pt-10 pb-1 text-center text-2xl font-bold whitespace-nowrap text-white lg:text-4xl">
                        <span className="mr-2">✨</span>
                        Get Inspired by Spaces
                        {/* <span>✨</span> */}
                    </h2>
                    <Swiper
                        modules={[Pagination]}
                        grabCursor
                        initialSlide={2}
                        centeredSlides
                        slidesPerView={"auto"}
                        speed={800}
                        slideToClickedSlide
                        pagination={{ clickable: true }}
                        breakpoints={{
                            320: { spaceBetween: 40 },
                            650: { spaceBetween: 30 },
                            1000: { spaceBetween: 20 },
                        }}
                        onSwiper={(s) => {
                            swiperWrappedRef.current = s.wrapperEl;
                        }}
                    >
                        {AlbumSwiperData.map((slide, index) => (
                            <SwiperSlide key={index}>
                                {/* 1. Ảnh Slide */}
                                <img
                                    className="album-swiper-img"
                                    src={slide.url}
                                    alt={slide.title}
                                />
                                {/* 2. Tiêu đề */}
                                <div className="title">
                                    <h1>{slide.title}</h1>
                                </div>
                                {/* 3. Mô tả */}
                                <div className="content">
                                    <div className="text-box">
                                        <p>{slide.description}</p>
                                    </div>
                                    <div className="footer">
                                        <div className="category">
                                            {slide.categories.map((category, idx) => (
                                                <span
                                                    key={idx}
                                                    style={{ "--i": idx + 1 }}
                                                >
                                                    {category}
                                                </span>
                                            ))}
                                        </div>
                                        <button>
                                            <span className="label">More..</span>
                                        </button>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </div>
    );
};

export default AlbumSwiper;
