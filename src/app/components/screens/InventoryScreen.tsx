import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Progress } from '@/app/components/ui/progress';
import { 
  Package, 
  Sparkles,
  AlertTriangle,
  TrendingDown,
  Search,
  Plus,
  Zap,
  Box
} from 'lucide-react';

const rawMaterials = [
  { 
    name: 'Solar Cells', 
    unit: 'Units',
    totalStock: 1200, 
    reserved: 950, 
    available: 250, 
    minStock: 500,
    status: 'critical',
    supplier: 'Cell Suppliers Inc',
    lastOrder: '2 days ago'
  },
  { 
    name: 'Tempered Glass', 
    unit: 'Sheets',
    totalStock: 850, 
    reserved: 400, 
    available: 450, 
    minStock: 300,
    status: 'good',
    supplier: 'Glass World',
    lastOrder: '5 days ago'
  },
  { 
    name: 'EVA Film', 
    unit: 'Rolls',
    totalStock: 320, 
    reserved: 180, 
    available: 140, 
    minStock: 100,
    status: 'good',
    supplier: 'Polymer Tech',
    lastOrder: '1 week ago'
  },
  { 
    name: 'Aluminum Frame', 
    unit: 'Pieces',
    totalStock: 680, 
    reserved: 520, 
    available: 160, 
    minStock: 200,
    status: 'warning',
    supplier: 'Frame Masters',
    lastOrder: '3 days ago'
  },
  { 
    name: 'Junction Box', 
    unit: 'Units',
    totalStock: 950, 
    reserved: 350, 
    available: 600, 
    minStock: 200,
    status: 'good',
    supplier: 'Electric Components',
    lastOrder: '4 days ago'
  },
  { 
    name: 'Backsheet', 
    unit: 'Sheets',
    totalStock: 540, 
    reserved: 280, 
    available: 260, 
    minStock: 150,
    status: 'good',
    supplier: 'Solar Materials Co',
    lastOrder: '1 week ago'
  },
];

const finishedGoods = [
  { 
    module: '400W Poly', 
    stock: 240, 
    reserved: 180, 
    available: 60,
    location: 'Warehouse A' 
  },
  { 
    module: '450W Mono', 
    stock: 180, 
    reserved: 120, 
    available: 60,
    location: 'Warehouse A' 
  },
  { 
    module: '500W Bifacial', 
    stock: 95, 
    reserved: 75, 
    available: 20,
    location: 'Warehouse B' 
  },
];

export function InventoryScreen() {
  const totalProductionCapacity = 460; // KW

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Inventory Management</h2>
          <p className="text-sm text-gray-500 mt-1">Raw materials & finished goods tracking</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Create Purchase Order
        </Button>
      </div>

      {/* AI Production Capacity Alert */}
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">AI Inventory Intelligence</h3>
              <p className="text-sm text-gray-700">
                <strong>Production capacity possible: {totalProductionCapacity} KW</strong>
                <br />
                Limiting factor: <strong>Solar Cells (250 units available)</strong>. 
                Current stock can produce 460 KW of panels. Reorder recommended to meet next week's demand of 680 KW.
              </p>
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="default" className="bg-purple-600 hover:bg-purple-700">
                  Generate Reorder Suggestion
                </Button>
                <Button size="sm" variant="outline">
                  View Analysis
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Capacity Indicator */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900">Current Production Capacity</h3>
            <p className="text-sm text-gray-500">Based on available raw materials</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-blue-600">{totalProductionCapacity} KW</p>
            <p className="text-xs text-gray-500">~1,150 panels</p>
          </div>
        </div>
        <Progress value={68} className="h-3" />
        <div className="flex justify-between text-sm text-gray-600 mt-2">
          <span>68% of weekly target (680 KW)</span>
          <span>Need: +220 KW capacity</span>
        </div>
      </Card>

      {/* Search Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="Search materials..." className="pl-10" />
        </div>
        <Button variant="outline">Filter by Status</Button>
      </div>

      {/* Raw Materials Table */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Raw Materials Inventory</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr>
                <th className="text-left p-3 text-sm font-semibold text-gray-900">Material</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-900">Total Stock</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-900">Reserved</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-900">Available</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-900">Min Stock</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-900">Status</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-900">Supplier</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rawMaterials.map((material) => {
                const stockPercentage = (material.available / material.totalStock) * 100;
                return (
                  <tr key={material.name} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{material.name}</p>
                          <p className="text-xs text-gray-500">Last order: {material.lastOrder}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-sm text-gray-900">
                      {material.totalStock} {material.unit}
                    </td>
                    <td className="p-3 text-sm text-gray-600">
                      {material.reserved} {material.unit}
                    </td>
                    <td className="p-3">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-900">
                          {material.available} {material.unit}
                        </p>
                        <div className="flex items-center gap-2">
                          <Progress value={stockPercentage} className="h-1 w-20" />
                          <span className="text-xs text-gray-500">{Math.round(stockPercentage)}%</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-sm text-gray-600">
                      {material.minStock} {material.unit}
                    </td>
                    <td className="p-3">
                      <Badge className={
                        material.status === 'critical' ? 'bg-red-100 text-red-700' :
                        material.status === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }>
                        {material.status === 'critical' && <AlertTriangle className="w-3 h-3 mr-1" />}
                        {material.status === 'warning' && <TrendingDown className="w-3 h-3 mr-1" />}
                        {material.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-sm text-gray-600">{material.supplier}</td>
                    <td className="p-3">
                      <Button size="sm" variant="outline">Reorder</Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Finished Goods */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Box className="w-5 h-5" />
          Finished Goods Inventory
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {finishedGoods.map((item) => (
            <Card key={item.module} className="p-4 border-2">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900">{item.module}</h4>
                <Badge variant="outline">{item.location}</Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Stock:</span>
                  <span className="font-medium text-gray-900">{item.stock} panels</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Reserved:</span>
                  <span className="text-gray-700">{item.reserved} panels</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Available:</span>
                  <span className="font-semibold text-blue-600">{item.available} panels</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Zap className="w-4 h-4" />
                  <span>Capacity: {item.available * (parseInt(item.module) / 1000)} KW</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
}
