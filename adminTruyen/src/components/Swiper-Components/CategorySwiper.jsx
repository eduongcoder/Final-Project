// CategorySwiper.jsx
import { useRef } from 'react'; // Hook useRef để giữ tham chiếu đến button
import { Swiper, SwiperSlide } from 'swiper/react'; // Component Swiper & SwiperSlide
import { Navigation, Pagination } from 'swiper/modules'; // Module cho Navigation và Pagination
import { ChevronLeft, ChevronRight } from 'lucide-react'; // Icon mũi tên từ Lucide
import 'swiper/css'; // Import CSS cơ bản của Swiper
import 'swiper/css/navigation'; // Import CSS cho Navigation
import 'swiper/css/pagination'; // Import CSS cho Pagination
import { categoryList } from '@/assets/FakeData';

const CategorySwiper = () => {
    // Tạo ref cho nút prev và next
    const prevRef = useRef(null);
    const nextRef = useRef(null);

    return (
        <div className="block relative px-[15px] py-5 overflow-hidden
            mx-auto 2xl:max-w-7xl
        "> {/* Container tổng cho Swiper */}
            <Swiper
                modules={[Navigation, Pagination]} // Kích hoạt các modules cần dùng
                slidesPerView="auto"                // 👈 Slide tự động co giãn theo kích thước
                spaceBetween={16}                   // 👈 Khoảng cách giữa các slide
                centeredSlides={false}              // 👈 Không cần căn giữa slide
                slideToClickedSlide={true}          // 👈 Click vào slide sẽ tự lướt tới nó
                // pagination={{ type: 'progressbar' }}// 👈 Thanh progressbar dưới swiper
                navigation={{                      // 👈 Gán button điều hướng custom
                    prevEl: prevRef.current,
                    nextEl: nextRef.current,
                }}
                onSwiper={(swiper) => {              // 👈 Khi swiper khởi tạo
                    setTimeout(() => {               // Delay để refs kịp gán
                        swiper.params.navigation.prevEl = prevRef.current;
                        swiper.params.navigation.nextEl = nextRef.current;
                        swiper.navigation.destroy(); // Reset navigation cũ
                        swiper.navigation.init();    // Khởi tạo lại navigation
                        swiper.navigation.update();  // Update state mới
                    });
                }}    
            >
                {categoryList.map((t, index) => (
                    <SwiperSlide
                        key={index} 
                        className='max-md:!mr-0 max-md:!flex-col max-md:!w-1/4 max-md:!h-24  
                        !flex-shrink-0 !flex-grow-0 !flex-basis-auto'
                        style={{ width: '8rem' }} // 👈 Phải đặt min-width để slidesPerView="auto" hoạt động đẹp
                    >
                        <span className="flex justify-center items-start h-full w-full shrink-0">
                            <a href="#" className='flex flex-col decoration-0 text-center relative justify-start items-center'>
                                {/* Logo Category */}
                                <div className="select-none block relative overflow-hidden w-20 max-md:w-12 max-w-full bg-transparent rounded-full">
                                    <img className='rounded-full mx-auto max-sm:w-9 block object-cover' src={t.url} alt="" width={800} height={800} />
                                </div>
                                {/* Category Title */}
                                <div className="pt-3 pointer-events-none w-full">
                                    <h3 className='px-4 inline-block relative text-base text-[15px] flex-1'>
                                        <span>
                                            {t.name}
                                            <svg className="icon-custom icon-caret-right rtl-flip-x icon--medium icon--thick hidden md:block" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M7.5 3.75L13.75 10L7.5 16.25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                            </svg>
                                        </span>
                                    </h3>
                                </div>
                            </a>
                        </span>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Nút Prev (Trái) */}
            <button
                ref={prevRef}
                className="select-none absolute top-1/2 left-0 
                    -translate-y-1/2 bg-white rounded-full z-10 p-2  transition
                    border border-gray-200  
                "
            >
                <ChevronLeft className="text-black w-3 h-3" /> {/* Icon trái màu trắng */}
            </button>

            {/* Nút Next (Phải) */}
            <button
                ref={nextRef}
                className="select-none absolute top-1/2
                    -translate-y-1/2 bg-white rounded-full z-10 p-2  transition
                    border border-gray-200 right-0 
                "
            >
                <ChevronRight className="text-black w-3 h-3" /> {/* Icon phải màu trắng */}
            </button>

        </div>
    );
};

export default CategorySwiper;
