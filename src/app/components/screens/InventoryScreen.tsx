import { useMemo, useState } from 'react';
import type { InventoryItem, PurchaseOrder } from '@/app/store/AppStore';
import { useAppStore } from '@/app/store/AppStore';
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
import { toast } from 'sonner';

export function InventoryScreen() {
  const store = useAppStore();
  const inventory = store.inventory ?? [];
  const purchaseOrders = store.purchaseOrders ?? [];
  const { addPurchaseOrder, receivePurchaseOrder } = store;
  const [search, setSearch] = useState('');
  const [showCreatePo, setShowCreatePo] = useState(false);
  const [poForm, setPoForm] = useState({
    itemId: inventory[0]?.id ?? '',
    quantity: 100,
    supplier: 'Default Supplier',
    expectedDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
  });

  const filteredInventory = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return inventory;
    return inventory.filter((i) => [i.id, i.name, i.status, i.unit].some((v) => v.toLowerCase().includes(q)));
  }, [inventory, search]);

  const totalProductionCapacity = useMemo(() => {
    const cells = inventory.find((i) => i.name.toLowerCase().includes('solar'));
    if (!cells) return 0;
    return Math.max(0, Math.round((cells.available * 0.4) / 10) * 10);
  }, [inventory]);

  const createPoForItem = (item: InventoryItem, qty: number) => {
    addPurchaseOrder({
      itemId: item.id,
      itemName: item.name,
      quantity: qty,
      unit: item.unit,
      supplier: 'Auto Supplier',
      expectedDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      status: 'Open',
    });
    toast.success('Purchase order created');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Inventory Management</h2>
          <p className="text-sm text-gray-500 mt-1">Raw materials & finished goods tracking</p>
        </div>
        <Button className="gap-2" onClick={() => setShowCreatePo(true)}>
          <Plus className="w-4 h-4" />
          Create Purchase Order
        </Button>
      </div>

      {showCreatePo && (
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Create Purchase Order</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700">Item</label>
              <select
                className="w-full mt-1 px-3 py-2 border rounded-lg"
                value={poForm.itemId}
                onChange={(e) => setPoForm({ ...poForm, itemId: e.target.value })}
              >
                {inventory.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.id} • {i.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Quantity</label>
              <Input
                type="number"
                value={poForm.quantity}
                onChange={(e) => setPoForm({ ...poForm, quantity: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Supplier</label>
              <Input value={poForm.supplier} onChange={(e) => setPoForm({ ...poForm, supplier: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Expected Date</label>
              <Input
                type="date"
                value={poForm.expectedDate}
                onChange={(e) => setPoForm({ ...poForm, expectedDate: e.target.value })}
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <Button
              onClick={() => {
                const item = inventory.find((i) => i.id === poForm.itemId);
                if (!item) {
                  toast.error('Select an item');
                  return;
                }
                if (!poForm.quantity || poForm.quantity <= 0) {
                  toast.error('Quantity must be > 0');
                  return;
                }
                addPurchaseOrder({
                  itemId: item.id,
                  itemName: item.name,
                  quantity: poForm.quantity,
                  unit: item.unit,
                  supplier: poForm.supplier || 'Supplier',
                  expectedDate: poForm.expectedDate,
                  status: 'Open',
                });
                toast.success('Purchase order created');
                setShowCreatePo(false);
              }}
            >
              Create
            </Button>
            <Button variant="outline" onClick={() => setShowCreatePo(false)}>
              Cancel
            </Button>
          </div>
        </Card>
      )}

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
          <Input placeholder="Search materials..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
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
              {filteredInventory.map((material: InventoryItem) => {
                const stockPercentage = material.totalStock > 0 ? (material.available / material.totalStock) * 100 : 0;
                return (
                  <tr key={material.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{material.name}</p>
                          <p className="text-xs text-gray-500">Item: {material.id}</p>
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
                    <td className="p-3 text-sm text-gray-600">Auto Supplier</td>
                    <td className="p-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const qty = Math.max(1, material.minStock * 2);
                          createPoForItem(material, qty);
                        }}
                      >
                        Reorder
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Purchase Orders</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr>
                <th className="text-left p-3 text-sm font-semibold text-gray-900">PO ID</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-900">Item</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-900">Qty</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-900">Supplier</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-900">Expected</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-900">Status</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {purchaseOrders.map((po: PurchaseOrder) => (
                <tr key={po.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 text-sm font-medium text-gray-900">{po.id}</td>
                  <td className="p-3 text-sm text-gray-900">{po.itemName}</td>
                  <td className="p-3 text-sm text-gray-900">
                    {po.quantity} {po.unit}
                  </td>
                  <td className="p-3 text-sm text-gray-600">{po.supplier}</td>
                  <td className="p-3 text-sm text-gray-600">{po.expectedDate}</td>
                  <td className="p-3">
                    <Badge
                      className={
                        po.status === 'Received'
                          ? 'bg-green-100 text-green-700'
                          : po.status === 'Cancelled'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-blue-100 text-blue-700'
                      }
                    >
                      {po.status}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={po.status === 'Received' || po.status === 'Cancelled'}
                      onClick={() => {
                        receivePurchaseOrder(po.id);
                        toast.success('PO received. Inventory updated');
                      }}
                    >
                      Receive
                    </Button>
                  </td>
                </tr>
              ))}
              {purchaseOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-sm text-gray-500">
                    No purchase orders yet
                  </td>
                </tr>
              )}
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
          {[{ module: '400W Poly', stock: 240, reserved: 180, available: 60, location: 'Warehouse A' }].map((item) => (
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
