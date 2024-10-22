"use client"

import { useState, useEffect, useRef } from "react"
import { 
  ChevronUp,
  ChevronDown,
  Calendar,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

const orderStatuses = ["所有状态", "待审核", "已审核", "已驳回", "已发货", "已完成", "已取消"]
const brands = ["所有品牌", "Apple", "Samsung", "Huawei", "Xiaomi", "Oppo", "Vivo"]

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
            <Calendar className="mr-2 h-4 w-4" />
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

export function SaleListCardComponent({ isDarkMode = false, initialOrders = [] }) {
  const [orders, setOrders] = useState(initialOrders)
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

  const tableRef = useRef(null)

  const handleSort = (key) => {
    let direction = 'ascending'
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
  }

  const sortedOrders = [...orders].sort((a, b) => {
    if (sortConfig.key === null) return 0;
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

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

  return (
    <>
      <Card className={isDarkMode ? "bg-gray-800" : ""}>
        <CardHeader>
          <div className="flex justify-between items-center">
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
        </CardHeader>
        <CardContent>
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
                                <ChevronUp className="h-4 w-4"   />
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
        </CardContent>
      </Card>

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
                    <Table Cell>{order['订单号']}</TableCell>
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
          className={`fixed bottom-4 right-4 p-3 rounded-md ${
            toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'
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
    </>
  )
}