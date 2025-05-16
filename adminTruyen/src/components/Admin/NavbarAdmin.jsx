import { BellIcon, ChevronsLeft, LogOut, Moon, Search, Settings, Sun, User } from "lucide-react";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

const NavbarAdmin = ({ collapsed, setCollapsed }) => {
    const { setTheme } = useTheme();

    return (
        <header className="relative z-10 flex h-14 items-center justify-between bg-white px-4 shadow-xs transition-colors dark:bg-slate-900">
            {/* Left Side */}
            <div className="flex items-center gap-x-3">
                <button
                    className="btn-ghost size-10"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    <ChevronsLeft className={collapsed && "rotate-180"} />
                </button>

                <div className="input">
                    <Search
                        size={20}
                        className="text-slate-300"
                    />
                    <input
                        type="text"
                        name="search"
                        id="search"
                        placeholder="Search..."
                        className="w-full bg-transparent text-slate-900 outline-0 placeholder:text-slate-300 dark:text-slate-50"
                    />
                </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
                <a
                    href="/"
                    className="flex items-center gap-x-2 rounded-full bg-blue-100/70 p-2 font-semibold hover:bg-blue-50 md:px-5 md:py-1.5 dark:bg-gray-800 dark:hover:bg-gray-600"
                >
                    <img
                        className="size-7"
                        src="src\assets\sub-icon\3d-house.png"
                        alt="3D house icon representing HomeDirection"
                    />
                    <span className={cn("hidden md:block", !collapsed && "md:hidden lg:block")}>Home Page</span>
                </a>

                {/* 1. Theme Menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                        >
                            <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                            <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                            <span className="sr-only">Toggle theme</span>
                        </Button>
                    </DropdownMenuTrigger>

                    {/* Toggle Theme */}
                    <DropdownMenuContent
                        className={"dark:bg-slate-900"}
                        align="end"
                    >
                        <DropdownMenuItem
                            className={"dark:hover:bg-blue-950"}
                            onClick={() => setTheme("light")}
                        >
                            Light
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className={"dark:hover:bg-blue-950"}
                            onClick={() => setTheme("dark")}
                        >
                            Dark
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className={"dark:hover:bg-blue-950"}
                            onClick={() => setTheme("system")}
                        >
                            System
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* 2. Notification */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                        >
                            <BellIcon className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                            <BellIcon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                            <span className="sr-only"> </span>
                        </Button>
                    </DropdownMenuTrigger>

                    {/* Toggle Theme */}
                    <DropdownMenuContent
                        className={"dark:bg-slate-900"}
                        align="end"
                    >
                        <DropdownMenuItem
                            className={"dark:hover:bg-blue-950"}
                            onClick={() => setTheme("light")}
                        >
                            Light
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* 3. User Menu */}
                <DropdownMenu>
                    {/* Nút mở dropdown Profile */}
                    <DropdownMenuTrigger className="cursor-pointer">
                        <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        className={"dark:bg-gray-800"}
                        sideOffset={10}
                    >
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {/* 1. User Profile */}
                        <DropdownMenuItem className={"dark:hover:bg-blue-950"}>
                            <User className="mr-2 h-[1.2rem] w-[1.2rem]" />
                            Profile
                        </DropdownMenuItem>
                        {/* 2. Setting Profile */}
                        <DropdownMenuItem className={"dark:hover:bg-blue-950"}>
                            <Settings className="mr-2 h-[1.2rem] w-[1.2rem]" />
                            Setting
                        </DropdownMenuItem>
                        {/* 3. Logout */}
                        <DropdownMenuItem variant="destructive">
                            <LogOut className="mr-2 h-[1.2rem] w-[1.2rem]" />
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
};

export default NavbarAdmin;
