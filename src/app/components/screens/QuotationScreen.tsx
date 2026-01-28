import { useMemo, useState } from 'react';
import type { Lead, Quotation } from '@/app/store/AppStore';
import { useAppStore } from '@/app/store/AppStore';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { 
  FileText, 
  Sparkles,
  Download,
  Send,
  Eye,
  Plus,
  Search,
  Zap,
  DollarSign,
  Calendar
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { toast } from 'sonner';

export function QuotationScreen() {
  const { quotations, leads, addQuotation, updateQuotation, approveQuotation, setCurrentModule } = useAppStore();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'sent' | 'approved'>('all');

  const [selectedQuoteId, setSelectedQuoteId] = useState<string>(quotations[0]?.id ?? '');
  const selectedQuote = useMemo(() => quotations.find((q) => q.id === selectedQuoteId), [quotations, selectedQuoteId]);

  const qualifiedLeads = useMemo(() => leads.filter((l) => l.status === 'Qualified'), [leads]);
  const [createFromLeadId, setCreateFromLeadId] = useState<string>(qualifiedLeads[0]?.id ?? '');

  const filteredQuotations = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = quotations;
    if (statusFilter !== 'all') {
      const target: Quotation['status'] =
        statusFilter === 'draft' ? 'Draft' : statusFilter === 'sent' ? 'Sent' : 'Approved';
      list = list.filter((x) => x.status === target);
    }
    if (!q) return list;
    return list.filter((x) => [x.id, x.customer, x.leadId, x.status, x.capacity].some((v) => v.toLowerCase().includes(q)));
  }, [quotations, search, statusFilter]);

  const downloadTextFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const leadForSelected = useMemo(() => {
    if (!selectedQuote) return undefined;
    return leads.find((l) => l.id === selectedQuote.leadId);
  }, [leads, selectedQuote]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Quotations</h2>
          <p className="text-sm text-gray-500 mt-1">Generate and manage quotes</p>
        </div>
        <Button
          className="gap-2"
          onClick={() => {
            const lead = qualifiedLeads.find((l) => l.id === createFromLeadId) as Lead | undefined;
            if (!lead) {
              toast.error('No qualified lead selected');
              return;
            }
            addQuotation({
              leadId: lead.id,
              customer: lead.name,
              capacity: lead.capacity,
              perWattPrice: 28.0,
              totalAmount: 280000,
              status: 'Draft',
            });
            toast.success('Draft quotation created');
          }}
        >
          <Plus className="w-4 h-4" />
          Create New Quote
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">Create from Qualified Lead</p>
            <select
              className="w-full mt-1 px-3 py-2 border rounded-lg"
              value={createFromLeadId}
              onChange={(e) => setCreateFromLeadId(e.target.value)}
            >
              {qualifiedLeads.length === 0 && <option value="">No qualified leads</option>}
              {qualifiedLeads.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.id} • {l.name} • {l.capacity}
                </option>
              ))}
            </select>
          </div>
          <div className="text-sm text-gray-600">
            Tip: Complete a survey to automatically create a Draft quotation.
          </div>
        </div>
      </Card>

      {/* AI Pricing Suggestion */}
      <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">AI Pricing Intelligence</h3>
              <p className="text-sm text-gray-700">
                <strong>Optimal pricing detected:</strong>{' '}
                Customer {selectedQuote?.customer ?? '-'} likely to approve quotation under ₹
                {Math.round(((selectedQuote?.totalAmount ?? 0) * 1.05)).toLocaleString('en-IN')}. Current quote at ₹
                {(selectedQuote?.totalAmount ?? 0).toLocaleString('en-IN')} is <strong>highly competitive</strong>. Expected approval probability:{' '}
                <strong>92%</strong>.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="Search quotations..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="draft">Draft</TabsTrigger>
            <TabsTrigger value="sent">Sent</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quotation List */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Recent Quotations</h3>
          {filteredQuotations.map((quote: Quotation) => (
            <Card 
              key={quote.id} 
              className={`p-4 cursor-pointer transition-all ${
                selectedQuote?.id === quote.id ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'
              }`}
              onClick={() => setSelectedQuoteId(quote.id)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">{quote.id}</span>
                  <Badge className={
                    quote.status === 'Draft' ? 'bg-gray-100 text-gray-700' :
                    quote.status === 'Sent' ? 'bg-blue-100 text-blue-700' :
                    quote.status === 'Approved' ? 'bg-green-100 text-green-700' :
                    'bg-red-100 text-red-700'
                  }>
                    {quote.status}
                  </Badge>
                </div>
                <span className="text-xs text-gray-500">{quote.createdAt}</span>
              </div>

              <h4 className="font-medium text-gray-900 mb-2">{quote.customer}</h4>

              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <p className="text-gray-500 text-xs">Capacity</p>
                  <p className="font-medium text-gray-900">{quote.capacity}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Per Watt</p>
                  <p className="font-medium text-gray-900">₹{quote.perWattPrice}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Total</p>
                  <p className="font-medium text-green-600">₹{(quote.totalAmount / 100000).toFixed(1)}L</p>
                </div>
              </div>

              {quote.status === 'Sent' && (
                <div className="mt-3 flex items-center gap-2 text-xs text-gray-600">
                  <Calendar className="w-3 h-3" />
                  <span>Valid for 30 days</span>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Quotation Preview/Editor */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Quotation Details</h3>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  if (!selectedQuote) {
                    toast.error('Select a quotation');
                    return;
                  }
                  toast.message(`Preview: ${selectedQuote.id} • ${selectedQuote.customer} • ₹${selectedQuote.totalAmount.toLocaleString('en-IN')}`);
                }}
              >
                <Eye className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  if (!selectedQuote) {
                    toast.error('Select a quotation');
                    return;
                  }
                  const content = [
                    `Quotation: ${selectedQuote.id}`,
                    `Customer: ${selectedQuote.customer}`,
                    `Lead: ${selectedQuote.leadId}`,
                    `Capacity: ${selectedQuote.capacity}`,
                    `Per Watt: ₹${selectedQuote.perWattPrice}`,
                    `Total: ₹${selectedQuote.totalAmount}`,
                    `Status: ${selectedQuote.status}`,
                    `Generated: ${new Date().toLocaleString()}`,
                  ].join('\n');
                  downloadTextFile(`${selectedQuote.id}.txt`, content);
                  toast.success('Quotation downloaded');
                }}
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {/* Customer Info */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-semibold text-gray-900 mb-2">Customer Information</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">{selectedQuote?.customer ?? '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Lead ID:</span>
                  <span className="font-medium">{selectedQuote?.leadId ?? '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">{selectedQuote?.createdAt ?? '-'}</span>
                </div>
              </div>
            </div>

            {/* System Details */}
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-3">System Configuration</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm text-gray-600">System Capacity</span>
                  <Input value={selectedQuote?.capacity ?? '-'} className="w-24 text-right" readOnly />
                </div>
                <div className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm text-gray-600">Panel Type</span>
                  <Input value="Mono PERC 400W" className="w-32 text-right text-sm" readOnly />
                </div>
                <div className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm text-gray-600">Inverter</span>
                  <Input value="String Inverter" className="w-32 text-right text-sm" readOnly />
                </div>
                <div className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm text-gray-600">Structure</span>
                  <Input value="Galvanized Steel" className="w-32 text-right text-sm" readOnly />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
              <p className="text-sm font-semibold text-gray-900 mb-3">Pricing Details</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Per Watt Price:</span>
                  <span className="font-semibold text-blue-700">₹{selectedQuote?.perWattPrice ?? 0}/W</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Cost:</span>
                  <span className="font-medium">₹{(selectedQuote?.totalAmount ?? 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">GST (18%):</span>
                  <span className="font-medium">₹{(((selectedQuote?.totalAmount ?? 0) * 0.18)).toLocaleString('en-IN')}</span>
                </div>
                <div className="h-px bg-gray-300 my-2"></div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900">Total Amount:</span>
                  <span className="text-lg font-bold text-green-600">
                    ₹{(((selectedQuote?.totalAmount ?? 0) * 1.18)).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Cost Breakup */}
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-3">Cost Breakdown</p>
              <div className="space-y-2 text-sm">
                {[
                  { label: 'Raw Material', value: 65, amount: (selectedQuote?.totalAmount ?? 0) * 0.65 },
                  { label: 'Labour Cost', value: 15, amount: (selectedQuote?.totalAmount ?? 0) * 0.15 },
                  { label: 'Factory Overhead', value: 8, amount: (selectedQuote?.totalAmount ?? 0) * 0.08 },
                  { label: 'EPC Margin', value: 12, amount: (selectedQuote?.totalAmount ?? 0) * 0.12 },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <span className="text-gray-600 w-32">{item.label}:</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${item.value}%` }}
                      ></div>
                    </div>
                    <span className="font-medium w-24 text-right">
                      ₹{(item.amount / 1000).toFixed(0)}K ({item.value}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4">
              {selectedQuote?.status === 'Draft' && (
                <>
                  <Button
                    className="flex-1 gap-2"
                    onClick={() => {
                      if (!selectedQuote) return;
                      updateQuotation(selectedQuote.id, { status: 'Sent' });
                      toast.success('Quotation sent');
                    }}
                  >
                    <Send className="w-4 h-4" />
                    Send to Customer
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (!selectedQuote) return;
                      const nextTotal = Math.max(0, (selectedQuote.totalAmount ?? 0) + 10000);
                      updateQuotation(selectedQuote.id, { totalAmount: nextTotal });
                      toast.success('Quote updated');
                    }}
                  >
                    Edit
                  </Button>
                </>
              )}
              {selectedQuote?.status === 'Sent' && (
                <>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      if (!selectedQuote) return;
                      updateQuotation(selectedQuote.id, { updatedAt: new Date().toISOString() });
                      toast.success('Follow-up logged');
                    }}
                  >
                    Follow Up
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (!selectedQuote) return;
                      updateQuotation(selectedQuote.id, { status: 'Rejected' });
                      toast.success('Marked as Rejected');
                    }}
                  >
                    Reject
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => {
                      if (!selectedQuote) return;
                      approveQuotation(selectedQuote.id);
                      toast.success('Quotation approved and project created');
                      setCurrentModule('Projects');
                    }}
                  >
                    Approve
                  </Button>
                </>
              )}
              {selectedQuote?.status === 'Approved' && (
                <Button
                  className="flex-1"
                  onClick={() => {
                    toast.success('Opening project');
                    setCurrentModule('Projects');
                  }}
                >
                  Open Project
                </Button>
              )}
            </div>

            {selectedQuote && leadForSelected && (
              <div className="text-xs text-gray-500">
                Lead status: <span className="font-medium text-gray-900">{leadForSelected.status}</span>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
