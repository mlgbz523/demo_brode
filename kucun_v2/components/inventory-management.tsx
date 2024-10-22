"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { 
  Moon, 
  Sun, 
  Package, 
  Users,
  Trash2,
  Edit,
  Plus,
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
  Trash,
  BellIcon
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { Textarea } from "@/components/ui/textarea"

const menuItems = [
  { icon: Users, name: "用户管理" },
  { icon: Smartphone, name: "库存管理", active: true },
  { icon: FileText, name: "商品数据分析" },
]

const brands = ["Apple", "Samsung", "Huawei", "Xiaomi", "Oppo", "Vivo", "OnePlus"]
const ramOptions = ["4GB", "6GB", "8GB", "12GB", "16GB"]
const storageOptions = ["64GB", "128GB", "256GB", "512GB", "1TB"]
const screenSizes = ["5.5英寸", "6.1英寸", "6.4英寸", "6.7英寸", "7.0英寸"]
const processors = ["A15 Bionic", "Snapdragon 8 Gen 2", "Exynos 2200", "Dimensity 9000", "Kirin 9000"]

const generateMockPhones = () => {
  const phones = [
    { 
      id: "INV001",
      brand: "Apple",
      model: "iPhone 13 Pro",
      imei: "123456789012345",
      price: 6999,
      processor: "A15 Bionic",
      ram: "6GB",
      storage: "256GB",
      screenSize: "6.1英寸",
      camera: "Pro camera system",
      employeeId: "EMP001",
      releaseDate: "2021-09-24"
    },
    { 
      id: "INV002",
      brand: "Samsung",
      model: "Galaxy S21",
      imei: "987654321098765",
      price: 5999,
      processor: "Exynos 2100",
      ram: "8GB",
      storage: "128GB",
      screenSize: "6.2英寸",
      camera: "Triple camera",
      employeeId: "EMP002",
      releaseDate: "2021-01-29"
    },
    { 
      id: "INV003",
      brand: "Xiaomi",
      model: "Mi 11",
      imei: "456789012345678",
      price: 4999,
      processor: "Snapdragon 888",
      ram: "8GB",
      storage: "256GB",
      screenSize: "6.81英寸",
      camera: "108MP main camera",
      employeeId: "EMP003",
      releaseDate: "2021-02-08"
    },
  ]
  return phones
}

const generateMockRemovedPhones = () => {
  return [
    {
      id: "INV004",
      brand: "Apple",
      model: "iPhone 12",
      imei: "111222333444555",
      employeeId: "EMP001",
      removedAt: "2024-01-10 14:30:00"
    },
    {
      id: "INV005",
      brand: "Samsung",
      model: "Galaxy S20",
      imei: "555666777888999",
      employeeId: "EMP002",
      removedAt: "2024-01-11 09:15:00"
    }
  ]
}

