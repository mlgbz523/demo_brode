"use client"

import { useState, useEffect } from "react"
import { 
  Moon, 
  Sun, 
  Package, 
  Users,
  BellIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import OrderListCard from "./OrderListCard"

const menuItems = [
  { icon: Users, name: "用户管理" },
  { icon: Package, name: "库存管理" },
  { icon: Users, name: "商品数据分析" },
  { icon: Package, name: "销售管理", active: true },
]

const generateMockOrders = () => {
  const orders = [
    { 
      order_id: "ORD001",
      customer_name: "张三",
      phone_model: "iPhone 13 Pro",
      quantity: 2,
      price: 6999,
      total_amount: 13998,
      order_status: "待审核",
      order_date: "2023-10-26",
      create_time: "2023-10-26 10:30:00",
      update_time: "2023-10-26 10:30:00",
      shipping_address: "北京市朝阳区阳光100小区3号楼2单元501",
      remark: "客户要求尽快发货",
      brand: "Apple"
    },
    { 
      order_id: "ORD002",
      customer_name: "李四",
      phone_model: "Samsung Galaxy S21",
      quantity: 1,
      price: 5999,
      total_amount: 5999,
      order_status: "已审核",
      order_date: "2023-10-25",
      create_time: "2023-10-25 14:15:00",
      update_time: "2023-10-25 15:00:00",
      shipping_address: "上海市浦东新区陆家嘴环路1000号",
      remark: "",
      brand: "Samsung"
    },
    { 
      order_id: "ORD003",
      customer_name: "王五",
      phone_model: "Xiaomi Mi 11",
      quantity: 3,
      price: 4999,
      total_amount: 14997,
      order_status: "已发货",
      order_date: "2023-10-24",
      create_time: "2023-10-24 09:45:00",
      update_time: "2023-10-24 11:30:00",
      shipping_address: "广州市天河区珠江新城华夏路10号",
      remark: "送货地址已确认",
      brand: "Xiaomi"
    },
  ]
  return orders
}

export function SalesManagementComponent() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [hasUnreadMessages, setHasUnreadMessages] = useState(true)
  const [orders, setOrders] = useState(generateMockOrders())

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className={cn("flex h-screen", isDarkMode ? "bg-gray-900 text-white" : "bg-gradient-to-br from-blue-50 to-indigo-100")}>
      {/* Sidebar */}
      <div
        className={cn(
          "h-full shadow-lg transition-all duration-300 ease-in-out",
          isDarkMode ? "bg-gray-800" : "bg-gradient-to-b from-blue-600 to-indigo-800",
          isExpanded ? "w-64" : "w-16"
        )}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <div className="flex flex-col h-full">
          <div className="flex h-16 items-center justify-center border-b border-gray-700">
            <Package className="h-8 w-8 text-white" />
            <span className={cn("font-bold text-xl text-white ml-2", !isExpanded && "hidden")}>
              PhoneSales
            </span>
          </div>
          <nav className="flex-1">
            {menuItems.map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                className={cn(
                  "w-full justify-start py-2 px-4 text-white",
                  isDarkMode ? "hover:bg-gray-700" : "hover:bg-blue-700",
                  !isExpanded && "justify-center",
                  item.active && (isDarkMode ? "bg-gray-700" : "bg-blue-700")
                )}
              >
                <item.icon className="h-5 w-5" />
                {isExpanded && <span className="ml-2">{item.name}</span>}
              </Button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <header className={cn("shadow-sm py-4 px-6 border-b flex justify-between items-center", isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200")}>
          <h1 className={cn("text-2xl font-semibold", isDarkMode ? "text-white" : "text-gray-800")}>销售管理</h1>
          <div className="flex items-center space-x-4">
            <div className={isDarkMode ? "text-white" : "text-gray-600"}>{currentTime.toLocaleString()}</div>
            <div className={isDarkMode ? "text-white" : "text-gray-600"}>你好！管理员</div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative">
                  <BellIcon className={isDarkMode ? "h-5 w-5 text-white" : "h-5 w-5 text-gray-600"} />
                  {hasUnreadMessages && (
                    <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>新消息 1</DropdownMenuItem>
                <DropdownMenuItem>新消息 2</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" onClick={() => setIsDarkMode(!isDarkMode)}>
              {isDarkMode ? <Sun className="h-5 w-5 text-white" /> : <Moon className="h-5 w-5 text-gray-600" />}
            </Button>
          </div>
        </header>
        <main className="p-6">
          <OrderListCard isDarkMode={isDarkMode} initialOrders={orders} />
        </main>
      </div>
    </div>
  )
}