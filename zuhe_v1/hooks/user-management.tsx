"use client"

import { useState, useEffect, useRef } from "react"
import { 
  Bell, 
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
  Settings,
  LogOut,
  Upload,
  Image as ImageIcon
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"

const menuItems = [
  { icon: Users, name: "用户管理" },
  { icon: Package, name: "商品信息维护" },
  { icon: FileText, name: "商品数据分析" },
  { icon: Settings, name: "系统设置" },
]

const roles = ["管理员", "销售人员", "库管人员", "财务人员"]
const statuses = ["活动", "停用"]

const productStatus = ["上架", "下架", "预售"]
const productCategories = ["旗舰机", "中端机", "入门机"]

const generateMockUsers = () => {
  const users = [
    { employeeId: "EMP001", username: "admin", role: "管理员", lastLogin: "2024-01-15 10:30:00", status: "活动" },
    { employeeId: "EMP002", username: "sales1", role: "销售人员", lastLogin: "2024-01-14 15:45:00", status: "活动" },
    { employeeId: "EMP003", username: "inventory1", role: "库管人员", lastLogin: "2024-01-13 09:20:00", status: "停用" },
    { employeeId: "EMP004", username: "finance1", role: "财务人员", lastLogin: "2024-01-12 14:10:00", status: "活动" },
  ]

  // Generate additional users
  const additionalUsers = []
  for (let i = 5; i <= 20; i++) {
    const role = roles[Math.floor(Math.random() * roles.length)]
    additionalUsers.push({
      employeeId: `EMP${String(i).padStart(3, '0')}`,
      username: `user${i}`,
      role: role,
      lastLogin: `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')} ${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00`,
      status: Math.random() > 0.2 ? "活动" : "停用"
    })
  }

  return [...users, ...additionalUsers]
}

const generateMockLogs = () => {
  const logs = []
  const actions = ["添加用户", "修改用户信息", "删除用户", "重置密码", "更新权限", "登录系统", "导出报表", "更新商品信息"]
  
  for (let month = 1; month <= 12; month++) {
    const entriesCount = Math.floor(Math.random() * 3) + 6 // 6 to 8 entries per month
    for (let i = 0; i < entriesCount; i++) {
      const day = Math.floor(Math.random() * 28) + 1
      const hour = Math.floor(Math.random() * 24)
      const minute = Math.floor(Math.random() * 60)
      const second = Math.floor(Math.random() * 60)
      const timestamp = `2024-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`
      const user = mockUsers[Math.floor(Math.random() * mockUsers.length)]
      
      logs.push({
        id: logs.length + 1,
        employeeId: user.employeeId,
        username: user.username,
        role: user.role,
        action: actions[Math.floor(Math.random() * actions.length)],
        timestamp: timestamp
      })
    }
  }

  return logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
}

const mockUsers = generateMockUsers()
const mockLogs = generateMockLogs()

const currentUser = {
  employeeId: "EMP001",
  username: "admin",
  name: "管理员",
  gender: "男",
  age: 35,
  role: "管理员",
  department: "IT部门",
  hireDate: "2020-01-01",
  status: "在职",
  createdAt: "2020-01-01 09:00:00",
  phoneNumber: "13800138000"
}

const mockProducts = [
  { id: 1, name: "iPhone 12", brand: "Apple", model: "A2404", color: "黑色", memory: "128GB", camera: "12MP", price: 5999, stock: 100, status: "上架", image: "/placeholder.svg" },
  { id: 2, name: "Galaxy S21", brand: "Samsung", model: "SM-G991B", color: "白色", memory: "256GB", camera: "64MP", price: 5499, stock: 80, status: "上架", image: "/placeholder.svg" },
  { id: 3, name: "Pixel 5", brand: "Google", model: "GD1YQ", color: "绿色", memory: "128GB", camera: "12.2MP", price: 4999, stock: 50, status: "预售", image: "/placeholder.svg" },
  { id: 4, name: "Mi 11", brand: "Xiaomi", model: "M2011K2C", color: "蓝色", memory: "256GB", camera: "108MP", price: 3999, stock: 120, status: "上架", image: "/placeholder.svg" },
]

export default function Dashboard() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [hasUnreadMessages, setHasUnreadMessages] = useState(true)
  const [users, setUsers] = useState(mockUsers)
  const [logs, setLogs] = useState(mockLogs)
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' })
  const [showAddUserDialog, setShowAddUserDialog] = useState(false)
  const [showEditUserDialog, setShowEditUserDialog] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [newUser, setNewUser] = useState({ employeeId: '', username: '', password: '', role: '', status: '活动' })
  const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const [searchTerm, setSearchTerm] = useState('')
  const [logSearchTerm, setLogSearchTerm] = useState('')
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [currentLogPage, setCurrentLogPage] = useState(1)
  const [logsPerPage] = useState(5)
  const [toast, setToast] = useState(null)
  const [activeTab, setActiveTab] = useState("userList")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [newUsername, setNewUsername] = useState(currentUser.username)
  const [newPhoneNumber, setNewPhoneNumber] = useState(currentUser.phoneNumber)
  const [products, setProducts] = useState(mockProducts)
  const [showAddProductDialog, setShowAddProductDialog] = useState(false)
  const [showEditProductDialog, setShowEditProductDialog] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [newProduct, setNewProduct] = useState({ 
    name: '', brand: '', model: '', color: '', memory: '', camera: '', 
    price: '', stock: '', description: '', status: '', category: '', image: '/placeholder.svg'
  })
  const [showDeleteProductConfirmDialog, setShowDeleteProductConfirmDialog] = useState(false)
  const [productToDelete, setProductToDelete] = useState(null)
  const [productSearchTerm, setProductSearchTerm] = useState('')
  const fileInputRef = useRef(null)

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

  const sortedUsers = [...users].sort((a, b) => {
    if (sortConfig.key === null) return 0;
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const filteredUsers = sortedUsers.filter(user =>
    user.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.status.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const indexOfLastUser = currentPage * itemsPerPage
  const indexOfFirstUser = indexOfLastUser - itemsPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  const sortedLogs = [...logs].sort((a, b) => {
    if (sortConfig.key === null) return 0;
    if (sortConfig.key === 'timestamp') {
      return sortConfig.direction === 'ascending'
        ? new Date(a.timestamp) - new Date(b.timestamp)
        : new Date(b.timestamp) - new Date(a.timestamp);
    }
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const filteredLogs = sortedLogs.filter(log => {
    const logDate = new Date(log.timestamp)
    const matchesSearch = log.employeeId.toLowerCase().includes(logSearchTerm.toLowerCase()) ||
                          log.username.toLowerCase().includes(logSearchTerm.toLowerCase()) ||
                          log.role.toLowerCase().includes(logSearchTerm.toLowerCase()) ||
                          log.action.toLowerCase().includes(logSearchTerm.toLowerCase())
    return logDate.getFullYear() === selectedYear && 
           logDate.getMonth() + 1 === selectedMonth &&
           matchesSearch
  })

  const indexOfLastLog = currentLogPage * logsPerPage
  const indexOfFirstLog = indexOfLastLog - logsPerPage
  const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog)

  const paginateLogs = (pageNumber) => setCurrentLogPage(pageNumber)

  const handleAddUser = () => {
    if (!newUser.employeeId || !newUser.username || !newUser.password || !newUser.role || !newUser.status) {
      showToast("所有字段都必须填写。", "error")
      return
    }
    setUsers([...users, { ...newUser, lastLogin: '-' }])
    setShowAddUserDialog(false)
    setNewUser({ employeeId: '', username: '', password: '', role: '', status: '活动' })
    showToast("新用户已添加。")
  }

  const handleEditUser = () => {
    setUsers(users.map(user => user.employeeId === editingUser.employeeId ? editingUser : user))
    setShowEditUserDialog(false)
    setEditingUser(null)
    showToast("用户信息已更新。")
  }

  const handleDeleteUser = () => {
    setUsers(users.filter(user => user.employeeId !== userToDelete.employeeId))
    setShowDeleteConfirmDialog(false)
    setUserToDelete(null)
    showToast("用户已从列表中移除。", "error")
  }

  const handleExportLogs = () => {
    const content = filteredLogs.map(log => 
      `${log.timestamp} - ${log.username} (${log.role}): ${log.action}`
    ).join('\n')

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `logs_${selectedYear}_${selectedMonth}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    showToast("日志已导出。")
  }

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      showToast("新密码和确认密码不匹配", "error")
      return
    }
    // Here you would typically send a request to your backend to change the password
    showToast("密码已成功更改", "success")
    setNewPassword("")
    setConfirmPassword("")
  }

  const handleChangeUserInfo = () => {
    // Here you would typically send a request to your backend to update user info
    showToast("用户信息已成功更新", "success")
  }

  const handleLogout = () => {
    // Here you would typically handle the logout logic
    showToast("您已成功退出登录", "info")
  }

  const handleAddProduct = () => {
    const requiredFields = [
      { key: 'name', label: '商品名称' },
      { key: 'brand', label: '品牌' },
      { key: 'model', label: '型号' },
      { key: 'color', label: '颜色' },
      { key: 'memory', label: '内存容量' },
      { key: 'camera', label: '相机像素' },
      { key: 'price', label: '价格' },
      { key: 'stock', label: '库存数量' },
      { key: 'status', label: '商品状态' },
      { key: 'category', label: '商品分类' }
    ];
    const emptyFields = requiredFields.filter(field => !newProduct[field.key]);

    if (emptyFields.length > 0) {
      showToast(`请填写以下必填项: ${emptyFields.map(field => field.label).join(', ')}`, 'error');
      return;
    }

    setProducts([...products, { id: products.length + 1, ...newProduct }])
    setShowAddProductDialog(false)
    setNewProduct({ 
      name: '', brand: '', model: '', color: '', memory: '', camera: '', 
      price: '', stock: '', description: '', status: '', category: '', image: '/placeholder.svg'
    })
    showToast("新商品已添加到列表中。")
  }

  const handleEditProduct = () => {
    setProducts(products.map(product => product.id === editingProduct.id ? editingProduct : product))
    setShowEditProductDialog(false)
    setEditingProduct(null)
    showToast("商品信息已更新。")
  }

  const handleDeleteProduct = () => {
    setProducts(products.filter(product => product.id !== productToDelete.id))
    setShowDeleteProductConfirmDialog(false)
    setProductToDelete(null)
    showToast("商品已从列表中移除。", 'error')
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      console.log("File uploaded:", file.name)
      showToast(`文件 "${file.name}" 已上传。在实际应用中，这里会处理文件并导入商品数据。`)
    }
  }

  const handleImageUpload = (event, setProductFunction) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProductFunction(prev => ({ ...prev, image: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const showToast = (message, type = 'info') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const sortedProducts = [...products].sort((a, b) => {
    if (sortConfig.key === null) return 0
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1
    }
    return 0
  })

  const filteredProducts = sortedProducts.filter(product => 
    product.name.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
    product.model.toLowerCase().includes(productSearchTerm.toLowerCase())
  )

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
          <div  className="flex items-center justify-center h-16 border-b border-gray-700">
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
                  !isExpanded && "justify-center",
                  item.active && (isDarkMode ? "bg-gray-700" : "bg-blue-700")
                )}
                onClick={() => setActiveTab(item.name)}
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
          <h1 className={cn("text-2xl font-semibold", isDarkMode ? "text-white" : "text-gray-800")}>
            {activeTab}
          </h1>
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
          {activeTab === "用户管理" && (
            <Tabs defaultValue="userList" className="w-full">
              <TabsList>
                <TabsTrigger value="userList">用户列表</TabsTrigger>
                <TabsTrigger value="logsList">日志管理</TabsTrigger>
              </TabsList>
              <TabsContent value="userList">
                <Card className={isDarkMode ? "bg-gray-800" : ""}>
                  <CardHeader>
                    <div  className="flex justify-between items-center">
                      <CardTitle className={isDarkMode ? "text-white" : ""}>用户列表</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Input
                          placeholder="搜索用户..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-64"
                        />
                        <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
                          <DialogTrigger asChild>
                            <Button>
                              <Plus className="mr-2 h-4 w-4" /> 添加用户
                            </Button>
                          </DialogTrigger>
                          <DialogContent className={isDarkMode ? "bg-gray-800 text-white" : ""}>
                            <DialogHeader>
                              <DialogTitle>添加新用户</DialogTitle>
                              <DialogDescription>
                                请填写新用户的信息。点击保存以添加用户。
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="employeeId" className="text-right">
                                  员工ID
                                </Label>
                                <Input
                                  id="employeeId"
                                  value={newUser.employeeId}
                                  onChange={(e) => setNewUser({...newUser, employeeId: e.target.value})}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="username" className="text-right">
                                  用户名
                                </Label>
                                <Input
                                  id="username"
                                  value={newUser.username}
                                  onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="password" className="text-right">
                                  密码
                                </Label>
                                <Input
                                  id="password"
                                  type="password"
                                  value={newUser.password}
                                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="role" className="text-right">
                                  角色
                                </Label>
                                <Select onValueChange={(value) => setNewUser({...newUser, role: value})}>
                                  <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="选择角色" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {roles.map((role) => (
                                      <SelectItem key={role} value={role}>
                                        {role}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="status" className="text-right">
                                  状态
                                </Label>
                                <Select onValueChange={(value) => setNewUser({...newUser, status: value})}>
                                  <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="选择状态" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {statuses.map((status) => (
                                      <SelectItem key={status} value={status}>
                                        {status}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button type="submit" onClick={handleAddUser}>保存</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[150px]">
                            <div className="flex items-center">
                              <Button variant="ghost" onClick={() => handleSort('employeeId')}>
                                {sortConfig.key === 'employeeId' ? (
                                  sortConfig.direction === 'ascending' ? (
                                    <ChevronUp className="h-4 w-4" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4" />
                                  )
                                ) : (
                                  <ChevronUp className="h-4 w-4 opacity-50" />
                                )}
                              </Button>
                              员工ID
                            </div>
                          </TableHead>
                          <TableHead className="w-[150px]">
                            <div className="flex items-center">
                              <Button variant="ghost" onClick={() => handleSort('username')}>
                                {sortConfig.key === 'username' ? (
                                  sortConfig.direction === 'ascending' ? (
                                    <ChevronUp className="h-4 w-4" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4" />
                                  )
                                ) : (
                                  <ChevronUp className="h-4 w-4 opacity-50" />
                                )}
                              </Button>
                              用户名
                            </div>
                          </TableHead>
                          <TableHead className="w-[150px]">
                            <div className="flex items-center">
                              <Button variant="ghost" onClick={() => handleSort('role')}>
                                {sortConfig.key === 'role' ? (
                                  sortConfig.direction === 'ascending' ? (
                                    <ChevronUp className="h-4 w-4" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4" />
                                  )
                                ) : (
                                  <ChevronUp className="h-4 w-4 opacity-50" />
                                )}
                              </Button>
                              角色
                            </div>
                          </TableHead>
                          <TableHead>
                            <div className="flex items-center">
                              <Button variant="ghost" onClick={() => handleSort('lastLogin')}>
                                {sortConfig.key === 'lastLogin' ? (
                                  sortConfig.direction === 'ascending' ? (
                                    <ChevronUp className="h-4 w-4" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4" />
                                  )
                                ) : (
                                  <ChevronUp className="h-4 w-4 opacity-50" />
                                )}
                              </Button>
                              最后登录时间
                            </div>
                          </TableHead>
                          <TableHead>状态</TableHead>
                          <TableHead className="text-right">操作</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentUsers.map((user) => (
                          <TableRow key={user.employeeId}>
                            <TableCell className="font-medium">{user.employeeId}</TableCell>
                            <TableCell>{user.username}</TableCell>
                            <TableCell>{user.role}</TableCell>
                            <TableCell>{user.lastLogin}</TableCell>
                            <TableCell>{user.status}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => {
                                setEditingUser(user)
                                setShowEditUserDialog(true)
                              }}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => {
                                setUserToDelete(user)
                                setShowDeleteConfirmDialog(true)
                              }}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <div className="flex justify-between items-center mt-4">
                      <div>
                        总用户数: {users.length}
                      </div>
                      <div className="flex space-x-2">
                        {Array.from({ length: Math.ceil(filteredUsers.length / itemsPerPage) }, (_, i) => (
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
              <TabsContent value="logsList">
                <Card className={cn("mt-6", isDarkMode ? "bg-gray-800" : "")}>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className={isDarkMode ? "text-white" : ""}>日志管理</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Input
                          placeholder="搜索日志..."
                          value={logSearchTerm}
                          onChange={(e) => setLogSearchTerm(e.target.value)}
                          className="w-64"
                        />
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-[280px] justify-start text-left font-normal">
                              <Calendar className="mr-2 h-4 w-4" />
                              {selectedYear}年{selectedMonth}月
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80">
                            <div className="flex justify-between items-center mb-4">
                              <Button variant="outline" size="sm" onClick={() => setSelectedYear(selectedYear - 1)}>
                                <ChevronLeft className="h-4 w-4" />
                              </Button>
                              <div className="font-semibold">{selectedYear}</div>
                              <Button variant="outline" size="sm" onClick={() => setSelectedYear(selectedYear + 1)}>
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                              {Array.from({ length: 12 }, (_, i) => (
                                <Button
                                  key={i}
                                  variant={selectedMonth === i + 1 ? "default" : "outline"}
                                  onClick={() => setSelectedMonth(i + 1)}
                                >
                                  {String(i + 1).padStart(2, '0')}
                                </Button>
                              ))}
                            </div>
                          </PopoverContent>
                        </Popover>
                        <Button onClick={handleExportLogs}>
                          <Download className="mr-2 h-4 w-4" /> 导出日志
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[150px]">
                            <div className="flex items-center">
                              <Button variant="ghost" onClick={() => handleSort('employeeId')}>
                                {sortConfig.key === 'employeeId' ? (
                                  sortConfig.direction === 'ascending' ? (
                                    <ChevronUp className="h-4 w-4" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4" />
                                  )
                                ) : (
                                  <ChevronUp className="h-4 w-4 opacity-50" />
                                )}
                              </Button>
                              员工ID
                            </div>
                          </TableHead>
                          <TableHead className="w-[150px]">
                            <div className="flex items-center">
                              <Button variant="ghost" onClick={() => handleSort('username')}>
                                {sortConfig.key === 'username' ? (
                                  sortConfig.direction === 'ascending' ? (
                                    <ChevronUp className="h-4 w-4" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4" />
                                  )
                                ) : (
                                  <ChevronUp className="h-4 w-4 opacity-50" />
                                )}
                              </Button>
                              用户名
                            </div>
                          </TableHead>
                          <TableHead className="w-[150px]">
                            <div className="flex items-center">
                              <Button variant="ghost" onClick={() => handleSort('role')}>
                                {sortConfig.key === 'role' ? (
                                  sortConfig.direction === 'ascending' ? (
                                    <ChevronUp className="h-4 w-4" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4" />
                                  )
                                ) : (
                                  <ChevronUp className="h-4 w-4 opacity-50" />
                                )}
                              </Button>
                              角色
                            </div>
                          </TableHead>
                          <TableHead className="w-[200px]">操作</TableHead>
                          <TableHead className="w-[200px]">
                            <div className="flex items-center">
                              <Button variant="ghost" onClick={() => handleSort('timestamp')}>
                                {sortConfig.key === 'timestamp' ? (
                                  sortConfig.direction === 'ascending' ? (
                                    <ChevronUp className="h-4 w-4" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4" />
                                  )
                                ) : (
                                  <ChevronUp className="h-4 w-4 opacity-50" />
                                )}
                              </Button>
                              时间
                            </div>
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentLogs.map((log) => (
                          <TableRow key={log.id}>
                            <TableCell className="font-medium">{log.employeeId}</TableCell>
                            <TableCell>{log.username}</TableCell>
                            <TableCell>{log.role}</TableCell>
                            <TableCell>{log.action}</TableCell>
                            <TableCell>{log.timestamp}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <div className="flex justify-between items-center mt-4">
                      <div>
                        总日志数: {filteredLogs.length}
                      </div>
                      <div className="flex space-x-2">
                        {Array.from({ length: Math.ceil(filteredLogs.length / logsPerPage) }, (_, i) => (
                          <Button
                            key={i}
                            variant={currentLogPage === i + 1 ? "default" : "outline"}
                            onClick={() => paginateLogs(i + 1)}
                          >
                            {i + 1}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
          {activeTab === "系统设置" && (
            <Tabs defaultValue="basicInfo" className="w-full">
              <TabsList>
                <TabsTrigger value="basicInfo">用户基本信息</TabsTrigger>
                <TabsTrigger value="changeInfo">用户信息更改</TabsTrigger>
              </TabsList>
              <TabsContent value="basicInfo">
                <Card className={isDarkMode ? "bg-gray-800" : ""}>
                  <CardHeader>
                    <CardTitle className={isDarkMode ? "text-white" : ""}>用户基本信息</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>员工ID</Label>
                          <Input value={currentUser.employeeId} disabled />
                        </div>
                        <div>
                          <Label>系统用户名</Label>
                          <Input value={currentUser.username} disabled />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>姓名</Label>
                          <Input value={currentUser.name} disabled />
                        </div>
                        <div>
                          <Label>性别</Label>
                          <Input value={currentUser.gender} disabled />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>年龄</Label>
                          <Input value={currentUser.age} disabled />
                        </div>
                        <div>
                          <Label>权限等级</Label>
                          <Input value={currentUser.role} disabled />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>部门</Label>
                          <Input value={currentUser.department} disabled />
                        </div>
                        <div>
                          <Label>入职日期</Label>
                          <Input value={currentUser.hireDate} disabled />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>状态</Label>
                          <Input value={currentUser.status} disabled />
                        </div>
                        <div>
                          <Label>账户创建时间</Label>
                          <Input value={currentUser.createdAt} disabled />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="changeInfo">
                <Card className={isDarkMode ? "bg-gray-800" : ""}>
                  <CardHeader>
                    <CardTitle className={isDarkMode ? "text-white" : ""}>用户信息更改</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="newPassword">新密码</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="confirmPassword">确认新密码</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>
                      <Button onClick={handleChangePassword}>修改密码</Button>
                      <div>
                        <Label htmlFor="newUsername">新用户名</Label>
                        <Input
                          id="newUsername"
                          value={newUsername}
                          onChange={(e) => setNewUsername(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="newPhoneNumber">新联系电话</Label>
                        <Input
                          id="newPhoneNumber"
                          value={newPhoneNumber}
                          onChange={(e) => setNewPhoneNumber(e.target.value)}
                        />
                      </div>
                      <Button onClick={handleChangeUserInfo}>更新用户信息</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
          {activeTab === "商品信息维护" && (
            <Card className={isDarkMode ? "bg-gray-800" : ""}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className={isDarkMode ? "text-white" : ""}>商品列表</CardTitle>
                  <div className="flex space-x-2">
                    <Dialog open={showAddProductDialog} onOpenChange={setShowAddProductDialog}>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="mr-2 h-4 w-4" /> 添加商品
                        </Button>
                      </DialogTrigger>
                      <DialogContent className={cn("max-w-4xl", isDarkMode ? "bg-gray-800 text-white" : "")}>
                        <DialogHeader>
                          <DialogTitle>添加新商品</DialogTitle>
                          <DialogDescription>
                            请填写新商品的信息。点击保存以添加商品。
                          </DialogDescription>
                        </DialogHeader>
                        <Tabs defaultValue="basic" className="w-full">
                          <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="basic">基本信息</TabsTrigger>
                            <TabsTrigger value="details">详细信息</TabsTrigger>
                            <TabsTrigger value="image">商品图片</TabsTrigger>
                          </TabsList>
                          <TabsContent value="basic">
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                  商品名称 <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                  id="name"
                                  value={newProduct.name}
                                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                                  className="col-span-3"
                                  required
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="brand" className="text-right">
                                  品牌 <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                  id="brand"
                                  value={newProduct.brand}
                                  onChange={(e) => setNewProduct({...newProduct, brand: e.target.value})}
                                  className="col-span-3"
                                  required
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="model" className="text-right">
                                  型号 <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                  id="model"
                                  value={newProduct.model}
                                  onChange={(e) => setNewProduct({...newProduct, model: e.target.value})}
                                  className="col-span-3"
                                  required
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="color" className="text-right">
                                  颜色 <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                  id="color"
                                  value={newProduct.color}
                                  onChange={(e) => setNewProduct({...newProduct, color: e.target.value})}
                                  className="col-span-3"
                                  required
                                />
                              </div>
                            </div>
                          </TabsContent>
                          <TabsContent value="details">
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="memory" className="text-right">
                                  内存容量 <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                  id="memory"
                                  value={newProduct.memory}
                                  onChange={(e) => setNewProduct({...newProduct, memory: e.target.value})}
                                  className="col-span-3"
                                  required
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="camera" className="text-right">
                                  相机像素 <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                  id="camera"
                                  value={newProduct.camera}
                                  onChange={(e) => setNewProduct({...newProduct, camera: e.target.value})}
                                  className="col-span-3"
                                  required
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="price" className="text-right">
                                  价格 <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                  id="price"
                                  type="number"
                                  value={newProduct.price}
                                  onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                                  className="col-span-3"
                                  required
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="stock" className="text-right">
                                  库存数量 <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                  id="stock"
                                  type="number"
                                  value={newProduct.stock}
                                  onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                                  className="col-span-3"
                                  required
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="description" className="text-right">
                                  商品描述
                                </Label>
                                <Textarea
                                  id="description"
                                  value={newProduct.description}
                                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="status" className="text-right">
                                  商品状态 <span className="text-red-500">*</span>
                                </Label>
                                <Select onValueChange={(value) => setNewProduct({...newProduct, status: value})} required>
                                  <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="选择商品状态" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {productStatus.map((status) => (
                                      <SelectItem key={status} value={status}>
                                        {status}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="category" className="text-right">
                                  商品分类 <span className="text-red-500">*</span>
                                </Label>
                                <Select onValueChange={(value) => setNewProduct({...newProduct, category: value})} required>
                                  <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="选择商品分类" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {productCategories.map((category) => (
                                      <SelectItem key={category} value={category}>
                                        {category}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </TabsContent>
                          <TabsContent value="image">
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="image" className="text-right">
                                  预览图
                                </Label>
                                <div className="col-span-3 flex items-center gap-4">
                                  <Image
                                    src={newProduct.image}
                                    alt="Product preview"
                                    width={100}
                                    height={100}
                                    className="object-cover rounded-md"
                                  />
                                  <Input
                                    id="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(e, setNewProduct)}
                                  />
                                </div>
                              </div>
                            </div>
                          </TabsContent>
                        </Tabs>
                        <DialogFooter>
                          <Button type="submit" onClick={handleAddProduct}>保存</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Button onClick={() => fileInputRef.current.click()}>
                      <Upload className="mr-2 h-4 w-4" /> 批量导入
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      style={{ display: 'none' }}
                      accept=".csv,.xlsx,.xls"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <Input
                    placeholder="搜索商品..."
                    value={productSearchTerm}
                    onChange={(e) => setProductSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">预览图</TableHead>
                      <TableHead>商品名称</TableHead>
                      <TableHead>品牌</TableHead>
                      <TableHead>型号</TableHead>
                      <TableHead>颜色</TableHead>
                      <TableHead>内存容量</TableHead>
                      <TableHead>相机像素</TableHead>
                      <TableHead>
                        价格
                        <Button variant="ghost" onClick={() => handleSort('price')}>
                          {sortConfig.key === 'price' ? (
                            sortConfig.direction === 'ascending' ? (
                              <ChevronUp className="ml-2 h-4 w-4" />
                            ) : (
                              <ChevronDown className="ml-2 h-4 w-4" />
                            )
                          ) : (
                            <ChevronUp className="ml-2 h-4 w-4 opacity-50" />
                          )}
                        </Button>
                      </TableHead>
                      <TableHead>
                        库存
                        <Button variant="ghost" onClick={() => handleSort('stock')}>
                          {sortConfig.key === 'stock' ? (
                            sortConfig.direction === 'ascending' ? (
                              <ChevronUp className="ml-2 h-4 w-4" />
                            ) : (
                              <ChevronDown className="ml-2 h-4 w-4" />
                            )
                          ) : (
                            <ChevronUp className="ml-2 h-4 w-4 opacity-50" />
                          )}
                        </Button>
                      </TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <Image
                            src={product.image}
                            alt={product.name}
                            width={50}
                            height={50}
                            className="object-cover rounded-md"
                          />
                        </TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.brand}</TableCell>
                        <TableCell>{product.model}</TableCell>
                        <TableCell>{product.color}</TableCell>
                        <TableCell>{product.memory}</TableCell>
                        <TableCell>{product.camera}</TableCell>
                        <TableCell>{product.price}</TableCell>
                        <TableCell>{product.stock}</TableCell>
                        <TableCell>{product.status}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => {
                            setEditingProduct(product)
                            setShowEditProductDialog(true)
                          }}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => {
                            setProductToDelete(product)
                            setShowDeleteProductConfirmDialog(true)
                          }}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
          <div className="mt-6">
            <Button onClick={handleLogout} variant="destructive">
              <LogOut className="mr-2 h-4 w-4" /> 退出登录
            </Button>
          </div>
        </main>
      </div>

      {/* Edit User Dialog */}
      <Dialog open={showEditUserDialog} onOpenChange={setShowEditUserDialog}>
        <DialogContent className={isDarkMode ? "bg-gray-800 text-white" : ""}>
          <DialogHeader>
            <DialogTitle>编辑用户</DialogTitle>
            <DialogDescription>
              修改用户信息。点击保存以更新用户。
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-employeeId" className="text-right">
                员工ID
              </Label>
              <Input
                id="edit-employeeId"
                value={editingUser?.employeeId || ''}
                onChange={(e) => setEditingUser({...editingUser, employeeId: e.target.value})}
                className="col-span-3"
                disabled
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-username" className="text-right">
                用户名
              </Label>
              <Input
                id="edit-username"
                value={editingUser?.username || ''}
                onChange={(e) => setEditingUser({...editingUser, username: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-role" className="text-right">
                角色
              </Label>
              <Select 
                value={editingUser?.role} 
                onValueChange={(value) => setEditingUser({...editingUser, role: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="选择角色" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-status" className="text-right">
                状态
              </Label>
              <Select 
                value={editingUser?.status} 
                onValueChange={(value) => setEditingUser({...editingUser, status: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="选择状态" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleEditUser}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Confirmation Dialog */}
      <Dialog open={showDeleteConfirmDialog} onOpenChange={setShowDeleteConfirmDialog}>
        <DialogContent className={isDarkMode ? "bg-gray-800 text-white" : ""}>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>
              您确定要删除此用户吗？此操作无法撤销。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirmDialog(false)}>取消</Button>
            <Button variant="destructive" onClick={handleDeleteUser}>删除</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={showEditProductDialog} onOpenChange={setShowEditProductDialog}>
        <DialogContent className={cn("max-w-4xl", isDarkMode ? "bg-gray-800 text-white" : "")}>
          <DialogHeader>
            <DialogTitle>编辑商品</DialogTitle>
            <DialogDescription>
              修改商品信息。点击保存以更新商品。
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">基本信息</TabsTrigger>
              <TabsTrigger value="details">详细信息</TabsTrigger>
              <TabsTrigger value="image">商品图片</TabsTrigger>
            </TabsList>
            <TabsContent value="basic">
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-name" className="text-right">
                    商品名称
                  </Label>
                  <Input
                    id="edit-name"
                    value={editingProduct?.name || ''}
                    onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-brand" className="text-right">
                    品牌
                  </Label>
                  <Input
                    id="edit-brand"
                    value={editingProduct?.brand || ''}
                    onChange={(e) => setEditingProduct({...editingProduct, brand: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-model" className="text-right">
                    型号
                  </Label>
                  <Input
                    id="edit-model"
                    value={editingProduct?.model || ''}
                    onChange={(e) => setEditingProduct({...editingProduct, model: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-color" className="text-right">
                    颜色
                  </Label>
                  <Input
                    id="edit-color"
                    value={editingProduct?.color || ''}
                    onChange={(e) => setEditingProduct({...editingProduct, color: e.target.value})}
                    className="col-span-3"
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="details">
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-memory" className="text-right">
                    内存容量
                  </Label>
                  <Input
                    id="edit-memory"
                    value={editingProduct?.memory || ''}
                    onChange={(e) => setEditingProduct({...editingProduct, memory: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-camera" className="text-right">
                    相机像素
                  </Label>
                  <Input
                    id="edit-camera"
                    value={editingProduct?.camera || ''}
                    onChange={(e) => setEditingProduct({...editingProduct, camera: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-price" className="text-right">
                    价格
                  </Label>
                  <Input
                    id="edit-price"
                    type="number"
                    value={editingProduct?.price || ''}
                    onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-stock" className="text-right">
                    库存数量
                  </Label>
                  <Input
                    id="edit-stock"
                    type="number"
                    value={editingProduct?.stock || ''}
                    onChange={(e) => setEditingProduct({...editingProduct, stock: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-description" className="text-right">
                    商品描述
                  </Label>
                  <Textarea
                    id="edit-description"
                    value={editingProduct?.description || ''}
                    onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-status" className="text-right">
                    商品状态
                  </Label>
                  <Select 
                    value={editingProduct?.status} 
                    onValueChange={(value) => setEditingProduct({...editingProduct, status: value})}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="选择商品状态" />
                    </SelectTrigger>
                    <SelectContent>
                      {productStatus.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="image">
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-image" className="text-right">
                    预览图
                  </Label>
                  <div className="col-span-3 flex items-center gap-4">
                    <Image
                      src={editingProduct?.image || '/placeholder.svg'}
                      alt="Product preview"
                      width={90}
                      height={160}
                      className="object-cover rounded-md"
                    />
                    <Input
                      id="edit-image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, setEditingProduct)}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          <DialogFooter>
            <Button type="submit" onClick={handleEditProduct}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Product Confirmation Dialog */}
      <Dialog open={showDeleteProductConfirmDialog} onOpenChange={setShowDeleteProductConfirmDialog}>
        <DialogContent className={isDarkMode ? "bg-gray-800 text-white" : ""}>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>
              您确定要删除商品 "{productToDelete?.name}" 吗？此操作不可撤销。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteProductConfirmDialog(false)}>取消</Button>
            <Button variant="destructive" onClick={handleDeleteProduct}>删除</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Toast */}
      {toast && (
        <div className={cn(
          "fixed bottom-4 right-4 z-50 p-4 rounded-md shadow-lg",
          toast.type === 'error' ? "bg-red-500" : "bg-green-500",
          "text-white"
        )}>
          {toast.message}
        </div>
      )}
    </div>
  )
}