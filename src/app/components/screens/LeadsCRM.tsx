import { useMemo, useState } from 'react';
import type { Lead } from '@/app/store/AppStore';
import { useAppStore } from '@/app/store/AppStore';
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
import { toast } from 'sonner';

const statusColumns = ['New', 'Contacted', 'Survey Scheduled', 'Qualified', 'Lost'];

export function LeadsCRM() {
  const { leads, addLead, updateLead, deleteLead, addSurvey, setCurrentModule } = useAppStore();
  const [view, setView] = useState<'kanban' | 'table'>('kanban');
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sourceFilter, setSourceFilter] = useState<string>('All');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'Newest' | 'AI Score' | 'Name'>('AI Score');
  const [selectedIds, setSelectedIds] = useState<Record<string, boolean>>({});
  const [editLeadId, setEditLeadId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', mobile: '', email: '', location: '', capacity: '', assignedTo: '' });
  const [form, setForm] = useState({
    name: '',
    mobile: '',
    email: '',
    source: 'Website',
    location: '',
    capacity: '10 KW',
    electricityBill: '',
    assignedTo: 'Sales Rep 1',
  });

  const filteredLeads = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = leads;
    if (statusFilter !== 'All') list = list.filter((l) => l.status === statusFilter);
    if (sourceFilter !== 'All') list = list.filter((l) => l.source === sourceFilter);
    if (assigneeFilter !== 'All') list = list.filter((l) => l.assignedTo === assigneeFilter);
    if (q) {
      list = list.filter((l) => [l.id, l.name, l.mobile, l.location, l.source, l.capacity].some((v) => v.toLowerCase().includes(q)));
    }
    const sorted = [...list].sort((a, b) => {
      if (sortBy === 'Name') return a.name.localeCompare(b.name);
      if (sortBy === 'Newest') return b.createdAt.localeCompare(a.createdAt);
      return (b.aiScore ?? 0) - (a.aiScore ?? 0);
    });
    return sorted;
  }, [leads, search, statusFilter, sourceFilter, assigneeFilter, sortBy]);

  const sources = useMemo(() => Array.from(new Set(leads.map((l) => l.source))).sort(), [leads]);
  const assignees = useMemo(() => Array.from(new Set(leads.map((l) => l.assignedTo))).sort(), [leads]);

  const selectedCount = useMemo(() => Object.values(selectedIds).filter(Boolean).length, [selectedIds]);
  const toggleSelected = (id: string) => setSelectedIds((p) => ({ ...p, [id]: !p[id] }));
  const clearSelection = () => setSelectedIds({});

  const openEdit = (lead: Lead) => {
    setEditLeadId(lead.id);
    setEditForm({
      name: lead.name,
      mobile: lead.mobile,
      email: lead.email ?? '',
      location: lead.location,
      capacity: lead.capacity,
      assignedTo: lead.assignedTo,
    });
  };

  const createSurveyForLead = (lead: Lead) => {
    addSurvey({
      leadId: lead.id,
      projectId: undefined,
      roofArea: '0',
      shadowPercentage: 0,
      direction: 'South',
      roofType: 'Flat',
      photos: [],
      gpsLocation: '-',
      status: 'Planned',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Leads & CRM</h2>
          <p className="text-sm text-gray-500 mt-1">Manage your sales pipeline</p>
        </div>
        <Button className="gap-2" onClick={() => setShowAdd(true)}>
          <Plus className="w-4 h-4" />
          Add New Lead
        </Button>
      </div>

      {selectedCount > 0 && (
        <Card className="p-3 flex flex-col md:flex-row md:items-center gap-2">
          <div className="text-sm text-gray-700">
            <span className="font-medium">{selectedCount}</span> selected
          </div>
          <div className="flex gap-2 md:ml-auto">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                Object.keys(selectedIds)
                  .filter((id) => selectedIds[id])
                  .forEach((id) => updateLead(id, { status: 'Qualified' }));
                toast.success('Marked selected leads as Qualified');
                clearSelection();
              }}
            >
              Bulk Qualify
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                Object.keys(selectedIds)
                  .filter((id) => selectedIds[id])
                  .forEach((id) => updateLead(id, { status: 'Lost' }));
                toast.success('Marked selected leads as Lost');
                clearSelection();
              }}
            >
              Bulk Lost
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                Object.keys(selectedIds)
                  .filter((id) => selectedIds[id])
                  .forEach((id) => deleteLead(id));
                toast.success('Deleted selected leads');
                clearSelection();
              }}
            >
              Bulk Delete
            </Button>
            <Button size="sm" variant="ghost" onClick={clearSelection}>
              Clear
            </Button>
          </div>
        </Card>
      )}

      {editLeadId && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="font-semibold text-gray-900">Edit Lead</p>
            <Button variant="outline" size="sm" onClick={() => setEditLeadId(null)}>
              Close
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input placeholder="Customer name" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
            <Input placeholder="Mobile" value={editForm.mobile} onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })} />
            <Input placeholder="Email (optional)" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
            <Input placeholder="Location" value={editForm.location} onChange={(e) => setEditForm({ ...editForm, location: e.target.value })} />
            <Input placeholder="Capacity" value={editForm.capacity} onChange={(e) => setEditForm({ ...editForm, capacity: e.target.value })} />
            <Input placeholder="Assigned To" value={editForm.assignedTo} onChange={(e) => setEditForm({ ...editForm, assignedTo: e.target.value })} />
          </div>
          <div className="flex gap-2 mt-3">
            <Button
              onClick={() => {
                if (!editLeadId) return;
                updateLead(editLeadId, {
                  name: editForm.name.trim() || 'Unnamed',
                  mobile: editForm.mobile.trim() || '-',
                  email: editForm.email.trim() || undefined,
                  location: editForm.location.trim() || '-',
                  capacity: editForm.capacity.trim() || '10 KW',
                  assignedTo: editForm.assignedTo.trim() || 'Sales Rep 1',
                });
                toast.success('Lead updated');
                setEditLeadId(null);
              }}
            >
              Save Changes
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                if (!editLeadId) return;
                updateLead(editLeadId, { status: 'Survey Scheduled' });
                const lead = leads.find((l) => l.id === editLeadId);
                if (lead) createSurveyForLead(lead);
                toast.success('Survey scheduled');
                setEditLeadId(null);
                setCurrentModule('Survey & Design');
              }}
            >
              Schedule Survey
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                if (!editLeadId) return;
                updateLead(editLeadId, { status: 'Qualified' });
                toast.success('Qualified');
                setEditLeadId(null);
              }}
            >
              Qualify
            </Button>
          </div>
        </Card>
      )}

      {showAdd && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="font-semibold text-gray-900">Create Lead</p>
            <Button variant="outline" size="sm" onClick={() => setShowAdd(false)}>
              Close
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input placeholder="Customer name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input placeholder="Mobile" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} />
            <Input placeholder="Email (optional)" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Input placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            <Input placeholder="Capacity (e.g. 10 KW)" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} />
            <Input placeholder="Electricity bill (optional)" value={form.electricityBill} onChange={(e) => setForm({ ...form, electricityBill: e.target.value })} />
          </div>
          <div className="flex gap-2 mt-3">
            <Button
              onClick={() => {
                if (!form.name.trim() || !form.mobile.trim() || !form.location.trim()) {
                  toast.error('Name, mobile, and location are required');
                  return;
                }
                addLead({
                  name: form.name.trim(),
                  mobile: form.mobile.trim(),
                  email: form.email.trim() || undefined,
                  source: form.source,
                  location: form.location.trim(),
                  capacity: form.capacity.trim() || '10 KW',
                  status: 'New',
                  aiScore: 70,
                  electricityBill: form.electricityBill.trim() || '-',
                  assignedTo: form.assignedTo,
                });
                toast.success('Lead created');
                setShowAdd(false);
                setForm({
                  name: '',
                  mobile: '',
                  email: '',
                  source: 'Website',
                  location: '',
                  capacity: '10 KW',
                  electricityBill: '',
                  assignedTo: 'Sales Rep 1',
                });
              }}
            >
              Save Lead
            </Button>
            <Button variant="outline" onClick={() => setShowAdd(false)}>
              Cancel
            </Button>
          </div>
        </Card>
      )}

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
          <Input
            placeholder="Search leads by name, mobile, location..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            className="px-3 py-2 border rounded-lg text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            {statusColumns.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            className="px-3 py-2 border rounded-lg text-sm"
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
          >
            <option value="All">All Sources</option>
            {sources.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            className="px-3 py-2 border rounded-lg text-sm"
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
          >
            <option value="All">All Assignees</option>
            {assignees.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
          <select
            className="px-3 py-2 border rounded-lg text-sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
          >
            <option value="AI Score">Sort: AI Score</option>
            <option value="Newest">Sort: Newest</option>
            <option value="Name">Sort: Name</option>
          </select>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => {
              setStatusFilter('All');
              setSourceFilter('All');
              setAssigneeFilter('All');
              toast.success('Filters reset');
            }}
          >
            <Filter className="w-4 h-4" />
            Reset
          </Button>
        </div>
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
            const statusLeads = filteredLeads.filter((lead) => lead.status === status);
            return (
              <Card key={status} className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 text-sm">{status}</h3>
                  <Badge variant="secondary">{statusLeads.length}</Badge>
                </div>
                <div className="space-y-3">
                  {statusLeads.map((lead) => (
                    <Card key={lead.id} className="p-3 hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-blue-500" onClick={() => openEdit(lead)}>
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-sm text-gray-900">{lead.name}</p>
                            <p className="text-xs text-gray-500">{lead.id}</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={!!selectedIds[lead.id]}
                            onChange={(e) => {
                              e.stopPropagation();
                              toggleSelected(lead.id);
                            }}
                          />
                          {lead.aiScore >= 90 && (
                            <Badge className="bg-green-100 text-green-700 text-xs">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              {lead.aiScore}%
                            </Badge>
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
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 h-7 text-xs gap-1"
                            onClick={() => {
                              
                              updateLead(lead.id, { status: 'Contacted' });
                              toast.success('Marked as Contacted');
                            }}
                            disabled={lead.status === 'Lost'}
                          >
                            <Phone className="w-3 h-3" />
                            Call
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 h-7 text-xs gap-1"
                            onClick={() => {
                              updateLead(lead.id, { status: 'Contacted' });
                              toast.success('Chat logged');
                            }}
                            disabled={lead.status === 'Lost'}
                          >
                            <MessageSquare className="w-3 h-3" />
                            Chat
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 h-7 text-xs gap-1"
                            onClick={() => {
                              updateLead(lead.id, { status: 'Survey Scheduled' });
                              createSurveyForLead(lead);
                              toast.success('Survey scheduled');
                              setCurrentModule('Survey & Design');
                            }}
                            disabled={lead.status === 'Lost'}
                          >
                            <Calendar className="w-3 h-3" />
                            Survey
                          </Button>
                        </div>

                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 h-7 text-xs"
                            onClick={() => {
                              updateLead(lead.id, { status: 'Qualified' });
                              toast.success('Lead qualified');
                            }}
                            disabled={lead.status === 'Qualified' || lead.status === 'Lost'}
                          >
                            Qualify
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 h-7 text-xs"
                            onClick={() => {
                              updateLead(lead.id, { status: 'Qualified' });
                              toast.success('Go to Quotations');
                              setCurrentModule('Quotations');
                            }}
                            disabled={lead.status === 'Lost'}
                          >
                            Quote
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 h-7 text-xs text-red-600 hover:text-red-700"
                            onClick={() => {
                              updateLead(lead.id, { status: 'Lost' });
                              toast.success('Marked as Lost');
                            }}
                            disabled={lead.status === 'Lost'}
                          >
                            Lost
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs"
                            onClick={() => {
                              deleteLead(lead.id);
                              toast.success('Lead deleted');
                            }}
                          >
                            Del
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
                {filteredLeads.map((lead) => (
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
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            updateLead(lead.id, { status: 'Contacted' });
                            toast.success('Marked as Contacted');
                          }}
                        >
                          <Phone className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            updateLead(lead.id, { status: 'Survey Scheduled' });
                            createSurveyForLead(lead as Lead);
                            toast.success('Survey scheduled');
                            setCurrentModule('Survey & Design');
                          }}
                        >
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            deleteLead(lead.id);
                            toast.success('Lead deleted');
                          }}
                        >
                          <AlertCircle className="w-4 h-4" />
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
