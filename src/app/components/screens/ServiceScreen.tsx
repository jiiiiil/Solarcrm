import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { useAppStore, ServiceTicket, Project } from '@/app/store/AppStore';
import { toast } from 'sonner';
import { useMemo, useState } from 'react';
import { 
  HeadphonesIcon, 
  Sparkles,
  AlertTriangle,
  Clock,
  User,
  MapPin,
  Zap,
  CheckCircle2,
  Search,
  Plus
} from 'lucide-react';

function formatRelative(iso: string) {
  const now = Date.now();
  const t = new Date(iso).getTime();
  if (!Number.isFinite(t)) return iso;
  const diffMs = Math.max(0, now - t);
  const mins = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days} day${days === 1 ? '' : 's'} ago`;
  if (hours > 0) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  if (mins > 0) return `${mins} min ago`;
  return 'just now';
}

function prioritySlaHours(priority: ServiceTicket['priority']) {
  if (priority === 'High') return 4;
  if (priority === 'Medium') return 8;
  return 24;
}

function slaRemainingLabel(createdAt: string, priority: ServiceTicket['priority'], status: ServiceTicket['status']) {
  if (status === 'Resolved' || status === 'Closed') return 'Completed';
  const start = new Date(createdAt).getTime();
  if (!Number.isFinite(start)) return '-';
  const deadline = start + prioritySlaHours(priority) * 60 * 60 * 1000;
  const remainingMs = deadline - Date.now();
  if (remainingMs <= 0) return 'Over SLA';
  const mins = Math.ceil(remainingMs / (1000 * 60));
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m.toString().padStart(2, '0')}m`;
}

