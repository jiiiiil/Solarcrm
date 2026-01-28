import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { useAppStore } from '@/app/store/AppStore';
import { toast } from 'sonner';
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
import { useMemo, useState, ChangeEvent } from 'react';

const monthlyData = [
  { month: 'Jan', revenue: 9500000, cost: 6800000, profit: 2700000 },
  { month: 'Feb', revenue: 11200000, cost: 7500000, profit: 3700000 },
  { month: 'Mar', revenue: 10800000, cost: 7200000, profit: 3600000 },
  { month: 'Apr', revenue: 13500000, cost: 8900000, profit: 4600000 },
  { month: 'May', revenue: 15200000, cost: 9800000, profit: 5400000 },
  { month: 'Jun', revenue: 12000000, cost: 8100000, profit: 3900000 },
];

function downloadTextFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const stats = [
  { label: 'Total Revenue (Month)', value: '₹1.2 CR', change: '+24%', trend: 'up', icon: TrendingUp },
  { label: 'Total Costs', value: '₹81 L', change: '+18%', trend: 'up', icon: TrendingDown },
  { label: 'Net Profit', value: '₹39 L', change: '+32%', trend: 'up', icon: DollarSign },
  { label: 'Outstanding', value: '₹52 L', change: '-12%', trend: 'down', icon: FileText },
];

