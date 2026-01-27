import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Progress } from '@/app/components/ui/progress';
import { 
  Factory, 
  Sparkles,
  Clock,
  AlertTriangle,
  TrendingUp,
  Users,
  Box,
  Zap
} from 'lucide-react';

const productionStages = [
  { 
    id: 1, 
    name: 'Glass Cleaning', 
    batches: 8, 
    capacity: '40 KW',
    delay: 0, 
    machine: 'GC-01',
    shift: 'Day',
    status: 'on-track',
    workers: 2
  },
  { 
    id: 2, 
    name: 'Cell Stringing', 
    batches: 7, 
    capacity: '35 KW',
    delay: 0, 
    machine: 'CS-02',
    shift: 'Day',
    status: 'on-track',
    workers: 3
  },
  { 
    id: 3, 
    name: 'Layup', 
    batches: 6, 
    capacity: '30 KW',
    delay: 15, 
    machine: 'LY-01',
    shift: 'Day',
    status: 'delayed',
    workers: 2
  },
  { 
    id: 4, 
    name: 'Lamination', 
    batches: 4, 
    capacity: '20 KW',
    delay: 45, 
    machine: 'LM-03',
    shift: 'Night',
    status: 'bottleneck',
    workers: 4
  },
  { 
    id: 5, 
    name: 'Framing', 
    batches: 5, 
    capacity: '25 KW',
    delay: 0, 
    machine: 'FR-02',
    shift: 'Day',
    status: 'on-track',
    workers: 3
  },
  { 
    id: 6, 
    name: 'EL Testing', 
    batches: 5, 
    capacity: '25 KW',
    delay: 0, 
    machine: 'EL-01',
    shift: 'Day',
    status: 'on-track',
    workers: 2
  },
  { 
    id: 7, 
    name: 'Sun Simulator', 
    batches: 5, 
    capacity: '25 KW',
    delay: 0, 
    machine: 'SS-01',
    shift: 'Day',
    status: 'completed',
    workers: 2
  },
];

const dailyStats = [
  { label: 'Target Production', value: '500 KW', icon: Zap, color: 'text-blue-600' },
  { label: 'Current Production', value: '340 KW', icon: TrendingUp, color: 'text-green-600' },
  { label: 'Efficiency', value: '85%', icon: Factory, color: 'text-orange-600' },
  { label: 'Active Workers', value: '18', icon: Users, color: 'text-purple-600' },
];

export function ProductionTracker() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Production Line Tracker</h2>
          <p className="text-sm text-gray-500 mt-1">Real-time manufacturing monitoring</p>
        </div>
        <div className="flex gap-3">
          <Badge className="bg-green-100 text-green-700">Day Shift Active</Badge>
          <Badge variant="outline">Factory: Ahmedabad</Badge>
        </div>
      </div>

      {/* AI Bottleneck Detection */}
      <Card className="border-red-200 bg-gradient-to-r from-red-50 to-orange-50">
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">AI Bottleneck Alert</h3>
              <p className="text-sm text-gray-700">
                <strong>Critical delay detected at Lamination stage:</strong> 45 min delay causing production backup. 
                Root cause: Night shift overload on Machine LM-03. 
                <strong>Recommended:</strong> Reassign 2 workers from Framing to Lamination immediately.
              </p>
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="default" className="bg-red-600 hover:bg-red-700">
                  Reassign Workers
                </Button>
                <Button size="sm" variant="outline">
                  View Details
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Daily Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {dailyStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
                <Icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Production Flow Visualization */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-6">Production Line Flow</h3>
        
        {/* Timeline visualization */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-4">
            {productionStages.map((stage, index) => (
              <div key={stage.id} className="flex items-center">
                <Card className={`p-4 min-w-[200px] border-2 ${
                  stage.status === 'bottleneck' ? 'border-red-500 bg-red-50' :
                  stage.status === 'delayed' ? 'border-yellow-500 bg-yellow-50' :
                  stage.status === 'completed' ? 'border-green-500 bg-green-50' :
                  'border-blue-500 bg-blue-50'
                }`}>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge className={
                        stage.status === 'bottleneck' ? 'bg-red-600' :
                        stage.status === 'delayed' ? 'bg-yellow-600' :
                        stage.status === 'completed' ? 'bg-green-600' :
                        'bg-blue-600'
                      }>
                        Stage {stage.id}
                      </Badge>
                      {stage.delay > 0 && (
                        <div className="flex items-center gap-1 text-xs text-red-700">
                          <Clock className="w-3 h-3" />
                          +{stage.delay}m
                        </div>
                      )}
                    </div>
                    
                    <h4 className="font-semibold text-gray-900 text-sm">{stage.name}</h4>
                    
                    <div className="space-y-1 text-xs text-gray-600">
                      <div className="flex items-center justify-between">
                        <span>Batches:</span>
                        <span className="font-semibold">{stage.batches}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Capacity:</span>
                        <span className="font-semibold">{stage.capacity}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Machine:</span>
                        <span className="font-semibold">{stage.machine}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Workers:</span>
                        <span className="font-semibold">{stage.workers}</span>
                      </div>
                    </div>

                    <Badge variant="outline" className="text-xs">
                      {stage.shift} Shift
                    </Badge>
                  </div>
                </Card>
                
                {index < productionStages.length - 1 && (
                  <div className="w-8 h-0.5 bg-gray-300 mx-2"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Detailed Stage Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Batches */}
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Active Batches</h3>
          <div className="space-y-3">
            {[
              { id: 'BATCH-247', stage: 'Lamination', project: 'PRJ-2401', kw: '25 KW', progress: 65 },
              { id: 'BATCH-248', stage: 'Framing', project: 'PRJ-2402', kw: '30 KW', progress: 80 },
              { id: 'BATCH-249', stage: 'EL Testing', project: 'PRJ-2403', kw: '20 KW', progress: 90 },
              { id: 'BATCH-250', stage: 'Layup', project: 'PRJ-2404', kw: '15 KW', progress: 45 },
            ].map((batch) => (
              <div key={batch.id} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Box className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-sm">{batch.id}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">{batch.kw}</Badge>
                </div>
                <div className="text-xs text-gray-600 mb-2">
                  {batch.stage} • {batch.project}
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={batch.progress} className="flex-1 h-1.5" />
                  <span className="text-xs text-gray-500">{batch.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Machine Status */}
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Machine Status</h3>
          <div className="space-y-3">
            {[
              { machine: 'LM-03', status: 'Overloaded', utilization: 95, health: 'Warning' },
              { machine: 'CS-02', status: 'Running', utilization: 78, health: 'Good' },
              { machine: 'FR-02', status: 'Running', utilization: 65, health: 'Good' },
              { machine: 'EL-01', status: 'Running', utilization: 72, health: 'Good' },
            ].map((machine) => (
              <div key={machine.machine} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{machine.machine}</span>
                  <Badge className={
                    machine.health === 'Warning' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                  }>
                    {machine.health}
                  </Badge>
                </div>
                <div className="text-xs text-gray-600 mb-2">{machine.status}</div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Utilization:</span>
                  <Progress value={machine.utilization} className="flex-1 h-1.5" />
                  <span className="text-xs font-medium">{machine.utilization}%</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Action Bar */}
      <div className="flex justify-end gap-3">
        <Button variant="outline">Export Report</Button>
        <Button variant="outline">Shift Handover</Button>
        <Button>Start New Batch</Button>
      </div>
    </div>
  );
}
