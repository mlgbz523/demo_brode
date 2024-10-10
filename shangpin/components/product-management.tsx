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
import { Textarea } from "@/components/ui/textarea"
// import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const menuItems = [
  { icon: Users, name: "用户管理" },
  { icon: Package, name: "商品信息维护", active: true },
  { icon: FileText, name: "商品数据分析" },
]

const mockProducts = [
  { id: 1, name: "iPhone 12", brand: "Apple", model: "A2404", color: "黑色", memory: "128GB", camera: "12MP", price: 5999, stock: 100, status: "上架", image: "/placeholder.svg" },
  { id: 2, name: "Galaxy S21", brand: "Samsung", model: "SM-G991B", color: "白色", memory: "256GB", camera: "64MP", price: 5499, stock: 80, status: "上架", image: "/placeholder.svg" },
  { id: 3, name: "Pixel 5", brand: "Google", model: "GD1YQ", color: "绿色", memory: "128GB", camera: "12.2MP", price: 4999, stock: 50, status: "预售", image: "/placeholder.svg" },
  { id: 4, name: "Mi 11", brand: "Xiaomi", model: "M2011K2C", color: "蓝色", memory: "256GB", camera: "108MP", price: 3999, stock: 120, status: "上架", image: "/placeholder.svg" },
]

const productStatus = ["上架", "下架", "预售"]
const productCategories = ["旗舰机", "中端机", "入门机"]

export default function ProductManagement() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [hasUnreadMessages, setHasUnreadMessages] = useState(true)
  const [products, setProducts] = useState(mockProducts)
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' })
  const [showAddProductDialog, setShowAddProductDialog] = useState(false)
  const [showEditProductDialog, setShowEditProductDialog] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [newProduct, setNewProduct] = useState({ 
    name: '', brand: '', model: '', color: '', memory: '', camera: '', 
    price: '', stock: '', description: '', status: '', category: '', image: '/placeholder.svg'
  })
  const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] = useState(false)
  const [productToDelete, setProductToDelete] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const fileInputRef = useRef(null)
  const { toast } = useToast()

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

  const sortedProducts = [...products].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1
    }
    return 0
  })

  const filteredProducts = sortedProducts.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.model.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddProduct = () => {
    setProducts([...products, { id: products.length + 1, ...newProduct }])
    setShowAddProductDialog(false)
    setNewProduct({ 
      name: '', brand: '', model: '', color: '', memory: '', camera: '', 
      price: '', stock: '', description: '', status: '', category: '', image: '/placeholder.svg'
    })
    toast({
      title: "保存成功",
      description: "新商品已添加到列表中。",
      duration: 2000,
    })
  }

  const handleEditProduct = () => {
    setProducts(products.map(product => product.id === editingProduct.id ? editingProduct : product))
    setShowEditProductDialog(false)
    setEditingProduct(null)
    toast({
      title: "保存成功",
      description: "商品信息已更新。",
      duration: 2000,
    })
  }

  const handleDeleteProduct = () => {
    setProducts(products.filter(product => product.id !== productToDelete.id))
    setShowDeleteConfirmDialog(false)
    setProductToDelete(null)
    toast({
      title: "删除成功",
      description: "商品已从列表中移除。",
      duration: 2000,
    })
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      console.log("File uploaded:", file.name)
      toast({
        title: "文件上传成功",
        description: `文件 "${file.name}" 已上传。在实际应用中，这里会处理文件并导入商品数据。`,
        duration: 2000,
      })
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
          <h1 className={cn("text-2xl font-semibold", isDarkMode ? "text-white" : "text-gray-800")}>商品信息维护</h1>
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
                                商品名称
                              </Label>
                              <Input
                                id="name"
                                value={newProduct.name}
                                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="brand" className="text-right">
                                品牌
                              </Label>
                              <Input
                                id="brand"
                                value={newProduct.brand}
                                onChange={(e) => setNewProduct({...newProduct, brand: e.target.value})}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="model" className="text-right">
                                型号
                              </Label>
                              <Input
                                id="model"
                                value={newProduct.model}
                                onChange={(e) => setNewProduct({...newProduct, model: e.target.value})}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="color" className="text-right">
                                颜色
                              </Label>
                              <Input
                                id="color"
                                value={newProduct.color}
                                onChange={(e) => setNewProduct({...newProduct, color: e.target.value})}
                                className="col-span-3"
                              />
                            </div>
                          </div>
                        </TabsContent>
                        <TabsContent value="details">
                
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="memory" className="text-right">
                                内存容量
                              </Label>
                              <Input
                                id="memory"
                                value={newProduct.memory}
                                onChange={(e) => setNewProduct({...newProduct, memory: e.target.value})}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="camera" className="text-right">
                                相机像素
                              </Label>
                              <Input
                                id="camera"
                                value={newProduct.camera}
                                onChange={(e) => setNewProduct({...newProduct, camera: e.target.value})}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="price" className="text-right">
                                价格
                              </Label>
                              <Input
                                id="price"
                                type="number"
                                value={newProduct.price}
                                onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="stock" className="text-right">
                                库存数量
                              </Label>
                              <Input
                                id="stock"
                                type="number"
                                value={newProduct.stock}
                                onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                                className="col-span-3"
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
                                商品状态
                              </Label>
                              <Select onValueChange={(value) => setNewProduct({...newProduct, status: value})}>
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
                                商品分类
                              </Label>
                              <Select onValueChange={(value) => setNewProduct({...newProduct, category: value})}>
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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
                          setShowDeleteConfirmDialog(true)
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
        </main>
      </div>

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
                      width={100}
                      height={100}
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirmDialog} onOpenChange={setShowDeleteConfirmDialog}>
        <DialogContent className={isDarkMode ? "bg-gray-800 text-white" : ""}>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>
              您确定要删除商品 "{productToDelete?.name}" 吗？此操作不可撤销。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirmDialog(false)}>取消</Button>
            <Button variant="destructive" onClick={handleDeleteProduct}>删除</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}