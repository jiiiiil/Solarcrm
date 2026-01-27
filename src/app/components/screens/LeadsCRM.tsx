import { useState } from 'react';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { 
  Phone, 
  MessageSquare, 
  MapPin, 
  Zap, 
  Calendar, 
  User, 
  Sparkles,
  Search,
  Filter,
  Plus,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';

const leads = [
  {
    id: 'LD-001',
    name: 'Rajesh Kumar',
    mobile: '+91 98765 43210',
    source: 'WhatsApp',
    location: 'Ahmedabad, Gujarat',
    capacity: '15 KW',
    status: 'New',
    aiScore: 92,
    electricityBill: '₹8,500/mo',
    assignedTo: 'Sales Rep 1',
    createdAt: '2 hours ago'
  },
  {
    id: 'LD-002',
    name: 'Priya Patel',
    mobile: '+91 98765 43211',
    source: 'Instagram',
    location: 'Surat, Gujarat',
    capacity: '25 KW',
    status: 'Contacted',
    aiScore: 85,
    electricityBill: '₹12,000/mo',
    assignedTo: 'Sales Rep 2',
    createdAt: '5 hours ago',
    duplicate: true
  },
  {
    id: 'LD-003',
    name: 'Amit Shah',
    mobile: '+91 98765 43212',
    source: 'Facebook',
    location: 'Rajkot, Gujarat',
    capacity: '10 KW',
    status: 'Survey Scheduled',
    aiScore: 78,
    electricityBill: '₹6,500/mo',
    assignedTo: 'Sales Rep 1',
    createdAt: '1 day ago'
  },
  {
    id: 'LD-004',
    name: 'Neha Sharma',
    mobile: '+91 98765 43213',
    source: 'Website',
    location: 'Vadodara, Gujarat',
    capacity: '20 KW',
    status: 'Qualified',
    aiScore: 95,
    electricityBill: '₹10,500/mo',
    assignedTo: 'Sales Rep 3',
    createdAt: '2 days ago'
  },
];

const statusColumns = ['New', 'Contacted', 'Survey Scheduled', 'Qualified', 'Lost'];

export function LeadsCRM() {
  const [view, setView] = useState<'kanban' | 'table'>('kanban');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Leads & CRM</h2>
          <p className="text-sm text-gray-500 mt-1">Manage your sales pipeline</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add New Lead
        </Button>
      </div>

      {/* AI Insight */}
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">AI Lead Analysis</h3>
              <p className="text-sm text-gray-700">
                <strong>High probability conversion detected:</strong> Lead LD-004 (Neha Sharma) has 95% conversion score. 
                Electricity bill pattern suggests immediate ROI. <strong>Recommended action:</strong> Fast-track survey within 24 hours.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Filters & Search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="Search leads by name, mobile, location..." className="pl-10" />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" />
          Filter
        </Button>
        <Tabs value={view} onValueChange={(v) => setView(v as 'kanban' | 'table')} className="ml-auto">
          <TabsList>
            <TabsTrigger value="kanban">Kanban</TabsTrigger>
            <TabsTrigger value="table">Table</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Kanban View */}
      {view === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {statusColumns.map((status) => {
            const statusLeads = leads.filter(lead => lead.status === status);
            return (
              <Card key={status} className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 text-sm">{status}</h3>
                  <Badge variant="secondary">{statusLeads.length}</Badge>
                </div>
                <div className="space-y-3">
                  {statusLeads.map((lead) => (
                    <Card key={lead.id} className="p-3 hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-blue-500">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-sm text-gray-900">{lead.name}</p>
                            <p className="text-xs text-gray-500">{lead.id}</p>
                          </div>
                          {lead.aiScore >= 90 && (
                            <Badge className="bg-green-100 text-green-700 text-xs">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              {lead.aiScore}%
                            </Badge>
                          )}
                          {lead.duplicate && (
                            <AlertCircle className="w-4 h-4 text-yellow-600" />
                          )}
                        </div>
                        
                        <div className="space-y-1 text-xs text-gray-600">
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {lead.mobile}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {lead.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Zap className="w-3 h-3" />
                            {lead.capacity} | {lead.electricityBill}
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <Badge variant="outline" className="text-xs">{lead.source}</Badge>
                          <span className="text-xs text-gray-500 ml-auto">{lead.createdAt}</span>
                        </div>

                        <div className="flex gap-1 pt-2 border-t">
                          <Button size="sm" variant="outline" className="flex-1 h-7 text-xs gap-1">
                            <Phone className="w-3 h-3" />
                            Call
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1 h-7 text-xs gap-1">
                            <MessageSquare className="w-3 h-3" />
                            Chat
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1 h-7 text-xs gap-1">
                            <Calendar className="w-3 h-3" />
                            Survey
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Table View */}
      {view === 'table' && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 text-sm font-semibold text-gray-900">Lead ID</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-900">Customer</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-900">Contact</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-900">Location</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-900">Capacity</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-900">Source</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-900">AI Score</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-900">Status</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 text-sm text-gray-900">{lead.id}</td>
                    <td className="p-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{lead.name}</p>
                        <p className="text-xs text-gray-500">{lead.assignedTo}</p>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-600">{lead.mobile}</td>
                    <td className="p-4 text-sm text-gray-600">{lead.location}</td>
                    <td className="p-4 text-sm text-gray-900">{lead.capacity}</td>
                    <td className="p-4">
                      <Badge variant="outline">{lead.source}</Badge>
                    </td>
                    <td className="p-4">
                      <Badge className={lead.aiScore >= 90 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                        {lead.aiScore}%
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge className="bg-blue-100 text-blue-700">{lead.status}</Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost">
                          <Phone className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
