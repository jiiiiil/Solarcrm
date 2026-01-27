import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Progress } from '@/app/components/ui/progress';
import { 
  FolderKanban, 
  Sparkles,
  MapPin,
  Zap,
  Calendar,
  User,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Search,
  Filter
} from 'lucide-react';

const projects = [
  {
    id: 'PRJ-2401',
    customer: 'Ramesh Industries',
    capacity: '50 KW',
    location: 'Ahmedabad, Gujarat',
    status: 'Installation',
    progress: 75,
    stages: {
      survey: 'completed',
      design: 'completed',
      quotation: 'completed',
      production: 'completed',
      logistics: 'completed',
      installation: 'in-progress',
      commissioning: 'pending'
    },
    startDate: '15 Jan 2026',
    expectedCompletion: '5 Feb 2026',
    projectManager: 'Amit Shah',
    totalValue: 2500000,
    alerts: []
  },
  {
    id: 'PRJ-2402',
    customer: 'Sunshine Developers',
    capacity: '100 KW',
    location: 'Surat, Gujarat',
    status: 'Production',
    progress: 45,
    stages: {
      survey: 'completed',
      design: 'completed',
      quotation: 'completed',
      production: 'in-progress',
      logistics: 'pending',
      installation: 'pending',
      commissioning: 'pending'
    },
    startDate: '20 Jan 2026',
    expectedCompletion: '15 Feb 2026',
    projectManager: 'Priya Patel',
    totalValue: 5200000,
    alerts: ['Production delay: 2 days']
  },
  {
    id: 'PRJ-2403',
    customer: 'Green Energy Co.',
    capacity: '75 KW',
    location: 'Rajkot, Gujarat',
    status: 'Design',
    progress: 30,
    stages: {
      survey: 'completed',
      design: 'in-progress',
      quotation: 'pending',
      production: 'pending',
      logistics: 'pending',
      installation: 'pending',
      commissioning: 'pending'
    },
    startDate: '22 Jan 2026',
    expectedCompletion: '20 Feb 2026',
    projectManager: 'Rahul Kumar',
    totalValue: 3900000,
    alerts: []
  },
  {
    id: 'PRJ-2404',
    customer: 'Metro Mall Pvt Ltd',
    capacity: '200 KW',
    location: 'Vadodara, Gujarat',
    status: 'Survey',
    progress: 15,
    stages: {
      survey: 'in-progress',
      design: 'pending',
      quotation: 'pending',
      production: 'pending',
      logistics: 'pending',
      installation: 'pending',
      commissioning: 'pending'
    },
    startDate: '25 Jan 2026',
    expectedCompletion: '1 Mar 2026',
    projectManager: 'Neha Sharma',
    totalValue: 10400000,
    alerts: []
  },
];

const stageLabels = [
  { key: 'survey', label: 'Survey' },
  { key: 'design', label: 'Design' },
  { key: 'quotation', label: 'Quotation' },
  { key: 'production', label: 'Production' },
  { key: 'logistics', label: 'Logistics' },
  { key: 'installation', label: 'Installation' },
  { key: 'commissioning', label: 'Commissioning' },
];

export function ProjectsScreen() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Projects</h2>
          <p className="text-sm text-gray-500 mt-1">Manage all active projects</p>
        </div>
        <div className="flex gap-3">
          <Badge variant="outline">47 Active Projects</Badge>
          <Badge className="bg-green-100 text-green-700">12 Completed This Month</Badge>
        </div>
      </div>

      {/* AI Project Alert */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50">
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">AI Project Intelligence</h3>
              <p className="text-sm text-gray-700">
                <strong>Critical path alert:</strong> Project PRJ-2402 (Sunshine Developers) has 2-day production delay. 
                This will impact installation schedule. <strong>Recommended action:</strong> Expedite production or adjust installation date by 3 days to maintain quality.
              </p>
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="default" className="bg-blue-600 hover:bg-blue-700">
                  Adjust Schedule
                </Button>
                <Button size="sm" variant="outline">
                  View Timeline
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Search & Filter */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="Search projects..." className="pl-10" />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" />
          Filter
        </Button>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {projects.map((project) => (
          <Card key={project.id} className="p-6 hover:shadow-lg transition-shadow">
            {/* Project Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{project.customer}</h3>
                  <Badge variant="outline">{project.id}</Badge>
                  <Badge className={
                    project.status === 'Installation' ? 'bg-blue-100 text-blue-700' :
                    project.status === 'Production' ? 'bg-orange-100 text-orange-700' :
                    project.status === 'Design' ? 'bg-purple-100 text-purple-700' :
                    project.status === 'Survey' ? 'bg-gray-100 text-gray-700' :
                    'bg-green-100 text-green-700'
                  }>
                    {project.status}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Zap className="w-4 h-4" />
                    {project.capacity}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {project.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    PM: {project.projectManager}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {project.startDate} - {project.expectedCompletion}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm text-gray-500">Project Value</p>
                <p className="text-xl font-semibold text-green-600">
                  ₹{(project.totalValue / 100000).toFixed(1)}L
                </p>
              </div>
            </div>

            {/* Alerts */}
            {project.alerts.length > 0 && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                <span className="text-sm text-yellow-800">{project.alerts[0]}</span>
              </div>
            )}

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                <span className="text-sm text-gray-600">{project.progress}%</span>
              </div>
              <Progress value={project.progress} className="h-2" />
            </div>

            {/* Stage Timeline */}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-gray-900">Project Timeline</p>
              <div className="flex items-center gap-2">
                {stageLabels.map((stage, index) => {
                  const stageStatus = project.stages[stage.key as keyof typeof project.stages];
                  return (
                    <div key={stage.key} className="flex items-center flex-1">
                      <div className="flex flex-col items-center flex-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                          stageStatus === 'completed' ? 'bg-green-500 border-green-500' :
                          stageStatus === 'in-progress' ? 'bg-blue-500 border-blue-500 animate-pulse' :
                          'bg-gray-200 border-gray-300'
                        }`}>
                          {stageStatus === 'completed' && <CheckCircle2 className="w-5 h-5 text-white" />}
                          {stageStatus === 'in-progress' && <Clock className="w-5 h-5 text-white" />}
                          {stageStatus === 'pending' && <div className="w-2 h-2 bg-gray-400 rounded-full"></div>}
                        </div>
                        <span className={`text-xs mt-1 ${
                          stageStatus === 'completed' ? 'text-green-700 font-medium' :
                          stageStatus === 'in-progress' ? 'text-blue-700 font-medium' :
                          'text-gray-500'
                        }`}>
                          {stage.label}
                        </span>
                      </div>
                      {index < stageLabels.length - 1 && (
                        <div className={`flex-1 h-0.5 ${
                          stageStatus === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                        }`}></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-4 pt-4 border-t">
              <Button size="sm" variant="outline">View Details</Button>
              <Button size="sm" variant="outline">Documents</Button>
              <Button size="sm" variant="outline">Timeline</Button>
              <Button size="sm" variant="outline">Team</Button>
              <Button size="sm" variant="default" className="ml-auto">Update Status</Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-500">In Survey</p>
          <p className="text-2xl font-semibold text-gray-900">8</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">In Production</p>
          <p className="text-2xl font-semibold text-orange-600">12</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">In Installation</p>
          <p className="text-2xl font-semibold text-blue-600">15</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Commissioned</p>
          <p className="text-2xl font-semibold text-green-600">12</p>
        </Card>
      </div>
    </div>
  );
}
