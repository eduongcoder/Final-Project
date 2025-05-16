import AppSidebar from '@/components/Admin/AppSidebar'
import NavbarAdmin from '@/components/Admin/NavbarAdmin'
import { ThemeProvider } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'
import { useMediaQuery } from '@uidotdev/usehooks'
import { Dessert } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useClickOutside } from '@/hooks/use-click-outside'


const AdminLayouts = ({ children }) => {
  // Kiểm tra breakpoint là màn hình desktop
  const isDesktopDevice = useMediaQuery("(min-width: 768px)");
  // Công tắc đóng mở sidebar
  const [collapsed, setCollapsed] = useState(!isDesktopDevice); 
  const sidebarRef = useRef(null);

  // Xử lý màn hình thiết bị desktop
  useEffect(() => {
    setCollapsed(!isDesktopDevice)
  }, [isDesktopDevice]);

  useClickOutside([sidebarRef], () => {
    if (!isDesktopDevice && !collapsed){
      setCollapsed(true);
    }
  });

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-slate-100 transition-colors dark:bg-slate-950">
        {/* Nền đen */}
        <div className={cn(`pointer-events-none fixed inset-0 -z-10 bg-black opacity-0 transition-opacity`,
          !collapsed && "max-md:pointer-events-auto max-md:z-50 max-md:opacity-30",
        )} />

        {/* 1. Thanh Sidebar */}
        <AppSidebar ref={sidebarRef} collapsed={collapsed} />

        {/* 2. Phần Navbar và Content */}
        <div className={cn(`transition-[margin] duration-300`,
          collapsed ? "md:ml-[70px]" : "md:ml-[240px]")
        }>
          {/* 2.1: Header Navbar */}
          <NavbarAdmin collapsed={collapsed} setCollapsed={setCollapsed} />


          {/* 2.2: Phần nội dung */}
          <div className="h-[calc(100vh-60px)] overflow-y-auto overflow-x-hidden p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}

export default AdminLayouts