import React, { forwardRef } from "react";
import { ChevronDown, ChevronUp, Projector, Search, Settings, User2 } from "lucide-react";
import { FakeAdminData } from "@/assets/FakeAdminData";
import { NavLink } from "react-router-dom";

import { cn } from "@/lib/utils";
import { navbarLinks } from "@/constants";

const AppSidebar = forwardRef(({ collapsed }, ref) => {
    return (
        <aside
            ref={ref}
            className={cn(
                `fixed z-[100] flex h-full w-[240px] flex-col overflow-x-hidden border-r border-r-slate-300 bg-white [transition:_width_300ms_cubic-bezier(0.4,_0,_0.2,_1),_left_300ms_cubic-bezier(0.4,_0,_0.2,_1),_background-color_150ms_cubic-bezier(0.4,_0,_0.2,_1),_border_150ms_cubic-bezier(0.4,_0,_0.2,_1)] dark:border-slate-700 dark:bg-slate-900`,
                collapsed ? "md:w-[70px] md:items-center" : "md:w-[240px]",
                collapsed ? "max-md:-left-full" : "max-md:left-0",
            )}
        >
            <div className="flex items-center gap-x-3 p-3">
                <img
                    src={"/letter-t.png"}
                    className="block"
                    alt={"Main-Logo"}
                    width={35}
                    height={35}
                />
                {!collapsed && <p className="text-lg font-bold whitespace-nowrap text-slate-900 transition-colors dark:text-slate-50">Web Truyện Admin</p>}
            </div>

            <div className="flex w-full flex-col gap-y-4 overflow-x-hidden overflow-y-auto p-3 [scrollbar-width:_thin]">
                {navbarLinks.map((nav, index) => (
                    <nav
                        key={index}
                        className={cn(`sidebar-group`, collapsed && "md:items-center")}
                    >
                        <p className={cn(`sidebar-group-title`, collapsed && "md:w-[45px]")}>{nav.title}</p>

                        {nav.links.map((link, index_2) => (
                            <NavLink
                                key={index_2}
                                to={link.path}
                                end // Chỉ kích hoạt `active` nếu URL khớp chính xác
                                className={cn("sidebar-item", collapsed && "md:w-[45px]")}
                            >
                                <link.icon
                                    size={22}
                                    className="shrink-0"
                                />

                                {!collapsed && <p className="whitespace-nowrap"> {link.label} </p>}
                            </NavLink>
                        ))}
                    </nav>
                ))}
            </div>
        </aside>
    );
});

AppSidebar.displayName = "Sidebar"; // Để hiển thị tên trong debug React DevTools

export default AppSidebar;
