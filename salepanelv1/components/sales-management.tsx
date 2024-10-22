"use client"

import { useState, useEffect, useRef } from "react"
import {
  Moon,
  Sun,
  Package,
  Users,
  Search,
  ChevronUp,
  ChevronDown,
  FileText,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  X,
  Smartphone,
  BoxIcon,
  ClipboardList,
  Upload,
  BellIcon,
  CalendarIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import * as XLSX from 'xlsx'
import * as useEffectecharts from 'echarts'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const menuItems = [
  { icon: Users, name: "用户管理" },
  { icon: Smartphone, name: "库存管理" },
  { icon: FileText, name: "商品数据分析" },
  { icon: ClipboardList, name: "销售管理", active: true },
]

const orderStatuses = ["所有状态", "待审核", "已审核", "已驳回", "已发货", "已完成", "已取消"]
const brands = ["所有品牌", "Apple", "Samsung", "Huawei", "Xiaomi", "Oppo", "Vivo"]

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

const salesData = [
  { brand: "苹果", model: "iPhone 13", month: "一月", sales: 1200, units: 20 },
  { brand: "苹果", model: "iPhone 13", month: "二月", sales: 1300, units: 22 },
  { brand: "苹果", model: "iPhone 13", month: "三月", sales: 1400, units: 23 },
  { brand: "苹果", model: "iPhone 13", month: "四月", sales: 1500, units: 25 },
  { brand: "苹果", model: "iPhone 13", month: "五月", sales: 1600, units: 27 },
  { brand: "苹果", model: "iPhone 13", month: "六月", sales: 1500, units: 25 },
  { brand: "苹果", model: "iPhone 13", month: "七月", sales: 1700, units: 28 },
  { brand: "苹果", model: "iPhone 13", month: "八月", sales: 1800, units: 30 },
  { brand: "苹果", model: "iPhone 14", month: "九月", sales: 2000, units: 33 },
  { brand: "苹果", model: "iPhone 14", month: "十月", sales: 1900, units: 32 },
  { brand: "苹果", model: "iPhone 14", month: "十一月", sales: 1800, units: 30 },
  { brand: "苹果", model: "iPhone 14", month: "十二月", sales: 2100, units: 35 },
  { brand: "三星", model: "Galaxy S22", month: "一月", sales: 900, units: 18 },
  { brand: "三星", model: "Galaxy S22", month: "二月", sales: 950, units: 19 },
  { brand: "三星", model: "Galaxy S22", month: "三月", sales: 1000, units: 20 },
  { brand: "三星", model: "Galaxy S22", month: "四月", sales: 1050, units: 21 },
  { brand: "三星", model: "Galaxy S22", month: "五月", sales: 1100, units: 22 },
  { brand: "三星", model: "Galaxy S22", month: "六月", sales: 1050, units: 21 },
  { brand: "三星", model: "Galaxy S22", month: "七月", sales: 1150, units: 23 },
  { brand: "三星", model: "Galaxy S22", month: "八月", sales: 1200, units: 24 },
  { brand: "三星", model: "Galaxy S23", month: "九月", sales: 1300, units: 26 },
  { brand: "三星", model: "Galaxy S23", month: "十月", sales: 1250, units: 25 },
  { brand: "三星", model: "Galaxy S23", month: "十一月", sales: 1200, units: 24 },
  { brand: "三星", model: "Galaxy S23", month: "十二月", sales: 1350, units: 27 },
  { brand: "华为", model: "P50", month: "一月", sales: 800, units: 16 },
  { brand: "华为", model: "P50", month: "二月", sales: 850, units: 17 },
  { brand: "华为", model: "P50", month: "三月", sales: 900, units: 18 },
  { brand: "华为", model: "P50", month: "四月", sales: 950, units: 19 },
  { brand: "华为", model: "P50", month: "五月", sales: 1000, units: 20 },
  { brand: "华为", model: "P50", month: "六月", sales: 950, units: 19 },
  { brand: "华为", model: "P50", month: "七月", sales: 1050, units: 21 },
  { brand: "华为", model: "P50", month: "八月", sales: 1100, units: 22 },
  { brand: "华为", model: "P60", month: "九月", sales: 1200, units: 24 },
  { brand: "华为", model: "P60", month: "十月", sales: 1150, units: 23 },
  { brand: "华为", model: "P60", month: "十一月", sales: 1100, units: 22 },
  { brand: "华为", model: "P60", month: "十二月", sales: 1250, units: 25 },
  { brand: "小米", model: "12", month: "一月", sales: 600, units: 15 },
  { brand: "小米", model: "12", month: "二月", sales: 650, units: 16 },
  { brand: "小米", model: "12", month: "三月", sales: 700, units: 17.5 },
  { brand: "小米", model: "12", month: "四月", sales: 750, units: 18.75 },
  { brand: "小米", model: "12", month: "五月", sales: 800, units: 20 },
  { brand: "小米", model: "12", month: "六月", sales: 750, units: 18.75 },
  { brand: "小米", model: "12", month: "七月", sales: 850, units: 21.25 },
  { brand: "小米", model: "12", month: "八月", sales: 900, units: 22.5 },
  { brand: "小米", model: "13", month: "九月", sales: 1000, units: 25 },
  { brand: "小米", model: "13", month: "十月", sales: 950, units: 23.75 },
  { brand: "小米", model: "13", month: "十一月", sales: 900, units: 22.5 },
  { brand: "小米", model: "13", month: "十二月", sales: 1050, units: 26.25 },
  { brand: "OPPO", model: "Find X5", month: "一月", sales: 500, units: 12.5 },
  { brand: "OPPO", model: "Find X5", month: "二月", sales: 550, units: 13.75 },
  { brand: "OPPO", model: "Find X5", month: "三月", sales: 600, units: 15 },
  { brand: "OPPO", model: "Find X5", month: "四月", sales: 650, units: 16.25 },
  { brand: "OPPO", model: "Find X5", month: "五月", sales: 700, units: 17.5 },
  { brand: "OPPO", model: "Find X5", month: "六月", sales: 650, units: 16.25 },
  { brand: "OPPO", model: "Find X5", month: "七月", sales: 750, units: 18.75 },
  { brand: "OPPO", model: "Find X5", month: "八月", sales: 800, units: 20 },
  { brand: "OPPO", model: "Find X6", month: "九月", sales: 900, units: 22.5 },
  { brand: "OPPO", model: "Find X6", month: "十月", sales: 850, units: 21.25 },
  { brand: "OPPO", model: "Find X6", month: "十一月", sales: 800, units: 20 },
  { brand: "OPPO", model: "Find X6", month: "十二月", sales: 950, units: 23.75 },
]

const months = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
const phoneBrands = ["苹果", "三星", "华为", "小米", "OPPO"]

type ChartInstance = echarts.ECharts;

interface ChartRefs {
  salesTrend: React.RefObject<HTMLDivElement>;
}

interface Charts {
  salesTrend?: ChartInstance;
}

const DatePickerWithRange = ({ onDateChange }) => {
  const [date, setDate] = useState({ from: null, to: null })

  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "yyyy年MM月dd日", { locale: zhCN })} - {format(date.to, "yyyy年MM月dd日", { locale: zhCN })}
                </>
              ) : (
                format(date.from, "yyyy年MM月dd日", { locale: zhCN })
              )
            ) : (
              <span>选择日期范围</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarComponent
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={(newDate) => {
              setDate(newDate)
              onDateChange(newDate)
            }}
            numberOfMonths={2}
            locale={zhCN}
          />
          <div className="flex justify-end p-2">
            <Button
              variant="ghost"
              onClick={() => {
                setDate({ from: null, to: null })
                onDateChange({ from: null, to: null })
              }}
            >
              清除
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export function SalesManagementComponent() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [hasUnreadMessages, setHasUnreadMessages] = useState(true)
  const [orders, setOrders] = useState(generateMockOrders())
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' })
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('所有状态')
  const [dateRange, setDateRange] = useState({ from: null, to: null })
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showOrderDetails, setShowOrderDetails] = useState(false)
  const [toast, setToast] = useState(null)
  const [brandFilter, setBrandFilter] = useState("所有品牌")
  const [showExportConfirmDialog, setShowExportConfirmDialog] = useState(false)
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [showImportPreviewDialog, setShowImportPreviewDialog] = useState(false)
  const [exportPreview, setExportPreview] = useState([])
  const [importFile, setImportFile] = useState(null)
  const [importPreviewData, setImportPreviewData] = useState([])
  const [exportFormat, setExportFormat] = useState('txt')

  const [selectedYear, setSelectedYear] = useState<number>(2023)
  const [selectedMonth, setSelectedMonth] = useState<string>("all")
  const [selectedBrand, setSelectedBrand] = useState<string>("all")
  const [isDatePickerOpen, setIsDatePickerOpen] = useState<boolean>(false)
  const chartRefs: ChartRefs = {
    salesTrend: useRef<HTMLDivElement>(null),
  }
  const [charts, setCharts] = useState<Charts>({})

  const tableRef = useRef(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const newCharts: Charts = {}

    // const initChart = (key: keyof ChartRefs) => {
    //   const el = chartRefs[key].current
    //   if (el) {
    //     if (charts[key]) {
    //       charts[key]?.dispose()
    //     }
    //     newCharts[key] = echarts.init(el)
    //   }
    // }
    const initChart = (key: keyof ChartRefs) => {
      const el = chartRefs[key].current;
      if (el) {
        if (charts[key]) {
          charts[key]?.dispose();
        }
        newCharts[key] = echarts.init(el);
        newCharts[key].resize(); // 添加 resize()
      }
    };
    initChart('salesTrend')

    setCharts(newCharts)

    return () => {
      Object.values(newCharts).forEach(chart => chart?.dispose())
    }
  }, [])

  // useEffect(() => {
  //   if (!charts.salesTrend) return

  //   let filteredData = salesData

  //   if (selectedMonth !== "all" && selectedBrand === "all") {
  //     filteredData = salesData.filter(item => item.month === selectedMonth)
  //   } else if (selectedBrand !== "all") {
  //     filteredData = salesData.filter(item => item.brand === selectedBrand)
  //   }
  useEffect(() => {
    const newCharts: Charts = {}

    const initChart = (key: keyof ChartRefs) => {
      const el = chartRefs[key].current
      if (el) {
        if (charts[key]) {
          charts[key]?.dispose()
        }
        newCharts[key] = echarts.init(el)
      }
    }

    initChart('salesTrend')

    setCharts(newCharts)

    return () => {
      Object.values(newCharts).forEach(chart => chart?.dispose())
    }
  }, [])

  useEffect(() => {
    if (!charts.salesTrend) return

    let filteredData = salesData

    if (selectedMonth !== "all" && selectedBrand === "all") {
      filteredData = salesData.filter(item => item.month === selectedMonth)
    } else if (selectedBrand !== "all") {
      filteredData = salesData.filter(item => item.brand === selectedBrand)
    }

    const salesTrendOption: echarts.EChartsOption = {
      title: { text: '销售趋势分析' },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' }
      },
      legend: { data: ['销售额', '销售量'] },
      toolbox: { feature: { saveAsImage: {} } },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: [{
        type: 'category',
        boundaryGap: true,
        data: selectedMonth !== "all" && selectedBrand === "all"
          ? brands
          : selectedBrand !== "all"
            ? months
            : months
      }],
      yAxis: [
        { type: 'value', name: '销售额(万元)', position: 'left' },
        { type: 'value', name: '销售量(万台)', position: 'right' }
      ],
      series: [
        {
          name: '销售额',
          type: selectedMonth !== "all" && selectedBrand === "all" ? 'bar' : 'line',
          data: selectedMonth !== "all" && selectedBrand === "all"
            ? brands.map(brand =>
              filteredData.find(item => item.brand === brand)?.sales || 0
            )
            : selectedBrand !== "all"
              ? months.map(month =>
                filteredData.find(item => item.month === month)?.sales || 0
              )
              : months.map(month =>
                filteredData.filter(item => item.month === month)
                  .reduce((sum, item) => sum + item.sales, 0)
              ),
          yAxisIndex: 0,
        },
        {
          name: '销售量',
          type: 'bar',
          data: selectedMonth !== "all" && selectedBrand === "all"
            ? brands.map(brand =>
              filteredData.find(item => item.brand === brand)?.units || 0
            )
            : selectedBrand !== "all"
              ? months.map(month =>
                filteredData.find(item => item.month === month)?.units || 0
              )
              : months.map(month =>
                filteredData.filter(item => item.month === month)
                  .reduce((sum, item) => sum + item.units, 0)
              ),
          yAxisIndex: 1,
        }
      ]
    }

    charts.salesTrend.setOption(salesTrendOption)

    // Auto-play tooltip
    let currentIndex = -1
    const intervalId = setInterval(() => {
      currentIndex = (currentIndex + 1) % (selectedMonth !== "all" && selectedBrand === "all" ? brands.length : months.length)
      charts.salesTrend.dispatchAction({
        type: 'showTip',
        seriesIndex: 0,
        dataIndex: currentIndex
      })
    }, 3000)

    return () => clearInterval(intervalId)
  }, [charts.salesTrend, selectedYear, selectedMonth, selectedBrand])

  useEffect(() => {
    const handleResize = () => {
      Object.values(charts).forEach(chart => chart?.resize())
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [charts])

  const handleYearChange = (direction: 'prev' | 'next') => {
    setSelectedYear(prev => direction === 'prev' ? prev - 1 : prev + 1)
  }

  const handleMonthSelect = (month: string) => {
    if (month === selectedMonth) {
      setSelectedMonth("all")
      setSelectedBrand("all")
    } else {
      setSelectedMonth(month)
      setSelectedBrand("all")
    }
    setIsDatePickerOpen(false)
  }

  const handleBrandSelect = (brand: string) => {
    if (brand === selectedBrand) {
      setSelectedBrand("all")
      setSelectedMonth("all")
    } else {
      setSelectedBrand(brand)
      setSelectedMonth("all")
    }
  }


const filteredOrders = sortedOrders.filter(order =>
  (statusFilter === '所有状态' || order.order_status === statusFilter) &&
  (brandFilter === '所有品牌' || order.brand === brandFilter) &&
  (dateRange.from === null || new Date(order.order_date) >= dateRange.from) &&
  (dateRange.to === null || new Date(order.order_date) <= dateRange.to) &&
  (order.order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.phone_model.toLowerCase().includes(searchTerm.toLowerCase()))
)

const indexOfLastOrder = currentPage * itemsPerPage
const indexOfFirstOrder = indexOfLastOrder - itemsPerPage
const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder)

const paginate = (pageNumber) => setCurrentPage(pageNumber)

const handleOrderApproval = (orderId, status) => {
  const updatedOrders = orders.map(order =>
    order.order_id === orderId ? { ...order, order_status: status } : order
  )
  setOrders(updatedOrders)
  setShowOrderDetails(false)
  showToast(`订单 ${orderId} 已${status === '已审核' ? '批准' : '驳回'}。`)
}

const showToast = (message, type = 'info', duration = 3000) => {
  setToast({ message, type })
  setTimeout(() => setToast(null), duration)
}

const handleBulkApproval = (status) => {
  const updatedOrders = orders.map(order =>
    order.order_status === '待审核' ? { ...order, order_status: status } : order
  )
  setOrders(updatedOrders)
  showToast(`批量${status === '已审核' ? '批准' : '驳回'}操作已完成。`)
}

const handleExportOrders = () => {
  setExportPreview(filteredOrders.slice(0, 5))
  setShowExportConfirmDialog(true)
}

const confirmExport = () => {
  const data = filteredOrders.map(order => ({
    订单号: order.order_id,
    客户名称: order.customer_name,
    手机型号: order.phone_model,
    数量: order.quantity,
    单价: order.price,
    总金额: order.total_amount,
    订单状态: order.order_status,
    订单日期: order.order_date,
    创建时间: order.create_time,
    更新时间: order.update_time,
    收货地址: order.shipping_address,
    备注: order.remark,
    品牌: order.brand
  }))

  if (exportFormat === 'txt') {
    const content = data.map(row => Object.values(row).join('\t')).join('\n')
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = "orders_export.txt"
    link.click()
  } else if (exportFormat === 'excel') {
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Orders")
    XLSX.writeFile(wb, "orders_export.xlsx")
  }

  setShowExportConfirmDialog(false)
  showToast("订单导出成功")
}

const handleImportOrders = (event) => {
  const file = event.target.files[0]
  if (file) {
    setImportFile(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result)
      const workbook = XLSX.read(data, { type: 'array' })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

      const headers = jsonData[0]
      const rows = jsonData.slice(1)

      const formattedData = rows.map(row => {
        const obj = {}
        headers.forEach((header, index) => {
          obj[header] = row[index]
        })
        return obj
      })

      setImportPreviewData(formattedData)
    }
    reader.readAsArrayBuffer(file)
    setShowImportPreviewDialog(true)
  }
}

