import { useAppStore } from '@/app/store/AppStore';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { BarChart3, Download, TrendingUp, DollarSign, Users, Package } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function ReportsScreen() {
  const { projects, leads, invoices, serviceTickets } = useAppStore();

  const projectsByStatus = [
    { name: 'Survey', value: projects.filter((p) => p.status === 'Survey').length },
    { name: 'Design', value: projects.filter((p) => p.status === 'Design').length },
    { name: 'Production', value: projects.filter((p) => p.status === 'Production').length },
    { name: 'Installation', value: projects.filter((p) => p.status === 'Installation').length },
    { name: 'Completed', value: projects.filter((p) => p.status === 'Completed').length },
  ];

  const leadsByStatus = [
    { name: 'New', value: leads.filter((l) => l.status === 'New').length },
    { name: 'Contacted', value: leads.filter((l) => l.status === 'Contacted').length },
    { name: 'Qualified', value: leads.filter((l) => l.status === 'Qualified').length },
  ];

  const monthlyRevenue = [
    { month: 'Jan', revenue: 9500000 },
    { month: 'Feb', revenue: 11200000 },
    { month: 'Mar', revenue: 10800000 },
    { month: 'Apr', revenue: 13500000 },
    { month: 'May', revenue: 15200000 },
    { month: 'Jun', revenue: 12000000 },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const paidRevenue = invoices.filter((inv) => inv.status === 'Paid').reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Reports & Analytics</h2>
          <p className="text-sm text-gray-500 mt-1">Business intelligence dashboard</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export PDF
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Projects</p>
              <p className="text-2xl font-semibold text-gray-900">{projects.length}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-semibold text-gray-900">₹{(totalRevenue / 10000000).toFixed(2)}Cr</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Leads</p>
              <p className="text-2xl font-semibold text-gray-900">{leads.length}</p>
            </div>
            <Users className="w-8 h-8 text-purple-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Service Tickets</p>
              <p className="text-2xl font-semibold text-gray-900">{serviceTickets.length}</p>
            </div>
            <Package className="w-8 h-8 text-orange-600" />
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Projects by Status */}
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Projects by Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={projectsByStatus}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Revenue Trend */}
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Monthly Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value: number) => `₹${(value / 100000).toFixed(1)}L`} />
              <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Leads Distribution */}
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Leads Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={leadsByStatus}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {leadsByStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Payment Status */}
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Payment Summary</h3>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Paid</p>
              <p className="text-2xl font-semibold text-green-700">₹{(paidRevenue / 100000).toFixed(1)}L</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-semibold text-yellow-700">
                ₹{((totalRevenue - paidRevenue) / 100000).toFixed(1)}L
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Collection Rate</p>
              <p className="text-2xl font-semibold text-blue-700">
                {totalRevenue > 0 ? ((paidRevenue / totalRevenue) * 100).toFixed(1) : 0}%
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Summary Table */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Quick Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="p-3 border rounded-lg">
            <p className="text-gray-500">New Leads (This Month)</p>
            <p className="text-xl font-semibold text-gray-900">{leads.length}</p>
          </div>
          <div className="p-3 border rounded-lg">
            <p className="text-gray-500">Quotations Sent</p>
            <p className="text-xl font-semibold text-gray-900">
              {leads.filter((l) => l.status === 'Qualified').length}
            </p>
          </div>
          <div className="p-3 border rounded-lg">
            <p className="text-gray-500">Ongoing Installations</p>
            <p className="text-xl font-semibold text-gray-900">
              {projects.filter((p) => p.status === 'Installation').length}
            </p>
          </div>
          <div className="p-3 border rounded-lg">
            <p className="text-gray-500">Open Service Tickets</p>
            <p className="text-xl font-semibold text-gray-900">
              {serviceTickets.filter((t) => t.status === 'Open' || t.status === 'In Progress').length}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
