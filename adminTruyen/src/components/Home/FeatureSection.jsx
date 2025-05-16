import React from "react";
import "./FeatureSection.css";
import ButtonHovCustom from "../tailwind-custom/ButtonHovCustom";
import { FeatureSectionData } from "@/assets/FakeData";

const FeatureSection = () => {
    const ButtonFeature = ["All eco-certified", "Product protection", "Make it yours", "Unique tailored"];

    return (
        <section className="container-custom w-full pt-9 md:pt-[45px] xl:pt-[60px]">
            {/* 1. Heading Title */}
            <div className="flex w-full flex-1 justify-center pb-6">
                <h2 className="Heading-Title-1 w-full text-center font-bold md:w-1/2">This approach resulted in the beautiful structure</h2>
            </div>

            {/* 2. Buttom Feature (Not Responsive)*/}
            <div className="flex justify-center overflow-hidden text-[12px] md:text-xs lg:text-lg">
                {ButtonFeature.map((t, index) => (
                    <div
                        key={index}
                        className="pr-3"
                    >
                        {/* bgColor={"bg-amber-200"} textColor={"text-black"} textHov={"text-amber-200"} */}
                        <ButtonHovCustom
                            colorSelect={"amber_black"}
                            colorHoverSelect={"black_amber"}
                        >
                            <svg
                                className="icon icon-check icon--medium icon--thick shrink-0"
                                aria-hidden="true"
                                focusable="false"
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                            >
                                <path
                                    d="M16.875 5.625L8.125 14.375L3.75 10"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                ></path>
                            </svg>
                            <span className="whitespace-nowrap">{t}</span>
                        </ButtonHovCustom>
                    </div>
                ))}
            </div>

            {/* 3. Card */}
            <section className="container-custom !px-0 pt-[30px] pb-[35px]">
                <div className="feature-section-grid mb-4 grid gap-3 rounded-md md:mb-5 md:grid-cols-2 lg:grid-cols-4 lg:gap-[30px]">
                    {FeatureSectionData.map((t, index) => (
                        <div
                            key={index}
                            className="block"
                        >
                            <div className="mb-4">
                                <img
                                    className="rounded-md"
                                    src={t.url}
                                    alt={t.title}
                                    style={{ aspectRatio: "1/1" }}
                                />
                            </div>

                            {/* 3.2. Title*/}
                            <div className="font-bold sm:text-sm md:text-lg lg:text-2xl">
                                <h2>{t.title}</h2>
                            </div>

                            {/* 3.3 Description*/}
                            <div className="mt-2 text-gray-500 md:mt-3">
                                <p>{t.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </section>
    );
};

export default FeatureSection;