export function FinanceScreen() {
  const { projects, invoices, payments, addInvoice, updateInvoice, addPayment, addReport } = useAppStore();
  const [showCreateInvoice, setShowCreateInvoice] = useState(false);
  const [invoiceForm, setInvoiceForm] = useState({
    projectId: projects?.[0]?.id ?? '',
    amount: '',
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
  });

  const projectFinances = useMemo(() => {
    const now = new Date();
    const safeProjects = projects ?? [];
    const safeInvoices = invoices ?? [];
    const safePayments = payments ?? [];

    return safeProjects.map((p) => {
      const projectInvoices = safeInvoices.filter((i) => i.projectId === p.id);
      const invoiceIds = new Set(projectInvoices.map((i) => i.id));
      const received = safePayments
        .filter((pay) => invoiceIds.has(pay.invoiceId) && pay.status === 'Completed')
        .reduce((sum, pay) => sum + (pay.amount || 0), 0);

      const totalValue = p.totalValue || 0;
      const pending = Math.max(0, totalValue - received);

      const latestInvoice = projectInvoices
        .slice()
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

      const dueDateStr = latestInvoice?.dueDate;
      const dueDate = dueDateStr ? new Date(dueDateStr) : undefined;
      const daysDiff = dueDate ? Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : undefined;

      const hasOverdue = projectInvoices.some((i) => {
        const d = new Date(i.dueDate);
        return (i.status === 'Overdue' || (i.status !== 'Paid' && d.getTime() < now.getTime()));
      });

      const status = pending <= 0 ? 'Completed' : hasOverdue ? 'Pending' : 'On Track';
      const margin = 22;

      let dueDateLabel = '-';
      if (pending <= 0) {
        dueDateLabel = 'Paid';
      } else if (dueDate && typeof daysDiff === 'number') {
        if (daysDiff < 0) dueDateLabel = `Overdue ${Math.abs(daysDiff)} days`;
        else dueDateLabel = `${daysDiff} days`;
      }

      return {
        id: p.id,
        customer: p.customer,
        capacity: p.capacity,
        totalValue,
        received,
        pending,
        status,
        margin,
        dueDate: dueDateLabel,
      };
    });
  }, [projects, invoices, payments]);

  const counts = useMemo(() => {
    const now = new Date();
    const safeInvoices = invoices ?? [];
    let pendingCount = 0;
    let overdueCount = 0;
    let paidCount = 0;

    for (const inv of safeInvoices) {
      if (inv.status === 'Paid') {
        paidCount += 1;
        continue;
      }

      const due = new Date(inv.dueDate);
      if (inv.status === 'Overdue' || due.getTime() < now.getTime()) overdueCount += 1;
      else pendingCount += 1;
    }

    return { pendingCount, overdueCount, paidCount };
  }, [invoices]);

  const onInvoiceFormChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInvoiceForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateInvoice = () => {
    if (!invoiceForm.projectId) {
      toast.error('Select a project');
      return;
    }
    const amount = Number(invoiceForm.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error('Enter a valid amount');
      return;
    }
    if (!invoiceForm.dueDate) {
      toast.error('Select a due date');
      return;
    }

    addInvoice({
      projectId: invoiceForm.projectId,
      amount,
      dueDate: invoiceForm.dueDate,
      status: 'Draft',
      paidAmount: 0,
    });

    toast.success('Invoice created');
    setShowCreateInvoice(false);
    setInvoiceForm((prev) => ({ ...prev, amount: '' }));
  };

  const handleGenerateReport = () => {
    const now = new Date();
    const lines: string[] = [];
    lines.push('Solar OS - Finance Report');
    lines.push(`Generated: ${now.toISOString()}`);
    lines.push('');
    lines.push(`Projects: ${(projects ?? []).length}`);
    lines.push(`Invoices: ${(invoices ?? []).length}`);
    lines.push(`Payments: ${(payments ?? []).length}`);
    lines.push('');
    lines.push('Project Summary');
    for (const p of projectFinances) {
      lines.push(
        `${p.id} | ${p.customer} | Total: ₹${p.totalValue} | Received: ₹${p.received} | Pending: ₹${p.pending} | Status: ${p.status}`,
      );
    }

    addReport({
      title: `Finance Report - ${now.toISOString().slice(0, 10)}`,
      status: 'Generated',
    });

    downloadTextFile(`finance-report-${now.toISOString().slice(0, 10)}.txt`, lines.join('\n'));
    toast.success('Report generated & downloaded');
  };

  const overdueInvoice = useMemo(() => {
    const now = new Date();
    const safeInvoices = invoices ?? [];
    return safeInvoices
      .slice()
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .find((i) => i.status !== 'Paid' && new Date(i.dueDate).getTime() < now.getTime());
  }, [invoices]);

  const handleSendReminder = () => {
    if (!overdueInvoice) {
      toast.message('No overdue invoices found');
      return;
    }
    updateInvoice(overdueInvoice.id, { status: 'Overdue' });
    toast.success('Reminder queued (demo)');
  };

  const handleCallCustomer = () => {
    toast.message('Call scheduled (demo)');
  };

  const handleMarkPaidDemo = () => {
    if (!overdueInvoice) {
      toast.message('No invoice to mark paid');
      return;
    }
    addPayment({
      invoiceId: overdueInvoice.id,
      amount: overdueInvoice.amount,
      method: 'Bank Transfer',
      status: 'Completed',
    });
    updateInvoice(overdueInvoice.id, { status: 'Paid', paidAmount: overdueInvoice.amount });
    toast.success('Payment recorded');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Finance Dashboard</h2>
          <p className="text-sm text-gray-500 mt-1">Financial overview & project billing</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleGenerateReport}>Generate Report</Button>
          <Button onClick={() => setShowCreateInvoice(true)}>Create Invoice</Button>
        </div>
      </div>

      {showCreateInvoice && (
        <Card className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Create Invoice</h3>
              <p className="text-sm text-gray-500 mt-1">Create a new project invoice (saved in localStorage)</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                <div>
                  <label className="text-sm text-gray-600">Project</label>
                  <select
                    name="projectId"
                    value={invoiceForm.projectId}
                    onChange={onInvoiceFormChange}
                    className="mt-1 w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
                  >
                    <option value="">Select project</option>
                    {(projects ?? []).map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.id} - {p.customer}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Amount</label>
                  <Input
                    name="amount"
                    value={invoiceForm.amount}
                    onChange={onInvoiceFormChange}
                    placeholder="e.g. 250000"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Due Date</label>
                  <Input
                    type="date"
                    name="dueDate"
                    value={invoiceForm.dueDate}
                    onChange={onInvoiceFormChange}
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={handleCreateInvoice}>Create</Button>
                <Button variant="outline" onClick={() => setShowCreateInvoice(false)}>Cancel</Button>
              </div>
            </div>
          </div>
        </Card>
      )}

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
                <strong>Invoice overdue detected:</strong>{' '}
                {overdueInvoice ? (
                  <>
                    Invoice <strong>{overdueInvoice.id}</strong> is overdue. Auto-reminder recommended.
                  </>
                ) : (
                  <>No overdue invoice detected. Finance is on track.</>
                )}
              </p>
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="default" className="bg-yellow-600 hover:bg-yellow-700" onClick={handleSendReminder}>
                  Send Reminder
                </Button>
                <Button size="sm" variant="outline" onClick={handleCallCustomer}>
                  Call Customer
                </Button>
                <Button size="sm" variant="outline" onClick={handleMarkPaidDemo}>
                  Mark Paid (Demo)
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
              <p className="text-sm text-gray-500">{counts.pendingCount} invoices</p>
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
              <p className="text-sm text-gray-500">{counts.paidCount} invoices paid</p>
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
              <p className="text-sm text-gray-500">{counts.overdueCount} invoices</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
