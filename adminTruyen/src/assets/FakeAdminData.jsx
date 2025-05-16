import {
  Home, Sofa, Search, LayoutList, ShoppingCart,
  User, ChartLine, TicketPercent, Settings
} from 'lucide-react'

// [1. Sidebar Menu]--------------------------------------------
export const FakeAdminData = [
  {
    title: "General", url: "", icon: Home,
    subMenu: []
  },
  {
    title: "Category", url: "/category", icon: LayoutList,
    subMenu: [
      { title: "Product1", url: "/product", icon: Sofa },
      { title: "Product2", url: "/product", icon: Sofa },
    ]
  },
  {
    title: "Product", url: "/product", icon: Sofa,
    subMenu: [
      { title: "Product1", url: "/product", icon: Sofa },
      { title: "Product2", url: "/product", icon: Sofa },
    ]
  },
  {
    title: "Order", url: "/order", icon: ShoppingCart,
    subMenu: [
      { title: "Product1", url: "/product", icon: Sofa },
      { title: "Product2", url: "/product", icon: Sofa },
    ]
  },
  {
    title: "Report", url: "/analyticsReport", icon: ChartLine,
    subMenu: [
      { title: "Product1", url: "/product", icon: Sofa },
      { title: "Product2", url: "/product", icon: Sofa },
    ]
  },
  {
    title: "Customer", url: "/customer", icon: User,
    subMenu: [
      { title: "Product1", url: "/product", icon: Sofa },
      { title: "Product2", url: "/product", icon: Sofa },
    ]
  },
  {
    title: "Promotion", url: "/promotion", icon: TicketPercent,
    subMenu: [
      { title: "Product1", url: "/product", icon: Sofa },
      { title: "Product2", url: "/product", icon: Sofa },
    ]
  },

]
// [1. Sidebar Menu - END]--------------------------------------
