// HeroSwiper.jsx
import { useRef } from 'react'; // Hook useRef để giữ tham chiếu đến button
import { Swiper, SwiperSlide } from 'swiper/react'; // Component Swiper & SwiperSlide
import { ChevronLeft, ChevronRight } from 'lucide-react'; // Icon mũi tên từ Lucide
import { Navigation, Pagination, Autoplay, EffectCreative } from 'swiper/modules'; // Module cho Navigation, Pagination, Autoplay
import 'swiper/css'; // Import CSS cơ bản của Swiper
import 'swiper/css/navigation'; // Import CSS cho Navigation
import 'swiper/css/pagination'; // Import CSS cho Pagination
import ButtonHov from '../tailwind-custom/ButtonHov';
import { HeroList } from '@/assets/FakeData';

const HeroSwiper = ({transitionTime}) => {
    // Tạo ref cho nút prev và next
    const prevRef = useRef(null);
    const nextRef = useRef(null);

    return (
        <div className="hero-swiper-ct block relative overflow-hidden px-[15px]
            rounded-md mx-auto 2xl:max-w-7xl
        "> {/* Container tổng cho Swiper */}
            <Swiper
                modules={[Navigation, Pagination, Autoplay, EffectCreative]} // Kích hoạt các modules cần dùng
                pagination={{
                    el: '.swiper-pagination', // Gán class cho pagination
                    clickable: true, // Pagination có thể click được
                }}
                slidesPerView="1"                // 👈 Slide tự động co giãn theo kích thước
                spaceBetween={10}                   // 👈 Khoảng cách giữa các slide
                centeredSlides={false}              // 👈 Không cần căn giữa slide
                slideToClickedSlide={true}          // 👈 Click vào slide sẽ tự lướt tới nó
                // pagination={{ type: 'progressbar' }}// 👈 Thanh progressbar dưới swiper
                navigation={{                      // 👈 Gán button điều hướng custom
                    prevEl: prevRef.current,
                    nextEl: nextRef.current,
                }}
                loop={true}
                autoplay={{
                    delay: transitionTime || 3000, // thời gian chuyển trang 
                    disableOnInteraction: false, // Không tắt autoplay khi user đang tương tác.
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
                {HeroList.map((t) => (
                    <SwiperSlide>
                        <div className="h-full w-full shrink-0 relative overflow-hidden">
                            {/* IMG */}
                            <div className="h-full w-full relative rounded-md overflow-hidden">
                                <div>
                                    <img className='w-full hidden min-md:block zoom-in-slow' src={t.url_desk} alt={t.id} />
                                    <img className='block min-md:hidden w-full zoom-in-slow' src={t.url_mobile} alt={t.id} />
                                </div>
                                <div className="absolute bg-black/25 inset-0"></div>
                            </div>

                            {/* Title */}
                            <div className="px-[15px] absolute h-full w-full top-0 left-0
                                flex flex-col justify-center items-center text-white">
                                <div className="text-center py-8">
                                    <div className="text-lg md:text-sm lg:text-xl font-bold mb-4">Cotton Made</div>
                                    <h2 className='text-5xl md:text-5xl lg:text-7xl font-bold'>New Season July</h2>
                                    <div className="mt-8">
                                        <ButtonHov Title='Shop Collection' classCustom='px-8' />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}

                <div className="w-full flex items-center justify-center absolute left-0 bottom-3">
                    {/* Nút Prev (Trái) */}
                    <button ref={prevRef} className="select-none rounded-full z-10 p-2 transition flex items-center justify-center">
                        <ChevronLeft className="cursor-pointer text-white w-6 h-6 stroke-3" /> {/* Icon trái màu trắng */}
                    </button>

                    {/* Pagination */}
                    <div className="swiper-pagination !static !w-auto !cursor-pointer"></div>

                    {/* Nút Next (Phải) */}
                    <button ref={nextRef} className="select-none rounded-full z-10 p-2 transition flex items-center justify-center">
                        <ChevronRight className="cursor-pointer text-white w-6 h-6 stroke-3" /> {/* Icon phải màu trắng */}
                    </button>
                </div>
            </Swiper>


        </div>
    );
};

export default HeroSwiper;
