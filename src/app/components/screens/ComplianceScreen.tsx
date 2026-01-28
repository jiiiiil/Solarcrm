import { useState } from 'react';
import { useAppStore } from '@/app/store/AppStore';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Scale, Plus, FileText, Calendar, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export function ComplianceScreen() {
  const { complianceRecords, addCompliance } = useAppStore();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    certificateNumber: '',
    issueDate: '',
    expiryDate: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const expiryDate = new Date(formData.expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.floor((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    const status = daysUntilExpiry < 0 ? 'Expired' : daysUntilExpiry < 30 ? 'Expiring Soon' : 'Valid';

    addCompliance({
      ...formData,
      status: status as any,
    });
    toast.success('Compliance record added');
    setShowForm(false);
    setFormData({ title: '', category: '', certificateNumber: '', issueDate: '', expiryDate: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Compliance & Certifications</h2>
          <p className="text-sm text-gray-500 mt-1">Track regulatory compliance</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Certificate
        </Button>
      </div>

      {showForm && (
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Add Compliance Record</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Title</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., ISO 9001 Certification"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Category</label>
              <select
                className="w-full mt-1 px-3 py-2 border rounded-lg"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              >
                <option value="">Select Category</option>
                <option>Quality Certification</option>
                <option>Safety Certificate</option>
                <option>Environmental Compliance</option>
                <option>Trade License</option>
                <option>Tax Registration</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Certificate Number</label>
              <Input
                value={formData.certificateNumber}
                onChange={(e) => setFormData({ ...formData, certificateNumber: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Issue Date</label>
                <Input
                  type="date"
                  value={formData.issueDate}
                  onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Expiry Date</label>
                <Input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Button type="submit">Add Record</Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="space-y-3">
        {complianceRecords.map((record) => (
          <Card key={record.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{record.title}</h3>
                    <Badge
                      className={
                        record.status === 'Valid'
                          ? 'bg-green-100 text-green-700'
                          : record.status === 'Expiring Soon'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }
                    >
                      {record.status === 'Expiring Soon' && <AlertTriangle className="w-3 h-3 mr-1" />}
                      {record.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{record.category}</p>
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">Certificate #:</span>
                      <p className="font-medium text-gray-900">{record.certificateNumber}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Issued:</span>
                      <p className="font-medium text-gray-900">{record.issueDate}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Expires:</span>
                      <p className="font-medium text-gray-900">{record.expiryDate}</p>
                    </div>
                  </div>
                </div>
              </div>
              <Button size="sm" variant="outline">
                View Document
              </Button>
            </div>
          </Card>
        ))}
        {complianceRecords.length === 0 && (
          <Card className="p-8 text-center">
            <Scale className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">No compliance records yet</p>
          </Card>
        )}
      </div>
    </div>
  );
}
