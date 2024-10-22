"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ChevronLeftIcon, ChevronRightIcon, XIcon, CalendarIcon } from "lucide-react"
import * as echarts from 'echarts'

// Updated sales data
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

type ChartInstance = echarts.ECharts;

interface ChartRefs {
  salesTrend: React.RefObject<HTMLDivElement>;
}

interface Charts {
  salesTrend?: ChartInstance;
}

const months = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
const brands = ["苹果", "三星", "华为", "小米", "OPPO"]

export function SalesDataAnalysis() {
  const [selectedYear, setSelectedYear] = useState<number>(2023)
  const [selectedMonth, setSelectedMonth] = useState<string>("all")
  const [selectedBrand, setSelectedBrand] = useState<string>("all")
  const [isDatePickerOpen, setIsDatePickerOpen] = useState<boolean>(false)
  const chartRefs: ChartRefs = {
    salesTrend: useRef<HTMLDivElement>(null),
  }
  const [charts, setCharts] = useState<Charts>({})

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

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">手机销售统计分析</h1>
      <Card>
        <CardHeader>
          <CardTitle>销售统计分析</CardTitle>
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
                      <ChevronLeftIcon className="h-4 w-4" />
                    </Button>
                    <span className="font-bold">{selectedYear}年</span>
                    <Button onClick={() => handleYearChange('next')} size="icon" variant="outline">
                      <ChevronRightIcon className="h-4 w-4" />
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
                {brands.map(brand => (
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
                <XIcon className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div ref={chartRefs.salesTrend} style={{ width: '100%', height: '400px' }} />
        </CardContent>
      </Card>
    </div>
  )
}