"use client"

import { useState, useEffect, useRef } from "react"
import { 
  BarChart3, 
  Users, 
  Package, 
  FileText, 
  Settings, 
  Home,
  ShoppingCart,
  Clipboard,
  FileSignature,
  Bell,
  Moon,
  Sun,
  CheckSquare,
  ChevronDown,
  ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu"
import dynamic from 'next/dynamic'

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false })
import 'echarts-liquidfill'

const menuItems = [
  { icon: Home, name: "仪表盘" },
  { icon: Users, name: "用户管理" },
  { icon: ShoppingCart, name: "客户管理" },
  { icon: Package, name: "库存管理" },
  { icon: FileText, name: "销售管理" },
  { icon: Clipboard, name: "订单管理" },
  { icon: FileSignature, name: "合同管理" },
  { icon: BarChart3, name: "报表管理" },
  { icon: Settings, name: "系统设置" },
]

const phoneModels = ['苹果', '三星', '华为', '小米', 'OPPO']

const generateRandomData = () => {
  return phoneModels.map(model => ({
    name: model,
    sales: Math.floor(Math.random() * 5000) + 1000,
    growth: Math.floor(Math.random() * 30) - 10
  }))
}

const generateInventoryData = () => {
  return phoneModels.map(model => ({
    name: model,
    inventory: Math.random()
  }))
}

