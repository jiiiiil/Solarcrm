import { useState } from 'react';
import { useAppStore } from '@/app/store/AppStore';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Briefcase, Plus, Mail, Phone, User, Search } from 'lucide-react';
import { toast } from 'sonner';

export function EmployeeScreen() {
  const { employees, addEmployee, updateEmployee, deleteEmployee } = useAppStore();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    email: '',
    phone: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addEmployee({
      ...formData,
      status: 'Active',
    });
    toast.success('Employee added');
    setShowForm(false);
    setFormData({ name: '', role: '', email: '', phone: '' });
  };

  const handleToggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    updateEmployee(id, { status: newStatus as any });
    toast.success(`Employee ${newStatus.toLowerCase()}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Employee Management</h2>
          <p className="text-sm text-gray-500 mt-1">Manage team members</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Employee
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="Search employees..." className="pl-10" />
        </div>
      </div>

      {showForm && (
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Add New Employee</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Full Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Role</label>
              <select
                className="w-full mt-1 px-3 py-2 border rounded-lg"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                required
              >
                <option value="">Select Role</option>
                <option>Sales Representative</option>
                <option>Engineer</option>
                <option>Technician</option>
                <option>Project Manager</option>
                <option>Finance Manager</option>
                <option>Admin</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Phone</label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
            <div className="flex gap-3">
              <Button type="submit">Add Employee</Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {employees.map((employee) => (
          <Card key={employee.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <Badge
                className={
                  employee.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }
              >
                {employee.status}
              </Badge>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">{employee.name}</h3>
            <p className="text-sm text-gray-600 mb-4">{employee.role}</p>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span className="truncate">{employee.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>{employee.phone}</span>
              </div>
            </div>
            <div className="flex gap-2 mt-4 pt-4 border-t">
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => handleToggleStatus(employee.id, employee.status)}
              >
                {employee.status === 'Active' ? 'Deactivate' : 'Activate'}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-red-600 hover:text-red-700"
                onClick={() => {
                  deleteEmployee(employee.id);
                  toast.success('Employee removed');
                }}
              >
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {employees.length === 0 && (
        <Card className="p-8 text-center">
          <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">No employees added yet</p>
        </Card>
      )}
    </div>
  );
}
