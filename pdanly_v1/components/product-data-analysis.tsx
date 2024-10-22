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
  // ChevronDown,
  Download,
  Calendar,
  ChevronLeft,
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
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

// import dynamic from 'next/dynamic'

// const ReactECharts = dynamic(() => import('echarts-for-react').then((mod) => mod.default), { ssr: false });
// import ReactECharts from 'echarts-for-react';

import ReactECharts from 'echarts-for-react';


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

const generateSalesData = () => {
  const data = {}
  phoneModels.forEach(model => {
    data[model] = Array.from({length: 10}, (_, i) => ({
      month: `${i + 1}`.padStart(2, '0'),
      sales: Math.floor(Math.random() * 5000) + 1000,
      revenue: Math.floor(Math.random() * 1000000) + 500000,
    }))
  })
  return data
}

const salesData = generateSalesData()

const generateInventoryData = () => {
  const data = {}
  phoneModels.forEach(model => {
    data[model] = Array.from({length: 10}, (_, i) => ({
      month: `${i + 1}`.padStart(2, '0'),
      inventory: Math.floor(Math.random() * 1000) + 100,
      turnoverRate: Math.random() * 5 + 1,
    }))
  })
  return data
}

const inventoryData = generateInventoryData()

export function ProductDataAnalysisComponent() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isDarkMode, setIsDarkMode] = useState(false)
  // const [hasUnreadMessages, setHasUnreadMessages] = useState(true)
  const [hasUnreadMessages] = useState(true)
  // const [selectedTimeRange, setSelectedTimeRange] = useState("daily")
  const [selectedBrand, setSelectedBrand] = useState("all")
  const [selectedYear, setSelectedYear] = useState("2024")
  const [selectedMonth, setSelectedMonth] = useState("01")

  const salesChartRef = useRef(null)
  const inventoryChartRef = useRef(null)


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    let currentDataIndex = 0; // 用于跟踪当前 tooltip 的索引

    const tooltipInterval = setInterval(() => {
      [salesChartRef, inventoryChartRef].forEach(ref => {
        if (ref.current) {
          const chart = ref.current.getEchartsInstance();
          const option = chart.getOption();

          if (
              option &&
              option.series &&
              Array.isArray(option.series) &&
              option.series.length > 0 &&
              option.series[0] &&  //  直接访问 option.series[0]
              option.series[0].data &&
              Array.isArray(option.series[0].data) &&
              option.series[0].data?.length > 0
          ) {
            const dataLength = option.series[0].data?.length;

            chart.dispatchAction({
              type: 'showTip',
              seriesIndex: 0,
              dataIndex: currentDataIndex,
            });

            // 更新索引，循环播放
            currentDataIndex = (currentDataIndex + 1) % dataLength;
          }
        }
      });
    }, 3000);

    return () => { // 组件卸载时清除定时器
      clearInterval(interval);
      clearInterval(tooltipInterval);
    };
  }, []);




  useEffect(() => {
    const handleResize = () => {
      [salesChartRef, inventoryChartRef].forEach(ref => {
        if (ref.current) {
          ref.current.getEchartsInstance().resize()
        }
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleExport = (chartRef) => {
    if (chartRef.current) {
      const base64 = chartRef.current.getEchartsInstance().getDataURL();
      const link = document.createElement('a');
      link.download = 'chart.png';
      link.href = base64;
      link.click();
    }
  }

  const salesChartOption = {
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
      data: ['销售量', '销售额']
    },
    xAxis: [
      {
        type: 'category',
        data: selectedBrand === 'all' ? phoneModels : [selectedBrand],
        axisPointer: {
          type: 'shadow'
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: '销售量',
        min: 0,
        max: 6000,
        interval: 1000,
      },
      {
        type: 'value',
        name: '销售额',
        min: 0,
        max: 1200000,
        interval: 200000,
        axisLabel: {
          formatter: '{value} 元'
        }
      }
    ],
    series: [
      {
        name: '销售量',
        type: 'bar',
        data: selectedBrand === 'all' 
          ? phoneModels.map(model => salesData[model].find(item => item.month === selectedMonth)?.sales || 0)
          : [salesData[selectedBrand].find(item => item.month === selectedMonth)?.sales || 0]
      },
      {
        name: '销售额',
        type: 'bar',
        yAxisIndex: 1,
        data: selectedBrand === 'all'
          ? phoneModels.map(model => salesData[model].find(item => item.month === selectedMonth)?.revenue || 0)
          : [salesData[selectedBrand].find(item => item.month === selectedMonth)?.revenue || 0]
      }
    ]
  }

  const inventoryChartOption = {
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
      data: ['库存数量', '库存周转率']
    },
    xAxis: [
      {
        type: 'category',
        data: selectedBrand === 'all' ? phoneModels : [selectedBrand],
        axisPointer: {
          type: 'shadow'
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: '库存数量',
        min: 0,
        max: 1200,
        interval: 200,
      },
      {
        type: 'value',
        name: '库存周转率',
        min: 0,
        max: 8,
        interval: 1,
        axisLabel: {
          formatter: '{value}'
        }
      }
    ],
    series: [
      {
        name: '库存数量',
        type: 'bar',
        data: selectedBrand === 'all'
          ? phoneModels.map(model => inventoryData[model].find(item => item.month === selectedMonth)?.inventory || 0)
          : [inventoryData[selectedBrand].find(item => item.month === selectedMonth)?.inventory || 0]
      },
      {
        name: '库存周转率',
        type: 'line',
        yAxisIndex: 1,
        data: selectedBrand === 'all'
          ? phoneModels.map(model => inventoryData[model].find(item => item.month === selectedMonth)?.turnoverRate || 0)
          : [inventoryData[selectedBrand].find(item => item.month === selectedMonth)?.turnoverRate || 0]
      }
    ]
  }

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
          <h1 className={cn("text-2xl font-semibold", isDarkMode ? "text-white" : "text-gray-800")}>商品数据分析</h1>
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
          <Tabs defaultValue="sales" className="space-y-4">
            <TabsList>
              <TabsTrigger value="sales">销售数据分析</TabsTrigger>
              <TabsTrigger value="inventory">库存数据分析</TabsTrigger>
            </TabsList>
            <TabsContent value="sales" className="space-y-4">
              <Card className={isDarkMode ? "bg-gray-800" : ""}>
                <CardHeader>
                  <CardTitle className={isDarkMode ? "text-white" : ""}>销售数据分析</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between mb-4">
                    <div className="flex items-center">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-[280px] justify-start text-left font-normal">
                            <Calendar className="mr-2 h-4 w-4" />
                            {selectedYear}年{selectedMonth}月
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <div className="p-4">
                            <div className="flex justify-between items-center mb-4">
                              <Button variant="outline" size="icon" onClick={() => setSelectedYear((parseInt(selectedYear) - 1).toString())}>
                                <ChevronLeft className="h-4 w-4" />
                              </Button>
                              <span className="text-lg font-semibold">{selectedYear}</span>
                              <Button variant="outline" size="icon" onClick={() => setSelectedYear((parseInt(selectedYear) + 1).toString())}>
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="grid grid-cols-4  gap-2">
                              {Array.from({length: 12}, (_, i) => i + 1).map((month) => (

                                <Button

                                  key={month}
                                  variant={selectedMonth === month.toString().padStart(2, '0') ? "default" : "outline"}
                                  onClick={() => setSelectedMonth(month.toString().padStart(2, '0'))}
                                >
                                  {month.toString().padStart(2, '0')}
                                </Button>
                              ))}
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="选择品牌" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">所有品牌</SelectItem>
                        {phoneModels.map(model => (
                          <SelectItem key={model} value={model}>{model}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button variant="outline" onClick={() => handleExport(salesChartRef)}>
                      <Download className="mr-2 h-4 w-4" />
                      导出报表
                    </Button>
                  </div>
                  <ReactECharts ref={salesChartRef} option={salesChartOption} style={{height: '400px'}} theme={isDarkMode ? 'dark' : ''} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="inventory" className="space-y-4">
              <Card className={isDarkMode ? "bg-gray-800" : ""}>
                <CardHeader>
                  <CardTitle className={isDarkMode ? "text-white" : ""}>库存数据分析</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between mb-4">
                    <div className="flex items-center">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-[280px] justify-start text-left font-normal">
                            <Calendar className="mr-2 h-4 w-4" />
                            {selectedYear}年{selectedMonth}月
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <div className="p-4">
                            <div className="flex justify-between items-center mb-4">
                              <Button variant="outline" size="icon" onClick={() => setSelectedYear((parseInt(selectedYear) - 1).toString())}>
                                <ChevronLeft className="h-4 w-4" />
                              </Button>
                              <span className="text-lg font-semibold">{selectedYear}</span>
                              <Button variant="outline" size="icon" onClick={() => setSelectedYear((parseInt(selectedYear) + 1).toString())}>
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                              {Array.from({length: 12}, (_, i) => i + 1).map((month) => (
                                <Button
                                  key={month}
                                  variant={selectedMonth === month.toString().padStart(2, '0') ? "default" : "outline"}
                                  onClick={() => setSelectedMonth(month.toString().padStart(2, '0'))}
                                >
                                  {month.toString().padStart(2, '0')}
                                </Button>
                              ))}
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="选择品牌" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">所有品牌</SelectItem>
                        {phoneModels.map(model => (
                          <SelectItem key={model} value={model}>{model}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button variant="outline" onClick={() => handleExport(inventoryChartRef)}>
                      <Download className="mr-2 h-4 w-4" />
                      导出报表
                    </Button>
                  </div>
                  <ReactECharts ref={inventoryChartRef} option={inventoryChartOption} style={{height: '400px'}} theme={isDarkMode ? 'dark' : ''} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}