export function DashboardComponent() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(0)
  const [monthlyData, setMonthlyData] = useState(Array(24).fill(null).map(() => generateRandomData()))
  const [inventoryData, setInventoryData] = useState(generateInventoryData())
  const [currentInventoryIndex, setCurrentInventoryIndex] = useState(0)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [hasUnreadMessages, setHasUnreadMessages] = useState(true)
  const barChartRef = useRef(null)
  const pieChartRef = useRef(null)
  const liquidChartRefs = [useRef(null), useRef(null), useRef(null), useRef(null)]

  useEffect(() => {
    let tooltipInterval
    let monthInterval

    let dataIndex = 0
    tooltipInterval = setInterval(() => {
      const barChart = barChartRef.current?.getEchartsInstance()
      const pieChart = pieChartRef.current?.getEchartsInstance()
      
      if (barChart && pieChart) {
        barChart.dispatchAction({
          type: 'showTip',
          seriesIndex: 0,
          dataIndex: dataIndex % 5
        })
        pieChart.dispatchAction({
          type: 'showTip',
          seriesIndex: 0,
          dataIndex: dataIndex % 5
        })
        dataIndex++
      }
    }, 3000)

    monthInterval = setInterval(() => {
      setCurrentMonth((prevMonth) => (prevMonth + 1) % 24)
      setCurrentInventoryIndex((prevIndex) => (prevIndex + 1) % phoneModels.length)
      setInventoryData(generateInventoryData())
    }, 30000)

    const timeInterval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => {
      clearInterval(tooltipInterval)
      clearInterval(monthInterval)
      clearInterval(timeInterval)
    }
  }, [])

  useEffect(() => {
    const handleResize = () => {
      [barChartRef, pieChartRef, ...liquidChartRefs].forEach(ref => {
        if (ref.current) {
          ref.current.getEchartsInstance().resize()
        }
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const years = [2023, 2024]
  const months = [
    '1月', '2月', '3月', '4月', '5月', '6月', 
    '7月', '8月', '9月', '10月', '11月', '12月'
  ]

  const barOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#999'
        }
      }
    },
    legend: {
      data: ['销售数量', '增长率']
    },
    xAxis: [
      {
        type: 'category',
        data: monthlyData[currentMonth].map(item => item.name),
        axisPointer: {
          type: 'shadow'
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: '销售数量',
        min: 0,
        max: 6000,
        interval: 1000,
      },
      {
        type: 'value',
        name: '增长率',
        min: -20,
        max: 40,
        interval: 10,
        axisLabel: {
          formatter: '{value} %'
        }
      }
    ],
    series: [
      {
        name: '销售数量',
        type: 'bar',
        data: monthlyData[currentMonth].map(item => item.sales)
      },
      {
        name: '增长率',
        type: 'line',
        yAxisIndex: 1,
        data: monthlyData[currentMonth].map(item => item.growth)
      }
    ],
    title: {
      text: `${years[Math.floor(currentMonth / 12)]}年${months[currentMonth % 12]}手机品牌销售数量和增长率`,
      left: 'center',
      top: 'bottom'
    }
  }

  const pieOption = {
    title: {
      text: `${years[Math.floor(currentMonth / 12)]}年${months[currentMonth % 12]}手机品牌销售占比`,
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '销售占比',
        type: 'pie',
        radius: '50%',
        data: monthlyData[currentMonth].map(item => ({ 
          value: item.sales, 
          name: item.name,
          label: {
            formatter: '{b}: {d}%'
          }
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }

  const createLiquidFillOption = (title, value, color) => ({
    title: {
      text: title,
      left: 'center',
      textStyle: {
        fontSize: 14
      }
    },
    series: [{
      type: 'liquidFill',
      data: [value],
      label: {
        formatter: (value) => `${(value.value * 100).toFixed(2)}%`,
        fontSize: 20
      },
      color: [color],
      backgroundStyle: {
        color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
      },
      outline: {
        borderDistance: 0,
        itemStyle: {
          borderColor: isDarkMode ? '#4C1D95' : '#2563EB',
          borderWidth: 2
        }
      }
    }]
  })

  const liquidOptions = [
    createLiquidFillOption(`${inventoryData[currentInventoryIndex].name}库存百分比`, inventoryData[currentInventoryIndex].inventory, isDarkMode ? 'rgba(0, 0, 255, 0.6)' : 'rgba(0, 0, 255, 0.8)'),
    createLiquidFillOption('当月销售目标完成情况', 0.5687, isDarkMode ? 'rgba(255, 165, 0, 0.6)' : 'rgba(16, 185, 129, 0.8)'),
    createLiquidFillOption('', 0.5, isDarkMode ? 'rgba(147, 51, 234, 0.6)' : 'rgba(147, 51, 234, 0.8)'),
    createLiquidFillOption('', 0.5, isDarkMode ? 'rgba(59, 130, 246, 0.6)' : 'rgba(59, 130, 246, 0.8)')
  ]

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
          <div className="flex items-center justify-center h-16 border-b border-gray-700">
            <Package className="h-8 w-8 mr-2 text-white" />
            <span className={cn("font-bold text-xl text-white", !isExpanded && "hidden")}>
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
                  !isExpanded && "justify-center"
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
          <h1 className={cn("text-2xl font-semibold", isDarkMode ? "text-white" : "text-gray-800")}>仪表盘</h1>
          <div className="flex items-center space-x-4">
            <div className={isDarkMode ? "text-white" : "text-gray-600"}>{currentTime.toLocaleString()}</div>
            <div className={isDarkMode ? "text-white" : "text-gray-600"}>你好！管理员</div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative">
                  <Bell className={isDarkMode ? "h-5 w-5 text-white" : "h-5 w-5 text-gray-600"} />
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
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className={cn("text-white", isDarkMode ? "bg-purple-900" : "bg-gradient-to-br from-blue-500 to-indigo-600")}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">总收入</CardTitle>
                <BarChart3 className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">¥45,231.89</div>
                <p className="text-xs opacity-80">较上月增长20.1%</p>
              </CardContent>
            </Card>
            <Card className={cn("text-white", isDarkMode ? "bg-gray-700" : "bg-gradient-to-br from-green-500 to-emerald-600")}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">新增订单</CardTitle>
                <ShoppingCart className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+2350</div>
                <p className="text-xs  opacity-80">较上月增长180.1%</p>
              </CardContent>
            
            </Card>
            <Card className={cn("text-white", isDarkMode ? "bg-blue-900" : "bg-gradient-to-br from-yellow-500 to-orange-600")}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">销售量</CardTitle>
                <Package className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+12,234</div>
                <p className="text-xs opacity-80">较上月增长19%</p>
              </CardContent>
            </Card>
            <Card className={cn("text-white", isDarkMode ? "bg-purple-800" : "bg-gradient-to-br from-purple-500 to-pink-600")}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">本月已完成订单</CardTitle>
                <CheckSquare className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+573</div>
                <p className="text-xs opacity-80">较上月增加201</p>
              </CardContent>
            </Card>
          </div>
          <div className="mt-6 flex justify-between items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className={isDarkMode ? "bg-gray-700 text-white" : ""}>
                  {years[Math.floor(currentMonth / 12)]}年{months[currentMonth % 12]} <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {years.map((year) => (
                  <DropdownMenuSub key={year}>
                    <DropdownMenuSubTrigger>{year}年</DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      {months.map((month, monthIndex) => (
                        <DropdownMenuItem 
                          key={monthIndex} 
                          onSelect={() => setCurrentMonth((year - 2023) * 12 + monthIndex)}
                        >
                          {month}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <Card className={isDarkMode ? "bg-gray-800" : ""}>
              <CardHeader>
                <CardTitle className={isDarkMode ? "text-white" : ""}>月度销售数量和增长率</CardTitle>
              </CardHeader>
              <CardContent>
                <ReactECharts ref={barChartRef} option={barOption} style={{height: '400px'}} theme={isDarkMode ? 'dark' : ''} />
              </CardContent>
            </Card>
            <Card className={isDarkMode ? "bg-gray-800" : ""}>
              <CardHeader>
                <CardTitle className={isDarkMode ? "text-white" : ""}>手机品牌销售占比</CardTitle>
              </CardHeader>
              <CardContent>
                <ReactECharts ref={pieChartRef} option={pieOption} style={{height: '400px'}} theme={isDarkMode ? 'dark' : ''} />
              </CardContent>
            </Card>
          </div>
          <div className="mt-6">
            <Card className={isDarkMode ? "bg-gray-800" : ""}>
              <CardHeader>
                <CardTitle className={isDarkMode ? "text-white" : ""}>库存容量与进度查询</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {liquidOptions.map((option, index) => (
                    <div key={index} className="h-64">
                      <ReactECharts 
                        ref={liquidChartRefs[index]} 
                        option={option} 
                        style={{height: '100%', width: '100%'}} 
                        theme={isDarkMode ? 'dark' : ''} 
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="mt-6">
            <Card className={isDarkMode ? "bg-gray-800" : ""}>
              <CardHeader>
                <CardTitle className={isDarkMode ? "text-white" : ""}>最近订单</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center">
                      <div className="space-y-1">
                        <p className={cn("text-sm font-medium leading-none", isDarkMode ? "text-white" : "")}>订单 #{1000 + i}</p>
                        <p className={cn("text-sm", isDarkMode ? "text-gray-400" : "text-muted-foreground")}>
                          {new Date().toLocaleDateString()}
                        </p>
                      </div>
                      <div className={cn("ml-auto font-medium", isDarkMode ? "text-white" : "")}>+¥{(Math.random() * 10000).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}