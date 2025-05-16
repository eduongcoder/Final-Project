import { FooterContact, FooterList, FooterPaymentIcon, FooterSocial } from "@/assets/FakeData";
import React from "react";
import ButtonHovCustom from "./tailwind-custom/ButtonHovCustom";
import { useDesktopBreakpoint } from "@/hooks/useDesktopBreakpoint";

const Footer = () => {
    // 1. Xử lý details đóng mở responsive footer
    const isDesktop = useDesktopBreakpoint(); // Mặc định là màn hình 1024 trở lên là desktop

    return (
        <footer className="container-custom block py-6 md:py-12 lg:py-10">
            {/* 1. Foot Hỗ trợ liên lạc  px-4 xl:px-[50px]*/}
            <section className="grid grid-cols-1 gap-3 py-6 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                {FooterContact.map((t, index) => (
                    <div
                        key={index}
                        className="relative flex"
                    >
                        <div className="flex flex-1 gap-x-3">
                            {/* Icon */}
                            {/* Render SVG từ svgHTML */}
                            <div
                                className="block stroke-[0.1rem] text-[#1d349a]"
                                dangerouslySetInnerHTML={{ __html: t.svgHTML }}
                            ></div>
                            {/* Title */}
                            <div className="flex flex-1 flex-col items-start">
                                <h3 className="font-bold"> {t.headingContact} </h3>
                                <div className="font-semibold tracking-tight text-gray-600">
                                    {/* - Regex /\S+@\S+\.\S+/: Kiểm tra xem chuỗi có định dạng email hay không.
                    \S+ khớp với một hoặc nhiều ký tự không phải khoảng trắng.
                    @ là ký tự bắt buộc trong email.
                    \. khớp với dấu chấm trong email.
                      + Ví dụ: example@domain.com sẽ khớp.*/}
                                    {/\S+@\S+\.\S+/.test(t.text) ? (
                                        <a
                                            href={`mailto:${t.text}`}
                                            className="underline underline-offset-3"
                                        >
                                            {t.text}
                                        </a>
                                    ) : (
                                        <p>{t.text}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                        {/* Vertical Line */}
                        <div
                            className={`[inset-inline-end:-15px] top-0 h-full border-r border-gray-200 ${index === FooterContact.length - 1 ? "hidden" : "absolute"}`}
                        ></div>
                    </div>
                ))}
            </section>

            {/* Horizontal Line */}
            <div className="w-full border-b border-gray-200"></div>

            {/* 2. Footer List */}
            <section className="flex flex-col pt-6 md:pt-[30px] lg:flex-row lg:gap-8 lg:pt-10">
                {/* 2.1 New Seltter */}
                <div className="mb-3 flex-1/3 lg:mb-0">
                    <div className="flex flex-col">
                        <h3 className="text-3xl font-bold">Join Our Newsletter</h3>

                        <div className="mt-4 font-semibold text-gray-500">
                            <p>Sign up to our newsletter &amp; receive 10% off your first order.</p>
                        </div>
                    </div>

                    <form
                        method="post"
                        className="mt-5 md:w-[470px]"
                    >
                        <div className="flex gap-2">
                            <div className="flex-1">
                                <input
                                    className="form-control h-full w-full flex-1 rounded-4xl border border-transparent bg-gray-200 px-5 focus:border-black"
                                    id="NewsletterForm-newsletter_3qCrWc"
                                    type="email"
                                    name="contact[email]"
                                    aria-required="true"
                                    autoCorrect="off"
                                    autoCapitalize="off"
                                    autoComplete="email"
                                    placeholder="Enter your email"
                                    required=""
                                />
                            </div>
                            <ButtonHovCustom
                                colorSelect={"black_white"}
                                colorHoverSelect={"white_black"}
                            >
                                Sign Up
                            </ButtonHovCustom>
                        </div>
                    </form>

                    <p className="mt-5">
                        By subscribing you agree to the
                        <a
                            href="/policies/terms-of-service"
                            title="Terms of Service"
                        >
                            Terms of Services
                        </a>{" "}
                        and{" "}
                        <a
                            href="/policies/privacy-policy"
                            title="Privacy Policy"
                        >
                            Privacy Policy.
                        </a>
                    </p>
                </div>

                {/* 2.2 Footer Menu */}
                {FooterList.map((t, index) => (
                    <div
                        key={index}
                        className="flex-1"
                    >
                        <details open={isDesktop}>
                            <summary
                                // onClick={isDesktop ? (e) => e.preventDefault : undefined}
                                className={`flex cursor-pointer text-[1.2rem] font-bold lg:pointer-events-none`}
                            >
                                <h3 className="py-3 lg:py-0">{t.footerHeading}</h3>
                            </summary>

                            {/* Horizontal Line */}
                            <div className="w-full border-b border-gray-200 lg:hidden" />

                            <ul className="space-y-2 py-3 font-semibold text-gray-500">
                                {t.footerList.map((fl, flindex) => (
                                    <li key={flindex}> {fl} </li>
                                ))}
                            </ul>
                        </details>
                    </div>
                ))}
            </section>

            {/* 3. Footer Bottom */}
            <section>
                {/* 3.1. Footer Social */}
                <div className="mt-10 flex flex-col justify-between gap-6 font-semibold md:flex-row md:items-end md:gap-0">
                    {/* footer__copyright - Left */}
                    <div className="flex flex-col gap-2">
                        <div className="block">All The Payment</div>
                        <div className="block">
                            <ul className="flex">
                                {FooterPaymentIcon.map((t, index) => (
                                    <li key={index}>
                                        <div dangerouslySetInnerHTML={{ __html: t.svgHTML }} />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* footer__copyright - Right*/}
                    <div>
                        <ul className="flex items-center gap-6">
                            {FooterSocial.map((t, index) => (
                                <li key={index}>
                                    <button className="rounded-full border-[1px] p-3">
                                        <div dangerouslySetInnerHTML={{ __html: t.svgHTML }} />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* 3.2. Footer Copyright */}
                <div className="mt-10 flex justify-between font-semibold">
                    {/* footer__copyright - Left */}
                    <div>
                        <p className="block">
                            &copy;{"2025 "}
                            <a
                                href="#"
                                className="inline"
                            >
                                Hyper Garace.{" "}
                            </a>
                            <a
                                href="#"
                                className="inline"
                            >
                                Powered by React Js
                            </a>
                        </p>
                    </div>

                    {/* footer__copyright - Right*/}
                    <div>
                        <ul className="flex items-center gap-6">
                            <li>Terms of Service</li>
                            <li>Privacy Policy</li>
                        </ul>
                    </div>
                </div>
            </section>
        </footer>
    );
};

export default Footer;
