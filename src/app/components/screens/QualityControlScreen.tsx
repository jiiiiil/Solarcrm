import { ChangeEvent, useMemo, useState } from 'react';
import type { ProductionOrder, Project, QualityRecord } from '@/app/store/AppStore';
import { useAppStore } from '@/app/store/AppStore';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { ShieldCheck, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export function QualityControlScreen() {
  const { qualityRecords, projects, productionOrders, addQualityRecord, updateQualityRecord, deleteQualityRecord } =
    useAppStore();

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    projectId: '',
    productionOrderId: '',
    status: 'Pass' as 'Pass' | 'Fail' | 'Hold',
    remarks: '',
  });

  const productionOptions = useMemo(() => {
    return productionOrders.map((po: ProductionOrder) => ({
      id: po.id,
      label: `${po.id} • ${po.projectId} • ${po.capacity} • ${po.stage}`,
      projectId: po.projectId,
    }));
  }, [productionOrders]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addQualityRecord({
      projectId: formData.projectId || undefined,
      productionOrderId: formData.productionOrderId || undefined,
      batchId: formData.productionOrderId || undefined,
      status: formData.status,
      remarks: formData.remarks,
    });

    toast.success('QC record created');
    setShowForm(false);
    setFormData({ projectId: '', productionOrderId: '', status: 'Pass', remarks: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Quality Control</h2>
          <p className="text-sm text-gray-500 mt-1">Pass / Fail records linked to production batches</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Add QC Record
        </Button>
      </div>

      {showForm && (
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Create QC Record</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Project</label>
                <select
                  className="w-full mt-1 px-3 py-2 border rounded-lg"
                  value={formData.projectId}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, projectId: e.target.value })}
                >
                  <option value="">Select Project (optional)</option>
                  {projects.map((p: Project) => (
                    <option key={p.id} value={p.id}>
                      {p.id} - {p.customer}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Production Order</label>
                <select
                  className="w-full mt-1 px-3 py-2 border rounded-lg"
                  value={formData.productionOrderId}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                    const selected = productionOptions.find((o: { id: string; label: string; projectId: string }) => o.id === e.target.value);
                    setFormData({
                      ...formData,
                      productionOrderId: e.target.value,
                      projectId: selected?.projectId ?? formData.projectId,
                    });
                  }}
                >
                  <option value="">Select Production Order (optional)</option>
                  {productionOptions.map((o: { id: string; label: string; projectId: string }) => (
                    <option key={o.id} value={o.id}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Result</label>
                <select
                  className="w-full mt-1 px-3 py-2 border rounded-lg"
                  value={formData.status}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, status: e.target.value as any })}
                >
                  <option value="Pass">Pass</option>
                  <option value="Fail">Fail</option>
                  <option value="Hold">Hold</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Remarks</label>
                <Input
                  value={formData.remarks}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, remarks: e.target.value })}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="submit">Create</Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="space-y-3">
        {qualityRecords.map((r: QualityRecord) => {
          const project = r.projectId ? projects.find((p: Project) => p.id === r.projectId) : undefined;
          return (
            <Card key={r.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span className="font-semibold text-gray-900">{r.id}</span>
                    <Badge
                      className={
                        r.status === 'Pass'
                          ? 'bg-green-100 text-green-700'
                          : r.status === 'Fail'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                      }
                    >
                      {r.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                    <div>
                      <span className="text-gray-500">Project:</span>{' '}
                      <span className="font-medium text-gray-900">{project ? `${project.customer} (${project.id})` : '-'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Production:</span>{' '}
                      <span className="font-medium text-gray-900">{r.productionOrderId ?? '-'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Remarks:</span>{' '}
                      <span className="font-medium text-gray-900">{r.remarks || '-'}</span>
                    </div>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={r.status === 'Pass'}
                      onClick={() => {
                        updateQualityRecord(r.id, { status: 'Pass' });
                        toast.success('Marked as Pass');
                      }}
                    >
                      Mark Pass
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={r.status === 'Fail'}
                      onClick={() => {
                        updateQualityRecord(r.id, { status: 'Fail' });
                        toast.success('Marked as Fail');
                      }}
                    >
                      Mark Fail
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={r.status === 'Hold'}
                      onClick={() => {
                        updateQualityRecord(r.id, { status: 'Hold' });
                        toast.success('Moved to Hold');
                      }}
                    >
                      Hold
                    </Button>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 hover:text-red-700"
                  onClick={() => {
                    deleteQualityRecord(r.id);
                    toast.success('QC record deleted');
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          );
        })}

        {qualityRecords.length === 0 && (
          <Card className="p-8 text-center">
            <ShieldCheck className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">No QC records yet</p>
          </Card>
        )}
      </div>
    </div>
  );
}