export function ServiceScreen() {
  const { serviceTickets, projects, addServiceTicket, updateServiceTicket } = useAppStore();
  const [query, setQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<'All' | ServiceTicket['priority']>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | ServiceTicket['status']>('All');
  const [showCreate, setShowCreate] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [createForm, setCreateForm] = useState({
    projectId: projects?.[0]?.id ?? '',
    issue: '',
    priority: 'Medium' as ServiceTicket['priority'],
    assignedTo: 'Field Team',
  });

  const projectById = useMemo(() => {
    const map = new Map<string, Project>();
    (projects ?? []).forEach((p: Project) => map.set(p.id, p));
    return map;
  }, [projects]);

  const enrichedTickets = useMemo(() => {
    const list = serviceTickets ?? [];
    return list
      .slice()
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [serviceTickets]);

  const filteredTickets = useMemo(() => {
    const q = query.trim().toLowerCase();
    return enrichedTickets.filter((t) => {
      if (priorityFilter !== 'All' && t.priority !== priorityFilter) return false;
      if (statusFilter !== 'All' && t.status !== statusFilter) return false;

      if (!q) return true;
      const p = projectById.get(t.projectId);
      const hay = [t.id, t.issue, t.customer, t.projectId, p?.location ?? '', p?.customer ?? '']
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    });
  }, [enrichedTickets, priorityFilter, projectById, query, statusFilter]);

  const selectedTicket = useMemo(() => {
    if (!selectedTicketId) return null;
    return enrichedTickets.find((t) => t.id === selectedTicketId) ?? null;
  }, [enrichedTickets, selectedTicketId]);

  const stats = useMemo(() => {
    const list = serviceTickets ?? [];
    const open = list.filter((t) => t.status === 'Open').length;
    const inProgress = list.filter((t) => t.status === 'In Progress').length;
    const resolvedToday = list.filter((t) => {
      if (t.status !== 'Resolved') return false;
      const d = new Date(t.updatedAt);
      const now = new Date();
      return d.toDateString() === now.toDateString();
    }).length;

    const avgHours = (() => {
      const resolved = list.filter((t) => t.status === 'Resolved');
      if (resolved.length === 0) return 0;
      const total = resolved.reduce((sum, t) => {
        const start = new Date(t.createdAt).getTime();
        const end = new Date(t.updatedAt).getTime();
        if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) return sum;
        return sum + (end - start) / (1000 * 60 * 60);
      }, 0);
      return total / resolved.length;
    })();

    return {
      open,
      inProgress,
      resolvedToday,
      avgHours,
    };
  }, [serviceTickets]);

  const maintenanceItems = useMemo(() => {
    const list = (projects ?? []).slice(0, 3);
    if (list.length === 0) {
      return [
        { projectId: 'PRJ-2398', customer: 'Ramesh Industries', task: 'Quarterly Inspection', date: 'Tomorrow' },
        { projectId: 'PRJ-2400', customer: 'Metro Mall', task: 'Panel Cleaning', date: 'In 3 days' },
        { projectId: 'PRJ-2403', customer: 'Green Energy Co.', task: 'Inverter Maintenance', date: 'In 5 days' },
      ];
    }
    const templates = ['Quarterly Inspection', 'Panel Cleaning', 'Inverter Maintenance'];
    const dates = ['Tomorrow', 'In 3 days', 'In 5 days'];
    return list.map((p, idx) => ({
      projectId: p.id,
      customer: p.customer,
      task: templates[idx % templates.length],
      date: dates[idx % dates.length],
    }));
  }, [projects]);

  const cyclePriorityFilter = () => {
    setPriorityFilter((prev) => {
      if (prev === 'All') return 'High';
      if (prev === 'High') return 'Medium';
      if (prev === 'Medium') return 'Low';
      return 'All';
    });
  };

  const cycleStatusFilter = () => {
    setStatusFilter((prev) => {
      if (prev === 'All') return 'Open';
      if (prev === 'Open') return 'In Progress';
      if (prev === 'In Progress') return 'Scheduled';
      if (prev === 'Scheduled') return 'Resolved';
      if (prev === 'Resolved') return 'Closed';
      return 'All';
    });
  };

  const handleCreateTicket = () => {
    if (!createForm.projectId) {
      toast.error('Select a project');
      return;
    }
    if (!createForm.issue.trim()) {
      toast.error('Enter an issue');
      return;
    }

    const p = projectById.get(createForm.projectId);
    addServiceTicket({
      projectId: createForm.projectId,
      customer: p?.customer ?? 'Customer',
      issue: createForm.issue.trim(),
      priority: createForm.priority,
      status: 'Open',
      assignedTo: createForm.assignedTo || 'Not Assigned',
    });
    toast.success('Ticket created');
    setShowCreate(false);
    setCreateForm((prev) => ({ ...prev, issue: '' }));
  };

  const handleUpdateStatus = (ticket: ServiceTicket) => {
    const next: ServiceTicket['status'] =
      ticket.status === 'Open'
        ? 'In Progress'
        : ticket.status === 'In Progress'
          ? 'Scheduled'
          : ticket.status === 'Scheduled'
            ? 'Resolved'
            : ticket.status === 'Resolved'
              ? 'Closed'
              : 'Closed';
    updateServiceTicket(ticket.id, { status: next });
    toast.success(`Status updated to ${next}`);
  };

  const handleViewDetails = (ticket: ServiceTicket) => {
    setSelectedTicketId(ticket.id);
    toast.message(`Details opened for ${ticket.id}`);
  };

  const handleViewReport = (ticket: ServiceTicket) => {
    const p = projectById.get(ticket.projectId);
    const content = [
      'Solar OS - Service Report',
      `Ticket: ${ticket.id}`,
      `Customer: ${ticket.customer}`,
      `Project: ${ticket.projectId}`,
      `Location: ${p?.location ?? '-'}`,
      `Issue: ${ticket.issue}`,
      `Priority: ${ticket.priority}`,
      `Status: ${ticket.status}`,
      `Assigned To: ${ticket.assignedTo}`,
      `Created: ${ticket.createdAt}`,
      `Updated: ${ticket.updatedAt}`,
    ].join('\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `service-report-${ticket.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Report downloaded');
  };

  const aiTicket = useMemo(() => {
    return enrichedTickets.find((t) => t.issue.toLowerCase().includes('inverter') && t.priority === 'High') ?? enrichedTickets[0];
  }, [enrichedTickets]);

  const handleScheduleRelocation = () => {
    if (!aiTicket) {
      toast.error('No ticket found');
      return;
    }
    updateServiceTicket(aiTicket.id, {
      status: 'Scheduled',
      assignedTo: aiTicket.assignedTo || 'Field Team',
    });
    toast.success('Relocation scheduled (demo)');
  };

  const handleViewHistory = () => {
    toast.message('Service history opened (demo)');
  };

  const handleScheduleMaintenance = (m: { projectId: string; customer: string; task: string; date: string }) => {
    addServiceTicket({
      projectId: m.projectId,
      customer: m.customer,
      issue: `${m.task} (${m.date})`,
      priority: 'Low',
      status: 'Scheduled',
      assignedTo: 'Preventive Team',
    });
    toast.success('Maintenance scheduled');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Service & O&M</h2>
          <p className="text-sm text-gray-500 mt-1">Ticket management & maintenance</p>
        </div>
        <Button className="gap-2" onClick={() => setShowCreate(true)}>
          <Plus className="w-4 h-4" />
          Create Ticket
        </Button>
      </div>

      {showCreate && (
        <Card className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Create Service Ticket</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-4">
                <div>
                  <label className="text-sm text-gray-600">Project</label>
                  <select
                    value={createForm.projectId}
                    onChange={(e) => setCreateForm((prev) => ({ ...prev, projectId: e.target.value }))}
                    className="mt-1 w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
                  >
                    <option value="">Select project</option>
                    {(projects ?? []).map((p: Project) => (
                      <option key={p.id} value={p.id}>
                        {p.id} - {p.customer}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm text-gray-600">Issue</label>
                  <Input
                    value={createForm.issue}
                    onChange={(e) => setCreateForm((prev) => ({ ...prev, issue: e.target.value }))}
                    placeholder="e.g. Inverter overheating"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Priority</label>
                  <select
                    value={createForm.priority}
                    onChange={(e) => setCreateForm((prev) => ({ ...prev, priority: e.target.value as ServiceTicket['priority'] }))}
                    className="mt-1 w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Assigned To</label>
                  <Input
                    value={createForm.assignedTo}
                    onChange={(e) => setCreateForm((prev) => ({ ...prev, assignedTo: e.target.value }))}
                    placeholder="Tech - Rahul"
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={handleCreateTicket}>Create</Button>
                <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* AI Root Cause Analysis */}
      <Card className="border-red-200 bg-gradient-to-r from-red-50 to-orange-50">
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">AI Root Cause Detection</h3>
              <p className="text-sm text-gray-700">
                <strong>Repeat issue identified:</strong>{' '}
                {aiTicket ? (
                  <>Ticket <strong>{aiTicket.id}</strong> ({aiTicket.issue} at {aiTicket.customer}) shows repeat patterns.</>
                ) : (
                  <>No ticket patterns detected.</>
                )}
                <br />
                <strong>Root cause:</strong> Inverter installation location has poor ventilation. 
                <strong>Recommended:</strong> Relocate inverter to shaded, well-ventilated area.
              </p>
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="default" className="bg-red-600 hover:bg-red-700" onClick={handleScheduleRelocation}>
                  Schedule Relocation
                </Button>
                <Button size="sm" variant="outline" onClick={handleViewHistory}>
                  View History
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-500 mb-1">Open Tickets</p>
          <p className="text-3xl font-semibold text-blue-600">{stats.open}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500 mb-1">In Progress</p>
          <p className="text-3xl font-semibold text-yellow-600">{stats.inProgress}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500 mb-1">Resolved Today</p>
          <p className="text-3xl font-semibold text-green-600">{stats.resolvedToday}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500 mb-1">Avg Resolution Time</p>
          <p className="text-3xl font-semibold text-purple-600">{stats.avgHours ? `${stats.avgHours.toFixed(1)}h` : '—'}</p>
        </Card>
      </div>

      {/* Search & Filter */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="Search tickets..." className="pl-10" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <Button variant="outline" onClick={cyclePriorityFilter}>Filter by Priority: {priorityFilter}</Button>
        <Button variant="outline" onClick={cycleStatusFilter}>Filter by Status: {statusFilter}</Button>
      </div>

      {/* Tickets List */}
      <div className="space-y-3">
        {filteredTickets.map((ticket: ServiceTicket) => {
          const p = projectById.get(ticket.projectId);
          const location = p?.location ?? '-';
          const createdAtLabel = formatRelative(ticket.createdAt);
          const slaRemaining = slaRemainingLabel(ticket.createdAt, ticket.priority, ticket.status);
          const aiRootCause = ticket.issue.toLowerCase().includes('inverter') ? 'Repeat issue detected' : null;

          return (
          <Card key={ticket.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">{ticket.id}</span>
                    <Badge className={
                      ticket.priority === 'High' ? 'bg-red-100 text-red-700' :
                      ticket.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }>
                      {ticket.priority}
                    </Badge>
                    <Badge className={
                      ticket.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                      ticket.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                      ticket.status === 'Scheduled' ? 'bg-purple-100 text-purple-700' :
                      'bg-gray-100 text-gray-700'
                    }>
                      {ticket.status}
                    </Badge>
                    {aiRootCause && (
                      <Badge className="bg-orange-100 text-orange-700 gap-1">
                        <Sparkles className="w-3 h-3" />
                        {aiRootCause}
                      </Badge>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{createdAtLabel}</p>
                    {ticket.status !== 'Resolved' && (
                      <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                        <Clock className="w-3 h-3" />
                        <span>SLA: {slaRemaining}</span>
                      </div>
                    )}
                  </div>
                </div>

                <h4 className="font-semibold text-gray-900 mb-2">{ticket.issue}</h4>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <div>
                      <p className="text-xs text-gray-500">Customer</p>
                      <p className="font-medium">{ticket.customer}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    <div>
                      <p className="text-xs text-gray-500">Project</p>
                      <p className="font-medium">{ticket.projectId}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <div>
                      <p className="text-xs text-gray-500">Location</p>
                      <p className="font-medium">{location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <div>
                      <p className="text-xs text-gray-500">Assigned To</p>
                      <p className="font-medium">{ticket.assignedTo || 'Not Assigned'}</p>
                    </div>
                  </div>
                </div>

                {ticket.status === 'Resolved' && (
                  <div className="mt-3 p-2 bg-green-50 rounded flex items-center gap-2 text-sm text-green-700">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Resolved {formatRelative(ticket.updatedAt)}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                {ticket.status !== 'Resolved' && (
                  <>
                    <Button size="sm" variant="outline" onClick={() => handleViewDetails(ticket)}>View Details</Button>
                    <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(ticket)}>Update Status</Button>
                  </>
                )}
                {ticket.status === 'Resolved' && (
                  <Button size="sm" variant="outline" onClick={() => handleViewReport(ticket)}>View Report</Button>
                )}
              </div>
            </div>
          </Card>
        );
        })}

        {filteredTickets.length === 0 && (
          <Card className="p-6">
            <p className="text-sm text-gray-600">No tickets match your filters.</p>
          </Card>
        )}
      </div>

      {/* Maintenance Schedule */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Upcoming Preventive Maintenance</h3>
        <div className="space-y-3">
          {maintenanceItems.map((maintenance, idx) => (
            <div key={`${maintenance.projectId}-${idx}`} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <p className="font-medium text-gray-900">{maintenance.task}</p>
                <p className="text-sm text-gray-600">{maintenance.customer} • {maintenance.projectId}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-blue-600">{maintenance.date}</p>
                <Button size="sm" variant="outline" className="mt-2" onClick={() => handleScheduleMaintenance(maintenance)}>
                  Schedule
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {selectedTicket && (
        <Card className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Ticket Details: {selectedTicket.id}</h3>
                <Button size="sm" variant="outline" onClick={() => setSelectedTicketId(null)}>Close</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 text-sm text-gray-700">
                <div><strong>Customer:</strong> {selectedTicket.customer}</div>
                <div><strong>Project:</strong> {selectedTicket.projectId}</div>
                <div><strong>Issue:</strong> {selectedTicket.issue}</div>
                <div><strong>Priority:</strong> {selectedTicket.priority}</div>
                <div><strong>Status:</strong> {selectedTicket.status}</div>
                <div><strong>Assigned To:</strong> {selectedTicket.assignedTo || 'Not Assigned'}</div>
              </div>
              <div className="flex gap-2 mt-4">
                {selectedTicket.status !== 'Resolved' ? (
                  <Button onClick={() => handleUpdateStatus(selectedTicket)}>Next Status</Button>
                ) : (
                  <Button onClick={() => handleViewReport(selectedTicket)}>Download Report</Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