export function InventoryManagementComponent() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [hasUnreadMessages, setHasUnreadMessages] = useState(true)
  const [phones, setPhones] = useState(generateMockPhones())
  const [removedPhones, setRemovedPhones] = useState(generateMockRemovedPhones())
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' })
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [passwordAttempts, setPasswordAttempts] = useState(0)
  const [currentAction, setCurrentAction] = useState(null)
  const [showPhoneDetails, setShowPhoneDetails] = useState(false)
  const [selectedPhone, setSelectedPhone] = useState(null)
  const [toast, setToast] = useState(null)
  const [removePhoneId, setRemovePhoneId] = useState(null)
  const [removeEmployeeId, setRemoveEmployeeId] = useState('')
  const [removedPhoneSearchTerm, setRemovedPhoneSearchTerm] = useState('')
  const [removedPhoneDateFilter, setRemovedPhoneDateFilter] = useState('')
  const [editSearchTerm, setEditSearchTerm] = useState('')
  const [editBrandFilter, setEditBrandFilter] = useState('All')
  const [removeSearchTerm, setRemoveSearchTerm] = useState('')
  const [removeBrandFilter, setRemoveBrandFilter] = useState('All')
  const [bulkImportFile, setBulkImportFile] = useState(null)
  const [bulkImportPreview, setBulkImportPreview] = useState([])
  const [bulkImportData, setBulkImportData] = useState([])
  const [bulkImportTab, setBulkImportTab] = useState("csv")
  const fileInputRef = useRef(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const [searchTerm, setSearchTerm] = useState('')
  const [brandFilter, setBrandFilter] = useState('All')
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editingPhone, setEditingPhone] = useState(null)
  const [editPage, setEditPage] = useState(1)
  const [showBulkRemoveDialog, setShowBulkRemoveDialog] = useState(false)
  const [bulkRemoveEmployeeId, setBulkRemoveEmployeeId] = useState('')
  const [selectedPhonesForRemoval, setSelectedPhonesForRemoval] = useState([])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleSort = (key) => {
    let direction = 'ascending'
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
  }

  const sortedPhones = [...phones].sort((a, b) => {
    if (sortConfig.key === null) return 0;
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const filteredPhones = sortedPhones.filter(phone =>
    (brandFilter === 'All' || phone.brand === brandFilter) &&
    (phone.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    phone.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    phone.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    phone.imei.includes(searchTerm))
  )

  const filteredEditPhones = sortedPhones.filter(phone =>
    (editBrandFilter === 'All' || phone.brand === editBrandFilter) &&
    (phone.id.toLowerCase().includes(editSearchTerm.toLowerCase()) ||
    phone.brand.toLowerCase().includes(editSearchTerm.toLowerCase()) ||
    phone.model.toLowerCase().includes(editSearchTerm.toLowerCase()) ||
    phone.imei.includes(editSearchTerm))
  )

  const filteredRemovePhones = sortedPhones.filter(phone =>
    (removeBrandFilter === 'All' || phone.brand === removeBrandFilter) &&
    (phone.id.toLowerCase().includes(removeSearchTerm.toLowerCase()) ||
    phone.brand.toLowerCase().includes(removeSearchTerm.toLowerCase()) ||
    phone.model.toLowerCase().includes(removeSearchTerm.toLowerCase()) ||
    phone.imei.includes(removeSearchTerm))
  )

  const indexOfLastPhone = currentPage * itemsPerPage
  const indexOfFirstPhone = indexOfLastPhone - itemsPerPage
  const currentPhones = filteredPhones.slice(indexOfFirstPhone, indexOfLastPhone)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  const handlePasswordCheck = (password) => {
    if (password === "admin123") {
      setPasswordAttempts(0)
      setShowPasswordDialog(false)
      if (currentAction === 'bulkImport') {
        handleBulkImport()
      } else if (currentAction === 'bulkRemove') {
        handleBulkRemove()
      }
    } else {
      setPasswordAttempts(passwordAttempts + 1)
      if (passwordAttempts >= 1) {
        setShowPasswordDialog(false)
        setPasswordAttempts(0)
        showToast("密码验证失败。操作已取消。", "error")
      } else {
        showToast("密码错误。请重试。", "error")
      }
    }
  }

  const handleRemovePhone = () => {
    const phoneToRemove = phones.find(phone => phone.id === removePhoneId)
    if (phoneToRemove) {
      const removedPhone = {
        ...phoneToRemove,
        employeeId: removeEmployeeId,
        removedAt: new Date().toISOString().replace('T', ' ').substr(0, 19)
      }
      setRemovedPhones([...removedPhones, removedPhone])
      setPhones(phones.filter(phone => phone.id !== removePhoneId))
      showToast(`手机 ${removePhoneId} 已出库。`)
    }
    setRemovePhoneId(null)
    setRemoveEmployeeId('')
  }

  const filteredRemovedPhones = removedPhones.filter(phone =>
    (phone.id.toLowerCase().includes(removedPhoneSearchTerm.toLowerCase()) ||
    phone.brand.toLowerCase().includes(removedPhoneSearchTerm.toLowerCase()) ||
    phone.model.toLowerCase().includes(removedPhoneSearchTerm.toLowerCase()) ||
    phone.imei.includes(removedPhoneSearchTerm) ||
    phone.employeeId.includes(removedPhoneSearchTerm)) &&
    (!removedPhoneDateFilter || phone.removedAt.startsWith(removedPhoneDateFilter))
  )

  const showToast = (message, type = 'info', duration = 3000) => {
    setToast({ message, type })
    setTimeout(() => setToast(null), duration)
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      setBulkImportFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target.result
        const lines = content.split('\n')
        const headers = lines[0].split(',')
        const data = lines.slice(1).map(line => {
          const values = line.split(',')
          return headers.reduce((obj, header, index) => {
            obj[header.trim()] = values[index]
            return obj
          }, {})
        })
        setBulkImportPreview(data.slice(0, 5))
        setBulkImportData(data)
      }
      reader.readAsText(file)
    }
  }

  const handleBulkImport = () => {
    const newPhones = bulkImportData.map((phone, index) => ({
      ...phone,
      id: `INV${String(phones.length + index + 1).padStart(3, '0')}`
    }))
    setPhones([...phones, ...newPhones])
    setBulkImportFile(null)
    setBulkImportPreview([])
    setBulkImportData([])
    showToast(`成功导入 ${newPhones.length} 部手机。`)
  }

  const handleExportCSV = () => {
    const headers = ['品牌', '型号', 'IMEI', '价格', '处理器', '内存', '存储', '屏幕尺寸', '相机参数']
    const csvContent = [
      headers.join(','),
      ...bulkImportData.map(phone => 
        headers.map(header => phone[header] || '').join(',')
      )
    ].join('\n')

    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      
      link.setAttribute('download', 'phone_inventory.csv')
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleEditPhone = (phone) => {
    setEditingPhone({ ...phone })
    setShowEditDialog(true)
    setEditPage(1)
  }

  const handleSaveEdit = () => {
    const updatedPhones = phones.map(phone => 
      phone.id === editingPhone.id ? editingPhone : phone
    )
    setPhones(updatedPhones)
    setShowEditDialog(false)
    showToast(`手机 ${editingPhone.id} 信息已更新。`)
  }

  const handleBulkRemove = () => {
    const updatedPhones = phones.filter(phone => !selectedPhonesForRemoval.includes(phone.id))
    const newRemovedPhones = phones
      .filter(phone => selectedPhonesForRemoval.includes(phone.id))
      .map(phone => ({
        ...phone,
        employeeId: bulkRemoveEmployeeId,
        removedAt: new Date().toISOString().replace('T', ' ').substr(0, 19)
      }))
    setPhones(updatedPhones)
    setRemovedPhones([...removedPhones, ...newRemovedPhones])
    setSelectedPhonesForRemoval([])
    setBulkRemoveEmployeeId('')
    setShowBulkRemoveDialog(false)
    showToast(`成功批量出库 ${newRemovedPhones.length} 部手机。`)
  }

  return (
    <div className={cn("flex h-screen", isDarkMode ? "bg-gray-900 text-white" : "bg-gradient-to-br from-blue-50 to-indigo-100")}>
      {/* Sidebar */}
      <div
        className={cn(
          "h-full shadow-lg transition-all duration-300 ease-in-out",
          isDarkMode ? "bg-gray-800" : "bg-gradient-to-b from-blue-600 to-indigo-800",
          isExpanded ? "w-64"   : "w-16"
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
                {isExpanded && <span  className="ml-2">{item.name}</span>}
              </Button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <header className={cn("shadow-sm py-4 px-6 border-b flex justify-between items-center", isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200")}>
          <h1 className={cn("text-2xl font-semibold", isDarkMode ? "text-white" : "text-gray-800")}>库存管理</h1>
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
          <Tabs defaultValue="phoneList" className="w-full">
            <TabsList>
              <TabsTrigger value="phoneList">库存手机信息查询</TabsTrigger>
              <TabsTrigger value="addPhone">手机入库</TabsTrigger>
              <TabsTrigger value="editPhone">库存手机信息更改</TabsTrigger>
              <TabsTrigger value="removePhone">手机出库</TabsTrigger>
              <TabsTrigger value="removedPhoneList">出库信息查询</TabsTrigger>
            </TabsList>
            <TabsContent value="phoneList">
              <Card className={isDarkMode ? "bg-gray-800" : ""}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className={isDarkMode ? "text-white" : ""}>库存手机列表</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Input
                        placeholder="搜索手机..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-64"
                      />
                      <Select value={brandFilter} onValueChange={setBrandFilter}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="选择品牌" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All">所有品牌</SelectItem>
                          {brands.map((brand) => (
                            <SelectItem key={brand} value={brand}>
                              {brand}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">预览图</TableHead>
                        <TableHead className="w-[150px]">
                          库存ID
                          <Button variant="ghost" className="ml-2" onClick={() => handleSort('id')}>
                            {sortConfig.key === 'id' ? (
                              sortConfig.direction === 'ascending' ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )
                            ) : (
                              <ChevronUp className="h-4 w-4 opacity-50" />
                            )}
                          </Button>
                        </TableHead>
                        <TableHead className="w-[150px]">
                          品牌
                          <Button variant="ghost" className="ml-2" onClick={() => handleSort('brand')}>
                            {sortConfig.key === 'brand' ? (
                              sortConfig.direction === 'ascending' ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )
                            ) : (
                              <ChevronUp className="h-4 w-4 opacity-50" />
                            )}
                          </Button>
                        </TableHead>
                        <TableHead className="w-[200px]">
                          型号
                          <Button variant="ghost" className="ml-2" onClick={() => handleSort('model')}>
                            {sortConfig.key === 'model' ? (
                              sortConfig.direction === 'ascending' ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )
                            ) : (
                              <ChevronUp className="h-4 w-4 opacity-50" />
                            )}
                          </Button>
                        </TableHead>
                        <TableHead className="w-[150px]">
                          价格
                          <Button variant="ghost" className="ml-2" onClick={() => handleSort('price')}>
                            {sortConfig.key === 'price' ? (
                              sortConfig.direction === 'ascending' ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )
                            ) : (
                              <ChevronUp className="h-4 w-4 opacity-50" />
                            )}
                          </Button>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentPhones.map((phone) => (
                        <TableRow key={phone.id}>
                          <TableCell>
                            <img src={`/placeholder.svg?height=50&width=50`} alt={`${phone.brand} ${phone.model}`} className="w-12 h-12 object-cover rounded" />
                          </TableCell>
                          <TableCell className="font-medium">
                            <Button
                              variant="link"
                              onClick={() => {
                                setSelectedPhone(phone)
                                setShowPhoneDetails(true)
                              }}
                            >
                              {phone.id}
                            </Button>
                          </TableCell>
                          <TableCell>{phone.brand}</TableCell>
                          <TableCell>{phone.model}</TableCell>
                          <TableCell>￥{phone.price}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="flex justify-between items-center mt-4">
                    <div>
                      总库存数: {phones.length}
                    </div>
                    <div className="flex space-x-2">
                      {Array.from({ length: Math.ceil(filteredPhones.length / itemsPerPage) }, (_, i) => (
                        <Button
                          key={i}
                          variant={currentPage === i + 1 ? "default" : "outline"}
                          onClick={() => paginate(i + 1)}
                        >
                          {i + 1}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="addPhone">
              <Card className={isDarkMode ? "bg-gray-800" : ""}>
                <CardHeader>
                  <CardTitle className={isDarkMode ? "text-white" : ""}>手机入库</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs value={bulkImportTab} onValueChange={setBulkImportTab}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="csv">CSV文件导入</TabsTrigger>
                      <TabsTrigger value="manual">手动输入数据</TabsTrigger>
                    </TabsList>
                    <TabsContent value="csv">
                      <div className="flex flex-col gap-4 py-4">
                        <div className="flex flex-col gap-2">
                          <Label htmlFor="file-upload">选择CSV文件</Label>
                          <Input
                            id="file-upload"
                            type="file"
                            accept=".csv"
                            onChange={handleFileUpload}
                            ref={fileInputRef}
                          />
                        </div>
                        {bulkImportPreview.length > 0 && (
                          <div>
                            <h3 className="mb-2 font-semibold">文件预览</h3>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  {Object.keys(bulkImportPreview[0]).map((header) => (
                                    <TableHead key={header}>{header}</TableHead>
                                  ))}
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {bulkImportPreview.map((row, index) => (
                                  <TableRow key={index}>
                                    {Object.values(row).map((value, cellIndex) => (
                                      <TableCell key={cellIndex}>{value}</TableCell>
                                    ))}
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                    <TabsContent value="manual">
                      <div className="flex flex-col gap-4 py-4">
                        <Table className="w-full">
                          <TableHeader>
                            <TableRow>
                              {['品牌', '型号', 'IMEI', '价格', '处理器', '内存', '存储', '屏幕尺寸', '相机参数'].map((header) => (
                                <TableHead key={header} className="text-xs">{header}</TableHead>
                              ))}
                              <TableHead className="text-xs">操作</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {bulkImportData.map((row, index) => (
                              <TableRow key={index}>
                                <TableCell className="p-2">
                                  <Select
                                    value={row['品牌'] || ''}
                                    onValueChange={(value) => {
                                      const newData = [...bulkImportData];
                                      newData[index]['品牌'] = value;
                                      setBulkImportData(newData);
                                    }}
                                  >
                                    <SelectTrigger className="w-[100px]">
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
                                </TableCell>
                                <TableCell className="p-2">
                                  <Input
                                    value={row['型号'] || ''}
                                    onChange={(e) => {
                                      const newData = [...bulkImportData];
                                      newData[index]['型号'] = e.target.value;
                                      setBulkImportData(newData);
                                    }}
                                    className="w-[100px]"
                                  />
                                </TableCell>
                                <TableCell className="p-2">
                                  <Input
                                    value={row['IMEI'] || ''}
                                    onChange={(e) => {
                                      const newData = [...bulkImportData];
                                      newData[index]['IMEI'] = e.target.value;
                                      setBulkImportData(newData);
                                    }}
                                    className="w-[120px]"
                                  />
                                </TableCell>
                                <TableCell className="p-2">
                                  <Input
                                    type="number"
                                    value={row['价格'] || ''}
                                    onChange={(e) => {
                                      const newData = [...bulkImportData];
                                      newData[index]['价格'] = e.target.value;
                                      setBulkImportData(newData);
                                    }}
                                    className="w-[80px]"
                                  />
                                </TableCell>
                                <TableCell className="p-2">
                                  <Select
                                    value={row['处理器'] || ''}
                                    onValueChange={(value) => {
                                      const newData = [...bulkImportData];
                                      newData[index]['处理器'] = value;
                                      setBulkImportData(newData);
                                    }}
                                  >
                                    <SelectTrigger className="w-[120px]">
                                      <SelectValue placeholder="选择处理器" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {processors.map((processor) => (
                                        <SelectItem key={processor} value={processor}>
                                          {processor}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </TableCell>
                                <TableCell className="p-2">
                                  <Select
                                    value={row['内存'] || ''}
                                    onValueChange={(value) => {
                                      const newData = [...bulkImportData];
                                      newData[index]['内存'] = value;
                                      setBulkImportData(newData);
                                    }}
                                  >
                                    <SelectTrigger className="w-[80px]">
                                      <SelectValue placeholder="选择内存" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {ramOptions.map((ram) => (
                                        <SelectItem key={ram} value={ram}>
                                          {ram}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </TableCell>
                                <TableCell className="p-2">
                                  <Select
                                    value={row['存储'] || ''}
                                    onValueChange={(value) => {
                                      const newData = [...bulkImportData];
                                      newData[index]['存储'] = value;
                                      setBulkImportData(newData);
                                    }}
                                  >
                                    <SelectTrigger className="w-[80px]">
                                      <SelectValue placeholder="选择存储" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {storageOptions.map((storage) => (
                                        <SelectItem key={storage} value={storage}>
                                          {storage}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </TableCell>
                                <TableCell className="p-2">
                                  <Select
                                    value={row['屏幕尺寸'] || ''}
                                    onValueChange={(value) => {
                                      const newData = [...bulkImportData];
                                      newData[index]['屏幕尺寸'] = value;
                                      setBulkImportData(newData);
                                    }}
                                  >
                                    <SelectTrigger className="w-[100px]">
                                      <SelectValue placeholder="选择屏幕尺寸" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {screenSizes.map((size) => (
                                        <SelectItem key={size} value={size}>
                                          {size}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </TableCell>
                                <TableCell className="p-2">
                                  <Input
                                    value={row['相机参数'] || ''}
                                    onChange={(e) => {
                                      const newData = [...bulkImportData];
                                      newData[index]['相机参数'] = e.target.value;
                                      setBulkImportData(newData);
                                    }}
                                    className="w-[120px]"
                                  />
                                </TableCell>
                                <TableCell className="p-2">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                      const newData = [...bulkImportData];
                                      newData.splice(index, 1);
                                      setBulkImportData(newData);
                                    }}
                                  >
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                        <div className="flex justify-between">
                          <Button onClick={() => setBulkImportData([...bulkImportData, {}])}>
                            添加行
                          </Button>
                          <div className="space-x-2">
                            <Button onClick={handleExportCSV}>
                              导出CSV
                            </Button>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                  <div className="mt-4">
                    <Button onClick={() => {
                      setCurrentAction('bulkImport')
                      setShowPasswordDialog(true)
                    }}>
                      保存并导入
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="editPhone">
              <Card className={isDarkMode ? "bg-gray-800" : ""}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className={isDarkMode ? "text-white" : ""}>库存手机信息更改</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Input
                        placeholder="搜索手机..."
                        value={editSearchTerm}
                        onChange={(e) => setEditSearchTerm(e.target.value)}
                        className="w-64"
                      />
                      <Select value={editBrandFilter} onValueChange={setEditBrandFilter}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="选择品牌" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All">所有品牌</SelectItem>
                          {brands.map((brand) => (
                            <SelectItem key={brand} value={brand}>
                              {brand}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>库存ID</TableHead>
                        <TableHead>品牌</TableHead>
                        <TableHead>型号</TableHead>
                        <TableHead>操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEditPhones.map((phone) => (
                        <TableRow key={phone.id}>
                          <TableCell>
                            <Button
                              variant="link"
                              onClick={() => {
                                setSelectedPhone(phone)
                                setShowPhoneDetails(true)
                              }}
                            >
                              {phone.id}
                            </Button>
                          </TableCell>
                          <TableCell>{phone.brand}</TableCell>
                          <TableCell>{phone.model}</TableCell>
                          <TableCell>
                            <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => handleEditPhone(phone)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="removePhone">
              <Card className={isDarkMode ? "bg-gray-800" : ""}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className={isDarkMode ? "text-white" : ""}>手机出库</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Input
                        placeholder="搜索手机..."
                        value={removeSearchTerm}
                        onChange={(e) => setRemoveSearchTerm(e.target.value)}
                        className="w-64"
                      />
                      <Select value={removeBrandFilter} onValueChange={setRemoveBrandFilter}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="选择品牌" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All">所有品牌</SelectItem>
                          {brands.map((brand) => (
                            <SelectItem key={brand} value={brand}>
                              {brand}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button onClick={() => setShowBulkRemoveDialog(true)}>
                        批量出库
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>选择</TableHead>
                        <TableHead>库存ID</TableHead>
                        <TableHead>品牌</TableHead>
                        <TableHead>型号</TableHead>
                        <TableHead>操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRemovePhones.map((phone) => (
                        <TableRow key={phone.id}>
                          <TableCell>
                            <input
                              type="checkbox"
                              checked={selectedPhonesForRemoval.includes(phone.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedPhonesForRemoval([...selectedPhonesForRemoval, phone.id])
                                } else {
                                  setSelectedPhonesForRemoval(selectedPhonesForRemoval.filter(id => id !== phone.id))
                                }
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="link"
                              onClick={() => {
                                setSelectedPhone(phone)
                                setShowPhoneDetails(true)
                              }}
                            >
                              {phone.id}
                            </Button>
                          </TableCell>
                          <TableCell>{phone.brand}</TableCell>
                          <TableCell>{phone.model}</TableCell>
                          <TableCell>
                            <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => {
                              setRemovePhoneId(phone.id)
                              setCurrentAction('remove')
                              setShowPasswordDialog(true)
                            }}>
                              <BoxIcon className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="removedPhoneList">
              <Card className={isDarkMode ? "bg-gray-800" : ""}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className={isDarkMode ? "text-white" : ""}>出库信息查询</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Input
                        placeholder="搜索出库信息..."
                        value={removedPhoneSearchTerm}
                        onChange={(e) => setRemovedPhoneSearchTerm(e.target.value)}
                        className="w-64"
                      />
                      <Input
                        type="date"
                        value={removedPhoneDateFilter}
                        onChange={(e) => setRemovedPhoneDateFilter(e.target.value)}
                        className="w-40"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>库存ID</TableHead>
                        <TableHead>品牌</TableHead>
                        <TableHead>型号</TableHead>
                        <TableHead>IMEI码</TableHead>
                        <TableHead>出库经手人</TableHead>
                        <TableHead>出库时间</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRemovedPhones.map((phone) => (
                        <TableRow key={phone.id}>
                          <TableCell>
                            <Button
                              variant="link"
                              onClick={() => {
                                setSelectedPhone(phone)
                                setShowPhoneDetails(true)
                              }}
                            >
                              {phone.id}
                            </Button>
                          </TableCell>
                          <TableCell>{phone.brand}</TableCell>
                          <TableCell>{phone.model}</TableCell>
                          <TableCell>{phone.imei}</TableCell>
                          <TableCell>{phone.employeeId}</TableCell>
                          <TableCell>{phone.removedAt}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Password Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className={isDarkMode ? "bg-gray-800 text-white" : ""}>
          <DialogHeader>
            <DialogTitle>请输入密码</DialogTitle>
            <DialogDescription>
              请输入管理员密码以继续操作。
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                密码
              </Label>
              <Input
                id="password"
                type="password"
                className="col-span-3"
              />
            </div>
            {currentAction === 'remove' && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="removeEmployeeId" className="text-right">
                  员工ID
                </Label>
                <Input
                  id="removeEmployeeId"
                  value={removeEmployeeId}
                  onChange={(e) => setRemoveEmployeeId(e.target.value)}
                  className="col-span-3"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => handlePasswordCheck(document.getElementById('password').value)}>确认</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Phone Details Dialog */}
      <Dialog open={showPhoneDetails} onOpenChange={setShowPhoneDetails}>
        <DialogContent className={isDarkMode ? "bg-gray-800 text-white" : ""}>
          <DialogHeader>
            <DialogTitle>手机详情</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right font-bold">库存ID:</Label>
              <span className="col-span-3">{selectedPhone?.id}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right font-bold">品牌:</Label>
              <span className="col-span-3">{selectedPhone?.brand}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right font-bold">型号:</Label>
              <span className="col-span-3">{selectedPhone?.model}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right font-bold">IMEI:</Label>
              <span className="col-span-3">{selectedPhone?.imei}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right font-bold">价格:</Label>
              <span className="col-span-3">￥{selectedPhone?.price}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right font-bold">处理器:</Label>
              <span className="col-span-3">{selectedPhone?.processor}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right font-bold">内存:</Label>
              <span className="col-span-3">{selectedPhone?.ram}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right font-bold">存储:</Label>
              <span className="col-span-3">{selectedPhone?.storage}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right font-bold">屏幕尺寸:</Label>
              <span className="col-span-3">{selectedPhone?.screenSize}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right font-bold">相机:</Label>
              <span className="col-span-3">{selectedPhone?.camera}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right font-bold">入库员工ID:</Label>
              <span className="col-span-3">{selectedPhone?.employeeId}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right font-bold">发售日期:</Label>
              <span className="col-span-3">{selectedPhone?.releaseDate}</span>
            </div>
            {selectedPhone?.removedAt && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-bold">出库时间:</Label>
                <span className="col-span-3">{selectedPhone?.removedAt}</span>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setShowPhoneDetails(false)}>关闭</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Phone Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className={isDarkMode ? "bg-gray-800 text-white" : ""}>
          <DialogHeader>
            <DialogTitle>编辑手机信息</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {editPage === 1 && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right font-bold">库存ID:</Label>
                  <span className="col-span-3">{editingPhone?.id}</span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right font-bold">品牌:</Label>
                  <Select
                    value={editingPhone?.brand}
                    onValueChange={(value) => setEditingPhone({...editingPhone, brand: value})}
                  >
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
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right font-bold">型号:</Label>
                  <Input
                    value={editingPhone?.model}
                    onChange={(e) => setEditingPhone({...editingPhone, model: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right font-bold">IMEI:</Label>
                  <span className="col-span-3">{editingPhone?.imei}</span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right font-bold">价格:</Label>
                  <Input
                    type="number"
                    value={editingPhone?.price}
                    onChange={(e) => setEditingPhone({...editingPhone, price: parseFloat(e.target.value)})}
                    className="col-span-3"
                  />
                </div>
              </>
            )}
            {editPage === 2 && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right font-bold">处理器:</Label>
                  <Input
                    value={editingPhone?.processor}
                    onChange={(e) => setEditingPhone({...editingPhone, processor: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right font-bold">内存:</Label>
                  <Select
                    value={editingPhone?.ram}
                    onValueChange={(value) => setEditingPhone({...editingPhone, ram: value})}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="选择内存" />
                    </SelectTrigger>
                    <SelectContent>
                      {ramOptions.map((ram) => (
                        <SelectItem key={ram} value={ram}>
                          {ram}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right font-bold">存储:</Label>
                  <Select
                    value={editingPhone?.storage}
                    onValueChange={(value) => setEditingPhone({...editingPhone, storage: value})}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="选择存储" />
                    </SelectTrigger>
                    <SelectContent>
                      {storageOptions.map((storage) => (
                        <SelectItem key={storage} value={storage}>
                          {storage}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right font-bold">屏幕尺寸:</Label>
                  <Select
                    value={editingPhone?.screenSize}
                    onValueChange={(value) => setEditingPhone({...editingPhone, screenSize: value})}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="选择屏幕尺寸" />
                    </SelectTrigger>
                    <SelectContent>
                      {screenSizes.map((size) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right font-bold">相机:</Label>
                  <Input
                    value={editingPhone?.camera}
                    onChange={(e) => setEditingPhone({...editingPhone, camera: e.target.value})}
                    className="col-span-3"
                  />
                </div>
              </>
            )}
            {editPage === 3 && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right font-bold">入库员工ID:</Label>
                  <span className="col-span-3">{editingPhone?.employeeId}</span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right font-bold">发售日期:</Label>
                  <span className="col-span-3">{editingPhone?.releaseDate}</span>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setEditPage(Math.max(1, editPage - 1))} disabled={editPage === 1}>上一页</Button>
            <Button onClick={() => setEditPage(Math.min(3, editPage + 1))} disabled={editPage === 3}>下一页</Button>
            <Button onClick={handleSaveEdit}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Remove Dialog */}
      <Dialog open={showBulkRemoveDialog} onOpenChange={setShowBulkRemoveDialog}>
        <DialogContent className={isDarkMode ? "bg-gray-800 text-white" : ""}>
          <DialogHeader>
            <DialogTitle>批量出库</DialogTitle>
            <DialogDescription>
              请输入管理员密码和员工ID以继续批量出库操作。
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bulkRemovePassword" className="text-right">
                密码
              </Label>
              <Input
                id="bulkRemovePassword"
                type="password"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bulkRemoveEmployeeId" className="text-right">
                员工ID
              </Label>
              <Input
                id="bulkRemoveEmployeeId"
                value={bulkRemoveEmployeeId}
                onChange={(e) => setBulkRemoveEmployeeId(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => {
              setCurrentAction('bulkRemove')
              handlePasswordCheck(document.getElementById('bulkRemovePassword').value)
            }}>确认</Button>
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
    </div>
  )
}