"use client"

import { useState, useEffect } from "react"
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
  Download
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

const menuItems = [
  { icon: Users, name: "用户管理", active: true },
  { icon: Package, name: "商品信息维护" },
  { icon: FileText, name: "商品数据分析" },
]

const roles = ["管理员", "销售人员", "库管人员", "财务人员"]
const statuses = ["活动", "停用"]

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
      
      logs.push({
        id: logs.length + 1,
        username: `user${Math.floor(Math.random() * 20) + 1}`,
        role: roles[Math.floor(Math.random() * roles.length)],
        action: actions[Math.floor(Math.random() * actions.length)],
        timestamp: timestamp
      })
    }
  }

  return logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
}

const mockUsers = generateMockUsers()
const mockLogs = generateMockLogs()

export  function UserManagement() {
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
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [currentLogPage, setCurrentLogPage] = useState(1)
  const [logsPerPage] = useState(5)
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'info', duration = 3000) => {
    setToast({ message, type })
    setTimeout(() => setToast(null), duration)
  }

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
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1
    }
    return 0
  })

  const filteredLogs = sortedLogs.filter(log => {
    const logDate = new Date(log.timestamp)
    return logDate.getFullYear() === selectedYear && logDate.getMonth() + 1 === selectedMonth
  })

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
          <h1 className={cn("text-2xl font-semibold", isDarkMode ? "text-white" : "text-gray-800")}>用户管理</h1>
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
                    <TableHead className="w-[100px]">
                      员工ID
                      <Button variant="ghost" onClick={() => handleSort('employeeId')}>
                        {sortConfig.key === 'employeeId' ? (
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
                    <TableHead className="w-[100px]">
                      用户名
                      <Button variant="ghost" onClick={() => handleSort('username')}>
                        {sortConfig.key === 'username' ? (
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
                    <TableHead className="w-[150px]">
                      角色
                      <Button variant="ghost" onClick={() => handleSort('role')}>
                        {sortConfig.key === 'role' ? (
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
                      最后登录时间
                      <Button variant="ghost" onClick={() => handleSort('lastLogin')}>
                        {sortConfig.key === 'lastLogin' ? (
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

          <Card className={cn("mt-6", isDarkMode ? "bg-gray-800" : "")}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className={isDarkMode ? "text-white" : ""}>日志管理</CardTitle>
                <div className="flex items-center space-x-2">
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
                    <TableHead className="w-[100px]">用户名</TableHead>
                    <TableHead className="w-[150px]">
                      角色
                      <Button variant="ghost" onClick={() => handleSort('role')}>
                        {sortConfig.key === 'role' ? (
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
                    <TableHead>操作</TableHead>
                    <TableHead>
                      时间
                      <Button variant="ghost" onClick={() => handleSort('timestamp')}>
                        {sortConfig.key === 'timestamp' ? (
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs
                    .slice((currentLogPage - 1) * logsPerPage, currentLogPage * logsPerPage)
                    .map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-medium">{log.username}</TableCell>
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
                      onClick={() => setCurrentLogPage(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirmDialog} onOpenChange={setShowDeleteConfirmDialog}>
        <DialogContent className={cn(isDarkMode ? "bg-gray-800 text-white" : "", "bg-red-100")}>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>
              您确定要删除用户 "{userToDelete?.username}" (员工ID: {userToDelete?.employeeId}) 吗？此操作不可撤销。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirmDialog(false)}>取消</Button>
            <Button variant="destructive" onClick={handleDeleteUser}>删除</Button>
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
            ✕
          </button>
        </div>
      )}
    </div>
  )
}