const confirmImport = () => {
  const newOrders = importPreviewData.map(item => ({
    order_id: item['订单号'],
    customer_name: item['客户名称'],
    phone_model: item['手机型号'],
    quantity: parseInt(item['数量']),
    price: parseFloat(item['单价']),
    total_amount: parseFloat(item['总金额']),
    order_status: item['订单状态'],
    order_date: item['订单日期'],
    create_time: item['创建时间'],
    update_time: item['更新时间'],
    shipping_address: item['收货地址'],
    remark: item['备注'],
    brand: item['品牌']
  }))

  setOrders([...orders, ...newOrders])
  setShowImportPreviewDialog(false)
  setImportFile(null)
  showToast("订单导入成功")
}

const handleYearChange = (direction: 'prev' | 'next') => {
  setSelectedYear(prev => direction === 'prev' ? prev - 1 : prev + 1)
}

const handleMonthSelect = (month: string) => {
  if (month === selectedMonth) {
    setSelectedMonth("all")
    setSelectedBrand("all")
  } else {
    setSelectedMonth(month)
    setSelectedBrand("all")
  }
  setIsDatePickerOpen(false)
}

const handleBrandSelect = (brand: string) => {
  if (brand === selectedBrand) {
    setSelectedBrand("all")
    setSelectedMonth("all")
  } else {
    setSelectedBrand(brand)
    setSelectedMonth("all")
  }
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
        <Card className={isDarkMode ? "bg-gray-800" : ""}>
          <CardHeader>
            <CardTitle className={isDarkMode ? "text-white" : ""}>销售管理</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="order-list" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="order-list">订单列表</TabsTrigger>
                <TabsTrigger value="sales-analysis">销售数据分析</TabsTrigger>
              </TabsList>
              <TabsContent value="order-list">
                <div className="flex justify-between items-center mb-4">
                  <CardTitle className={isDarkMode ? "text-white" : ""}>订单列表</CardTitle>
                  <div className="flex items-center space-x-2">
                    <DatePickerWithRange onDateChange={setDateRange} />
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="选择订单状态" />
                      </SelectTrigger>
                      <SelectContent>
                        {orderStatuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={brandFilter} onValueChange={setBrandFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="选择品牌" />
                      </SelectTrigger>
                      <SelectContent>
                        {brands.map((brand) => (
                          <SelectItem key={brand} value={brand}>
                            {brand}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="搜索订单..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-64"
                    />
                  </div>
                </div>
                <div className="flex justify-between mb-4">
                  <div>
                    <Button onClick={() => handleBulkApproval('已审核')} className="mr-2">批量审核</Button>
                    <Button onClick={handleExportOrders}>导出</Button>
                  </div>
                  <Button onClick={() => setShowImportDialog(true)}>导入</Button>
                </div>
                <div className="overflow-x-auto">
                  <div className="inline-block min-w-full align-middle">
                    <div className="overflow-hidden border rounded-lg">
                      <table ref={tableRef} className="min-w-full divide-y divide-gray-200">
                        <thead className={isDarkMode ? "bg-gray-700" : "bg-gray-50"}>
                          <tr>
                            <th
                              scope="col"
                              className={cn(
                                "px-3 py-3.5 text-left text-sm font-semibold sticky left-0 z-10",
                                isDarkMode ? "bg-gray-700 text-gray-200" : "bg-gray-50 text-gray-900"
                              )}
                              style={{ minWidth: '120px' }}
                            >
                              <div className="flex items-center justify-between">
                                <span className="truncate">订单号</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleSort('order_id')}
                                  className="ml-2"
                                >
                                  {sortConfig.key === 'order_id' ? (
                                    sortConfig.direction === 'ascending' ? (
                                      <ChevronUp className="h-4 w-4" />
                                    ) : (
                                      <ChevronDown className="h-4 w-4" />
                                    )
                                  ) : (
                                    <ChevronUp className="h-4 w-4 opacity-50" />
                                  )}
                                </Button>
                              </div>
                            </th>
                            <th
                              scope="col"
                              className={cn(
                                "px-3 py-3.5 text-left text-sm font-semibold sticky left-[120px] z-10",
                                isDarkMode ? "bg-gray-700 text-gray-200" : "bg-gray-50 text-gray-900"
                              )}
                              style={{ minWidth: '120px' }}
                            >
                              <div className="flex items-center justify-between">
                                <span className="truncate">客户名称</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleSort('customer_name')}
                                  className="ml-2"
                                >
                                  {sortConfig.key === 'customer_name' ? (
                                    sortConfig.direction === 'ascending' ? (
                                      <ChevronUp className="h-4 w-4" />
                                    ) : (
                                      <ChevronDown className="h-4 w-4" />
                                    )
                                  ) : (
                                    <ChevronUp className="h-4 w-4 opacity-50" />
                                  )}
                                </Button>
                              </div>
                            </th>
                            {[
                              { key: 'phone_model', label: '手机型号', width: '150px' },
                              { key: 'quantity', label: '数量', width: '80px' },
                              { key: 'price', label: '单价', width: '100px' },
                              { key: 'total_amount', label: '总金额', width: '120px' },
                              { key: 'order_status', label: '订单状态', width: '120px' },
                              { key: 'order_date', label: '订单日期', width: '120px' },
                              { key: 'create_time', label: '创建时间', width: '150px' },
                              { key: 'update_time', label: '更新时间', width: '150px' },
                              { key: 'shipping_address', label: '收货地址', width: '200px' },
                              { key: 'remark', label: '备注', width: '200px' },
                            ].map(({ key, label, width }) => (
                              <th
                                key={key}
                                scope="col"
                                className={cn(
                                  "px-3 py-3.5 text-left text-sm font-semibold",
                                  isDarkMode ? "text-gray-200" : "text-gray-900"
                                )}
                                style={{ minWidth: width }}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="truncate">{label}</span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleSort(key)}
                                    className="ml-2"
                                  >
                                    {sortConfig.key === key ? (
                                      sortConfig.direction === 'ascending' ? (
                                        <ChevronUp className="h-4 w-4" />
                                      ) : (
                                        <ChevronDown className="h-4 w-4" />
                                      )
                                    ) : (
                                      <ChevronUp className="h-4 w-4 opacity-50" />
                                    )}
                                  </Button>
                                </div>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className={isDarkMode ? "bg-gray-800 divide-y divide-gray-700" : "bg-white divide-y divide-gray-200"}>
                          {currentOrders.map((order) => (
                            <tr key={order.order_id}>
                              <td className={cn(
                                "whitespace-nowrap px-3 py-4 text-sm sticky left-0 z-10",
                                isDarkMode ? "bg-gray-800" : "bg-white"
                              )}>
                                <Button
                                  variant="link"
                                  onClick={() => {
                                    setSelectedOrder(order)
                                    setShowOrderDetails(true)
                                  }}
                                >
                                  {order.order_id}
                                </Button>
                              </td>
                              <td className={cn(
                                "whitespace-nowrap px-3 py-4 text-sm sticky left-[120px] z-10",
                                isDarkMode ? "bg-gray-800" : "bg-white"
                              )}>
                                {order.customer_name}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm">{order.phone_model}</td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm">{order.quantity}</td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm">￥{order.price}</td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm">￥{order.total_amount}</td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm">
                                <Badge variant={order.order_status === '待审核' ? 'default' : 'secondary'}>
                                  {order.order_status}
                                </Badge>
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm">{order.order_date}</td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm">{order.create_time}</td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm">{order.update_time}</td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm">{order.shipping_address}</td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm">{order.remark}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <div>
                    总订单数: {filteredOrders.length}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
                      <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="每页显示" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={() => paginate(1)} disabled={currentPage === 1}>首页</Button>
                    <Button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>上一页</Button>
                    <Button onClick={() => paginate(currentPage + 1)} disabled={indexOfLastOrder >= filteredOrders.length}>下一页</Button>
                    <Button onClick={() => paginate(Math.ceil(filteredOrders.length / itemsPerPage))} disabled={indexOfLastOrder >= filteredOrders.length}>尾页</Button>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="sales-analysis">
                <div className="container mx-auto">
                  <h1 className="text-3xl font-bold mb-6">手机销售数据分析</h1>
                  <Card>
                    <CardHeader>
                      <CardTitle>销售趋势分析</CardTitle>
                      <CardDescription>分析各品牌手机的销售趋势</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex space-x-4 mb-4">
                        <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-[280px] justify-start text-left font-normal">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {selectedMonth === "all" ? "选择月份" : `${selectedYear}年 ${selectedMonth}`}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <div className="p-2">
                              <div className="flex justify-between items-center mb-2">
                                <Button onClick={() => handleYearChange('prev')} size="icon" variant="outline">
                                  <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <span className="font-bold">{selectedYear}年</span>
                                <Button onClick={() => handleYearChange('next')} size="icon" variant="outline">
                                  <ChevronRight className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="grid grid-cols-4 gap-2">
                                {months.map((month) => (
                                  <Button
                                    key={month}
                                    onClick={() => handleMonthSelect(month)}
                                    variant={selectedMonth === month ? "default" : "outline"}
                                    className="w-full"
                                  >
                                    {month}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                        <Select
                          value={selectedBrand}
                          onValueChange={handleBrandSelect}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="选择品牌" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">所有品牌</SelectItem>
                            {phoneBrands.map(brand => (
                              <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {(selectedMonth !== "all" || selectedBrand !== "all") && (
                          <Button
                            onClick={() => {
                              setSelectedMonth("all")
                              setSelectedBrand("all")
                            }}
                            variant="outline"
                            size="icon"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <div ref={chartRefs.salesTrend} style={{ width: '100%', height: '400px' }} />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>

    {/* Order Details Dialog */}
    <Dialog open={showOrderDetails} onOpenChange={setShowOrderDetails}>
      <DialogContent className={isDarkMode ? "bg-gray-800 text-white" : ""}>
        <DialogHeader>
          <DialogTitle>订单详情</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-bold">订单号:</Label>
            <span className="col-span-3">{selectedOrder?.order_id}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-bold">客户名称:</Label>
            <span className="col-span-3">{selectedOrder?.customer_name}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-bold">手机型号:</Label>
            <span className="col-span-3">{selectedOrder?.phone_model}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-bold">数量:</Label>
            <span className="col-span-3">{selectedOrder?.quantity}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-bold">单价:</Label>
            <span className="col-span-3">￥{selectedOrder?.price}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-bold">总金额:</Label>
            <span className="col-span-3">￥{selectedOrder?.total_amount}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-bold">订单状态:</Label>
            <span className="col-span-3">{selectedOrder?.order_status}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-bold">订单日期:</Label>
            <span className="col-span-3">{selectedOrder?.order_date}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-bold">创建时间:</Label>
            <span className="col-span-3">{selectedOrder?.create_time}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-bold">更新时间:</Label>
            <span className="col-span-3">{selectedOrder?.update_time}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-bold">收货地址:</Label>
            <span className="col-span-3">{selectedOrder?.shipping_address}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-bold">备注:</Label>
            <span className="col-span-3">{selectedOrder?.remark}</span>
          </div>
        </div>
        <DialogFooter>
          {selectedOrder?.order_status === '待审核' && (
            <>
              <Button onClick={() => handleOrderApproval(selectedOrder.order_id, '已审核')}>批准</Button>
              <Button variant="destructive" onClick={() => handleOrderApproval(selectedOrder.order_id, '已驳回')}>驳回</Button>
            </>
          )}
          <Button onClick={() => setShowOrderDetails(false)}>关闭</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    {/* Export Confirmation Dialog */}
    <Dialog open={showExportConfirmDialog} onOpenChange={setShowExportConfirmDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>确认导出订单</DialogTitle>
          <DialogDescription>
            您即将导出以下订单，请确认。
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[300px] overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>订单号</TableHead>
                <TableHead>客户名称</TableHead>
                <TableHead>手机型号</TableHead>
                <TableHead>总金额</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exportPreview.map((order) => (
                <TableRow key={order.order_id}>
                  <TableCell>{order.order_id}</TableCell>
                  <TableCell>{order.customer_name}</TableCell>
                  <TableCell>{order.phone_model}</TableCell>
                  <TableCell>￥{order.total_amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center space-x-2 mt-4">
          <Label>导出格式:</Label>
          <Select value={exportFormat} onValueChange={setExportFormat}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="选择导出格式" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="txt">TXT</SelectItem>
              <SelectItem value="excel">Excel (UTF-8)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button onClick={() => setShowExportConfirmDialog(false)}>取消</Button>
          <Button onClick={confirmExport}>确认导出</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    {/* Import Dialog */}
    <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>导入订单</DialogTitle>
          <DialogDescription>
            请选择要导入的文件。
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center space-x-2">
            <Input type="file" onChange={handleImportOrders} accept=".xlsx,.xls" />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => setShowImportDialog(false)}>关闭</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    {/* Import Preview Dialog */}
    <Dialog open={showImportPreviewDialog} onOpenChange={setShowImportPreviewDialog}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>导入预览</DialogTitle>
          <DialogDescription>
            请确认以下数据是否正确。
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[400px] overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>订单号</TableHead>
                <TableHead>客户名称</TableHead>
                <TableHead>手机型号</TableHead>
                <TableHead>数量</TableHead>
                <TableHead>单价</TableHead>
                <TableHead>总金额</TableHead>
                <TableHead>订单状态</TableHead>
                <TableHead>收货地址</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {importPreviewData.map((order, index) => (
                <TableRow key={index}>
                  <TableCell>{order['订单号']}</TableCell>
                  <TableCell>{order['客户名称']}</TableCell>
                  <TableCell>{order['手机型号']}</TableCell>
                  <TableCell>{order['数量']}</TableCell>
                  <TableCell>￥{order['单价']}</TableCell>
                  <TableCell>￥{order['总金额']}</TableCell>
                  <TableCell>{order['订单状态']}</TableCell>
                  <TableCell>{order['收货地址']}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <DialogFooter>
          <Button onClick={() => setShowImportPreviewDialog(false)}>取消</Button>
          <Button onClick={confirmImport}>确认导入</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    {toast && (
      <div
        className={`fixed bottom-4 right-4 p-3 rounded-md ${toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'
          } text-white text-sm flex items-center cursor-pointer`}
        onClick={() => setToast(null)}
      >
        <span>{toast.message}</span>
        <button
          className="ml-2 text-white hover:text-gray-200"
          onClick={(e) => {
            e.stopPropagation();
            setToast(null);
          }}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    )}
  </div>
)
}