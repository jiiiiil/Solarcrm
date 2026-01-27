import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
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

const tickets = [
  {
    id: 'TKT-1247',
    customer: 'Ramesh Industries',
    project: 'PRJ-2398',
    issue: 'Inverter Overheating',
    priority: 'High',
    status: 'In Progress',
    assignedTo: 'Tech - Amit',
    slaRemaining: '2h 15m',
    location: 'Ahmedabad',
    createdAt: '2 hours ago',
    aiRootCause: 'Repeat issue detected'
  },
  {
    id: 'TKT-1248',
    customer: 'Green Energy Co.',
    project: 'PRJ-2403',
    issue: 'Low Generation Output',
    priority: 'Medium',
    status: 'Open',
    assignedTo: 'Not Assigned',
    slaRemaining: '6h 30m',
    location: 'Rajkot',
    createdAt: '5 hours ago',
    aiRootCause: null
  },
  {
    id: 'TKT-1249',
    customer: 'Sunshine Developers',
    project: 'PRJ-2402',
    issue: 'Panel Cleaning Required',
    priority: 'Low',
    status: 'Scheduled',
    assignedTo: 'Tech - Rahul',
    slaRemaining: '18h 00m',
    location: 'Surat',
    createdAt: '1 day ago',
    aiRootCause: null
  },
  {
    id: 'TKT-1246',
    customer: 'Metro Mall Pvt Ltd',
    project: 'PRJ-2400',
    issue: 'Monitoring System Offline',
    priority: 'High',
    status: 'Resolved',
    assignedTo: 'Tech - Priya',
    slaRemaining: 'Completed',
    location: 'Vadodara',
    createdAt: '2 days ago',
    resolvedAt: '1 day ago',
    aiRootCause: null
  },
];

const stats = [
  { label: 'Open Tickets', value: '12', color: 'text-blue-600' },
  { label: 'In Progress', value: '5', color: 'text-yellow-600' },
  { label: 'Resolved Today', value: '8', color: 'text-green-600' },
  { label: 'Avg Resolution Time', value: '4.2h', color: 'text-purple-600' },
];

export function ServiceScreen() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Service & O&M</h2>
          <p className="text-sm text-gray-500 mt-1">Ticket management & maintenance</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Create Ticket
        </Button>
      </div>

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
                <strong>Repeat issue identified:</strong> Ticket TKT-1247 (Inverter Overheating at Ramesh Industries) is the 3rd occurrence in 2 months. 
                <br />
                <strong>Root cause:</strong> Inverter installation location has poor ventilation. 
                <strong>Recommended:</strong> Relocate inverter to shaded, well-ventilated area.
              </p>
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="default" className="bg-red-600 hover:bg-red-700">
                  Schedule Relocation
                </Button>
                <Button size="sm" variant="outline">
                  View History
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-4">
            <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
            <p className={`text-3xl font-semibold ${stat.color}`}>{stat.value}</p>
          </Card>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="Search tickets..." className="pl-10" />
        </div>
        <Button variant="outline">Filter by Priority</Button>
        <Button variant="outline">Filter by Status</Button>
      </div>

      {/* Tickets List */}
      <div className="space-y-3">
        {tickets.map((ticket) => (
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
                    {ticket.aiRootCause && (
                      <Badge className="bg-orange-100 text-orange-700 gap-1">
                        <Sparkles className="w-3 h-3" />
                        {ticket.aiRootCause}
                      </Badge>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{ticket.createdAt}</p>
                    {ticket.status !== 'Resolved' && (
                      <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                        <Clock className="w-3 h-3" />
                        <span>SLA: {ticket.slaRemaining}</span>
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
                      <p className="font-medium">{ticket.project}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <div>
                      <p className="text-xs text-gray-500">Location</p>
                      <p className="font-medium">{ticket.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <div>
                      <p className="text-xs text-gray-500">Assigned To</p>
                      <p className="font-medium">{ticket.assignedTo}</p>
                    </div>
                  </div>
                </div>

                {ticket.status === 'Resolved' && ticket.resolvedAt && (
                  <div className="mt-3 p-2 bg-green-50 rounded flex items-center gap-2 text-sm text-green-700">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Resolved {ticket.resolvedAt}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                {ticket.status !== 'Resolved' && (
                  <>
                    <Button size="sm" variant="outline">View Details</Button>
                    <Button size="sm" variant="outline">Update Status</Button>
                  </>
                )}
                {ticket.status === 'Resolved' && (
                  <Button size="sm" variant="outline">View Report</Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Maintenance Schedule */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Upcoming Preventive Maintenance</h3>
        <div className="space-y-3">
          {[
            { project: 'PRJ-2398', customer: 'Ramesh Industries', task: 'Quarterly Inspection', date: 'Tomorrow' },
            { project: 'PRJ-2400', customer: 'Metro Mall', task: 'Panel Cleaning', date: 'In 3 days' },
            { project: 'PRJ-2403', customer: 'Green Energy Co.', task: 'Inverter Maintenance', date: 'In 5 days' },
          ].map((maintenance, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <p className="font-medium text-gray-900">{maintenance.task}</p>
                <p className="text-sm text-gray-600">{maintenance.customer} • {maintenance.project}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-blue-600">{maintenance.date}</p>
                <Button size="sm" variant="outline" className="mt-2">Schedule</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
