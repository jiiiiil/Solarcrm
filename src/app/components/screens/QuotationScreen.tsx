import { useState } from 'react';
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

const quotations = [
  {
    id: 'QUO-2401',
    customer: 'Rajesh Kumar',
    lead: 'LD-001',
    capacity: '15 KW',
    perWattPrice: 28.5,
    totalAmount: 427500,
    status: 'Draft',
    createdAt: '2 hours ago',
    validUntil: '30 days'
  },
  {
    id: 'QUO-2402',
    customer: 'Priya Patel',
    lead: 'LD-002',
    capacity: '25 KW',
    perWattPrice: 27.2,
    totalAmount: 680000,
    status: 'Sent',
    createdAt: '1 day ago',
    validUntil: '28 days',
    sentOn: 'Yesterday'
  },
  {
    id: 'QUO-2403',
    customer: 'Amit Shah',
    lead: 'LD-003',
    capacity: '10 KW',
    perWattPrice: 29.0,
    totalAmount: 290000,
    status: 'Approved',
    createdAt: '3 days ago',
    approvedOn: '1 day ago'
  },
  {
    id: 'QUO-2404',
    customer: 'Neha Sharma',
    lead: 'LD-004',
    capacity: '20 KW',
    perWattPrice: 27.8,
    totalAmount: 556000,
    status: 'Rejected',
    createdAt: '5 days ago',
    rejectedOn: '2 days ago'
  },
];

export function QuotationScreen() {
  const [selectedQuote, setSelectedQuote] = useState(quotations[0]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Quotations</h2>
          <p className="text-sm text-gray-500 mt-1">Generate and manage quotes</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Create New Quote
        </Button>
      </div>

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
                <strong>Optimal pricing detected:</strong> Customer {selectedQuote.customer} likely to approve quotation under ₹{Math.round(selectedQuote.totalAmount * 1.05).toLocaleString('en-IN')}. 
                Current quote at ₹{selectedQuote.totalAmount.toLocaleString('en-IN')} is <strong>highly competitive</strong>. Expected approval probability: <strong>92%</strong>.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="Search quotations..." className="pl-10" />
        </div>
        <Tabs defaultValue="all">
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
          {quotations.map((quote) => (
            <Card 
              key={quote.id} 
              className={`p-4 cursor-pointer transition-all ${
                selectedQuote.id === quote.id ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'
              }`}
              onClick={() => setSelectedQuote(quote)}
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
                  <span>Valid for {quote.validUntil}</span>
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
              <Button size="sm" variant="outline">
                <Eye className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline">
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
                  <span className="font-medium">{selectedQuote.customer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Lead ID:</span>
                  <span className="font-medium">{selectedQuote.lead}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">{selectedQuote.createdAt}</span>
                </div>
              </div>
            </div>

            {/* System Details */}
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-3">System Configuration</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm text-gray-600">System Capacity</span>
                  <Input value={selectedQuote.capacity} className="w-24 text-right" readOnly />
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
                  <span className="font-semibold text-blue-700">₹{selectedQuote.perWattPrice}/W</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Cost:</span>
                  <span className="font-medium">₹{selectedQuote.totalAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">GST (18%):</span>
                  <span className="font-medium">₹{(selectedQuote.totalAmount * 0.18).toLocaleString('en-IN')}</span>
                </div>
                <div className="h-px bg-gray-300 my-2"></div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900">Total Amount:</span>
                  <span className="text-lg font-bold text-green-600">
                    ₹{(selectedQuote.totalAmount * 1.18).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Cost Breakup */}
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-3">Cost Breakdown</p>
              <div className="space-y-2 text-sm">
                {[
                  { label: 'Raw Material', value: 65, amount: selectedQuote.totalAmount * 0.65 },
                  { label: 'Labour Cost', value: 15, amount: selectedQuote.totalAmount * 0.15 },
                  { label: 'Factory Overhead', value: 8, amount: selectedQuote.totalAmount * 0.08 },
                  { label: 'EPC Margin', value: 12, amount: selectedQuote.totalAmount * 0.12 },
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
              {selectedQuote.status === 'Draft' && (
                <>
                  <Button className="flex-1 gap-2">
                    <Send className="w-4 h-4" />
                    Send to Customer
                  </Button>
                  <Button variant="outline">Edit</Button>
                </>
              )}
              {selectedQuote.status === 'Sent' && (
                <>
                  <Button variant="outline" className="flex-1">Follow Up</Button>
                  <Button variant="outline">Edit</Button>
                </>
              )}
              {selectedQuote.status === 'Approved' && (
                <Button className="flex-1">Convert to Project</Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
