import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  FileText,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const monthlyData = [
  { month: 'Jan', revenue: 9500000, cost: 6800000, profit: 2700000 },
  { month: 'Feb', revenue: 11200000, cost: 7500000, profit: 3700000 },
  { month: 'Mar', revenue: 10800000, cost: 7200000, profit: 3600000 },
  { month: 'Apr', revenue: 13500000, cost: 8900000, profit: 4600000 },
  { month: 'May', revenue: 15200000, cost: 9800000, profit: 5400000 },
  { month: 'Jun', revenue: 12000000, cost: 8100000, profit: 3900000 },
];

const projectFinances = [
  {
    id: 'PRJ-2401',
    customer: 'Ramesh Industries',
    capacity: '50 KW',
    totalValue: 2500000,
    received: 1875000,
    pending: 625000,
    status: 'On Track',
    margin: 22,
    dueDate: '5 days'
  },
  {
    id: 'PRJ-2402',
    customer: 'Sunshine Developers',
    capacity: '100 KW',
    totalValue: 5200000,
    received: 2600000,
    pending: 2600000,
    status: 'Pending',
    margin: 24,
    dueDate: 'Overdue 3 days'
  },
  {
    id: 'PRJ-2403',
    customer: 'Green Energy Co.',
    capacity: '75 KW',
    totalValue: 3900000,
    received: 3900000,
    pending: 0,
    status: 'Completed',
    margin: 26,
    dueDate: 'Paid'
  },
];

const stats = [
  { label: 'Total Revenue (Month)', value: '₹1.2 CR', change: '+24%', trend: 'up', icon: TrendingUp },
  { label: 'Total Costs', value: '₹81 L', change: '+18%', trend: 'up', icon: TrendingDown },
  { label: 'Net Profit', value: '₹39 L', change: '+32%', trend: 'up', icon: DollarSign },
  { label: 'Outstanding', value: '₹52 L', change: '-12%', trend: 'down', icon: FileText },
];

export function FinanceScreen() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Finance Dashboard</h2>
          <p className="text-sm text-gray-500 mt-1">Financial overview & project billing</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">Generate Report</Button>
          <Button>Create Invoice</Button>
        </div>
      </div>

      {/* AI Finance Alert */}
      <Card className="border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-yellow-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">AI Payment Alert</h3>
              <p className="text-sm text-gray-700">
                <strong>Invoice overdue detected:</strong> Project PRJ-2402 (Sunshine Developers) payment of ₹26 L is overdue by 3 days. 
                Auto-reminder sent. <strong>Recommended:</strong> Follow up call scheduled for today 3:00 PM.
              </p>
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="default" className="bg-yellow-600 hover:bg-yellow-700">
                  Send Reminder
                </Button>
                <Button size="sm" variant="outline">
                  Call Customer
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    {stat.trend === 'up' ? (
                      <TrendingUp className="w-3 h-3 text-green-600" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-red-600" />
                    )}
                    <span className={`text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <Icon className="w-8 h-8 text-blue-600" />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Revenue & Profit Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => `₹${(value / 100000).toFixed(1)} L`}
              />
              <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} name="Revenue" />
              <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2} name="Profit" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Cost Breakdown */}
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Monthly Cost Breakdown</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => `₹${(value / 100000).toFixed(1)} L`}
              />
              <Bar dataKey="cost" fill="#f59e0b" name="Total Cost" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Project-wise Finance */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Project-wise Financial Status</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr>
                <th className="text-left p-3 text-sm font-semibold text-gray-900">Project ID</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-900">Customer</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-900">Capacity</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-900">Total Value</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-900">Received</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-900">Pending</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-900">Margin</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-900">Due Date</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody>
              {projectFinances.map((project) => (
                <tr key={project.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 text-sm font-medium text-gray-900">{project.id}</td>
                  <td className="p-3 text-sm text-gray-900">{project.customer}</td>
                  <td className="p-3 text-sm text-gray-600">{project.capacity}</td>
                  <td className="p-3 text-sm font-medium text-gray-900">
                    ₹{(project.totalValue / 100000).toFixed(1)} L
                  </td>
                  <td className="p-3 text-sm text-green-600">
                    ₹{(project.received / 100000).toFixed(1)} L
                  </td>
                  <td className="p-3 text-sm text-gray-900">
                    {project.pending > 0 ? `₹${(project.pending / 100000).toFixed(1)} L` : '-'}
                  </td>
                  <td className="p-3">
                    <Badge className="bg-green-100 text-green-700">
                      {project.margin}%
                    </Badge>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1 text-sm">
                      {project.dueDate.includes('Overdue') ? (
                        <>
                          <AlertCircle className="w-4 h-4 text-red-600" />
                          <span className="text-red-600">{project.dueDate}</span>
                        </>
                      ) : project.dueDate === 'Paid' ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          <span className="text-green-600">{project.dueDate}</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-4 h-4 text-gray-600" />
                          <span className="text-gray-600">{project.dueDate}</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="p-3">
                    <Badge className={
                      project.status === 'Completed' ? 'bg-green-100 text-green-700' :
                      project.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }>
                      {project.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Pending Invoices</p>
              <p className="text-sm text-gray-500">8 invoices</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Completed Payments</p>
              <p className="text-sm text-gray-500">24 this month</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Overdue</p>
              <p className="text-sm text-gray-500">3 invoices</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
