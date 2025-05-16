import React, { useState } from "react";
import { NewArrivalsTabs as Tabs } from "@/assets/FakeData";
import { cn } from "@/lib/utils";

const NewArrivalsSwiper = () => {
    const [activeTab, setActiveTab] = useState("NewArrivals"); // HotItems

    return (
        <section className="container-custom pt-6 md:pt-8">
            {/* 1. Section Header */}
            <div className="flex flex-col pb-6 md:flex-row md:gap-x-4 md:pb-8">
                <div className="flex-1">
                    <h2 className="block text-[22.4px] font-bold lg:text-[32px]">New Arrivals</h2>
                    <p className="pt-3 font-medium text-gray-500">Traditional divides between personal and professional space.</p>
                </div>
                <div className="flex flex-1 items-end pt-3 md:justify-end md:pt-0">
                    <div className="flex gap-x-6 font-semibold text-gray-500 md:gap-x-8">
                        {/* Object.entries() là một function có trong JS, để chuyển object thành mảng [key, value]. */}
                        {Object.entries(Tabs).map(([key, tab]) => (
                            <button
                                key={key}
                                onClick={() => setActiveTab(key)}
                                className={cn(
                                    `flex cursor-pointer font-bold transition duration-75`,
                                    activeTab === key ? "flex font-extrabold text-black" : "hover:text-black",
                                )}
                            >
                                New Arrivals
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* 2. Section Content */}
            <div className="">{Tabs[activeTab].content}</div>
        </section>
    );
};

export default NewArrivalsSwiper;
