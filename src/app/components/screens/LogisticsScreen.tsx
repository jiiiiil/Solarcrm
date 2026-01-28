import { useState } from 'react';
import { useAppStore } from '@/app/store/AppStore';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Truck, Plus, MapPin, Calendar, User, Sparkles, Search } from 'lucide-react';
import { toast } from 'sonner';

export function LogisticsScreen() {
  const { logistics, projects, addLogistics, updateLogistics } = useAppStore();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    projectId: '',
    fromLocation: '',
    toLocation: '',
    transporter: '',
    vehicleNumber: '',
    dispatchDate: '',
    expectedDelivery: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addLogistics({
      ...formData,
      status: 'Planned',
    });
    toast.success('Logistics order created');
    setShowForm(false);
    setFormData({
      projectId: '',
      fromLocation: '',
      toLocation: '',
      transporter: '',
      vehicleNumber: '',
      dispatchDate: '',
      expectedDelivery: '',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Logistics & Dispatch</h2>
          <p className="text-sm text-gray-500 mt-1">Manage transportation and delivery</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Create Dispatch
        </Button>
      </div>

      <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">AI Route Optimization</h3>
            <p className="text-sm text-gray-700">
              Suggested route from Ahmedabad Factory to Surat reduces delivery time by 2 hours. Saves ₹2,400 in fuel costs.
            </p>
          </div>
        </div>
      </Card>

      {showForm && (
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Create New Dispatch</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Project</label>
              <select
                className="w-full mt-1 px-3 py-2 border rounded-lg"
                value={formData.projectId}
                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                required
              >
                <option value="">Select Project</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.id} - {p.customer}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">From Location</label>
                <Input
                  value={formData.fromLocation}
                  onChange={(e) => setFormData({ ...formData, fromLocation: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">To Location</label>
                <Input
                  value={formData.toLocation}
                  onChange={(e) => setFormData({ ...formData, toLocation: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Transporter</label>
                <Input
                  value={formData.transporter}
                  onChange={(e) => setFormData({ ...formData, transporter: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Vehicle Number</label>
                <Input
                  value={formData.vehicleNumber}
                  onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Dispatch Date</label>
                <Input
                  type="date"
                  value={formData.dispatchDate}
                  onChange={(e) => setFormData({ ...formData, dispatchDate: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Expected Delivery</label>
                <Input
                  type="date"
                  value={formData.expectedDelivery}
                  onChange={(e) => setFormData({ ...formData, expectedDelivery: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Button type="submit">Create Dispatch</Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="space-y-3">
        {logistics.map((log) => {
          const project = projects.find((p) => p.id === log.projectId);
          return (
            <Card key={log.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-gray-900">{log.id}</span>
                    <Badge
                      className={
                        log.status === 'Delivered'
                          ? 'bg-green-100 text-green-700'
                          : log.status === 'In Transit'
                          ? 'bg-blue-100 text-blue-700'
                          : log.status === 'Dispatched'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                      }
                    >
                      {log.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {project?.customer} ({project?.id})
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span>From: {log.fromLocation}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span>To: {log.toLocation}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Truck className="w-4 h-4 text-gray-500" />
                      <span>{log.transporter} - {log.vehicleNumber}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>ETA: {log.expectedDelivery}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {log.status !== 'Delivered' && (
                    <Button
                      size="sm"
                      onClick={() => {
                        const nextStatus =
                          log.status === 'Planned'
                            ? 'Dispatched'
                            : log.status === 'Dispatched'
                            ? 'In Transit'
                            : 'Delivered';
                        updateLogistics(log.id, { status: nextStatus as any });
                        toast.success(`Status updated to ${nextStatus}`);
                      }}
                    >
                      Update Status
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
        {logistics.length === 0 && (
          <Card className="p-8 text-center">
            <Truck className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">No dispatch orders yet</p>
          </Card>
        )}
      </div>
    </div>
  );
}
