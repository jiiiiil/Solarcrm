import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { useAppStore } from '@/app/store/AppStore';
import { toast } from 'sonner';
import { 
  Activity, 
  Sparkles,
  Zap,
  TrendingUp,
  Sun,
  Cloud,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useMemo } from 'react';

const generationData = [
  { time: '6 AM', generation: 0.5, expected: 0.8 },
  { time: '8 AM', generation: 3.2, expected: 3.5 },
  { time: '10 AM', generation: 7.8, expected: 8.0 },
  { time: '12 PM', generation: 10.5, expected: 10.2 },
  { time: '2 PM', generation: 9.8, expected: 9.5 },
  { time: '4 PM', generation: 6.2, expected: 6.8 },
  { time: '6 PM', generation: 2.1, expected: 2.5 },
];

const plants = [
  {
    id: 'PRJ-2398',
    name: 'Ramesh Industries',
    capacity: '50 KW',
    location: 'Ahmedabad',
    currentGen: 42.5,
    todayGen: 185,
    health: 95,
    status: 'Optimal',
    alerts: 0
  },
  {
    id: 'PRJ-2400',
    name: 'Metro Mall',
    capacity: '200 KW',
    location: 'Vadodara',
    currentGen: 168,
    todayGen: 720,
    health: 88,
    status: 'Good',
    alerts: 1
  },
  {
    id: 'PRJ-2403',
    name: 'Green Energy Co.',
    capacity: '75 KW',
    location: 'Rajkot',
    currentGen: 58,
    todayGen: 245,
    health: 78,
    status: 'Warning',
    alerts: 2
  },
];

const stats = [
  { label: 'Total Capacity', value: '2.4 MW', icon: Zap, color: 'text-blue-600' },
  { label: 'Current Generation', value: '1.85 MW', icon: TrendingUp, color: 'text-green-600' },
  { label: 'Today\'s Energy', value: '12,450 kWh', icon: Sun, color: 'text-yellow-600' },
  { label: 'Active Plants', value: '47', icon: Activity, color: 'text-purple-600' },
];

export function MonitoringScreen() {
  const { projects, settings, updateSettings, addReport, addServiceTicket, setCurrentModule } = useAppStore();

  const isLive = settings?.monitoringLive ?? true;

  const computedPlants = useMemo(() => {
    const safeProjects = projects ?? [];
    if (safeProjects.length === 0) return plants;

    return safeProjects.slice(0, 6).map((p, idx) => {
      const base = plants[idx % plants.length];
      return {
        id: p.id,
        name: p.customer,
        capacity: p.capacity,
        location: p.location,
        currentGen: base.currentGen,
        todayGen: base.todayGen,
        health: base.health,
        status: base.status,
        alerts: base.alerts,
      };
    });
  }, [projects]);

  const downloadTextFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleToggleLive = () => {
    updateSettings({ monitoringLive: !isLive });
    toast.success(!isLive ? 'Live Monitoring enabled' : 'Live Monitoring paused');
  };

  const handleExport = () => {
    const now = new Date();
    const lines: string[] = [];
    lines.push('Solar OS - Monitoring Export');
    lines.push(`Generated: ${now.toISOString()}`);
    lines.push(`Mode: ${isLive ? 'LIVE' : 'PAUSED'}`);
    lines.push('');
    lines.push('Generation Data (MW)');
    for (const row of generationData) {
      lines.push(`${row.time} | Actual: ${row.generation} | Expected: ${row.expected}`);
    }
    lines.push('');
    lines.push('Plant Snapshot');
    for (const p of computedPlants) {
      lines.push(`${p.id} | ${p.name} | ${p.capacity} | Health: ${p.health}% | Alerts: ${p.alerts}`);
    }

    addReport({
      title: `Monitoring Export - ${now.toISOString().slice(0, 10)}`,
      status: 'Generated',
    });

    downloadTextFile(`monitoring-export-${now.toISOString().slice(0, 10)}.txt`, lines.join('\n'));
    toast.success('Monitoring export downloaded');
  };

  const handleScheduleCleaning = () => {
    const target = computedPlants.find((p) => p.id === 'PRJ-2403') ?? computedPlants[0];
    if (!target) {
      toast.error('No plants found');
      return;
    }

    addServiceTicket({
      projectId: target.id,
      customer: target.name,
      issue: 'Panel soiling suspected — schedule cleaning (AI recommendation)'
      ,
      priority: 'Medium',
      status: 'Open',
      assignedTo: 'Field Team',
    });
    toast.success('Cleaning ticket created in Service & O&M');
    setCurrentModule('Service & O&M');
  };

  const handleViewAnalysis = () => {
    toast.message('AI analysis opened (demo)');
  };

  const handleViewDetails = (plantId: string) => {
    toast.message(`Opening details for ${plantId} (demo)`);
  };

  const handleLiveFeed = (plantId: string) => {
    toast.message(`Live feed for ${plantId} (demo)`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">System Monitoring</h2>
          <p className="text-sm text-gray-500 mt-1">Real-time performance tracking</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleToggleLive} className="text-left">
            <Badge className={`${isLive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'} gap-2`}>
              <div className={`w-2 h-2 ${isLive ? 'bg-green-600 animate-pulse' : 'bg-gray-500'} rounded-full`}></div>
              {isLive ? 'Live Monitoring' : 'Monitoring Paused'}
            </Badge>
          </button>
          <Button variant="outline" onClick={handleExport}>Export Data</Button>
        </div>
      </div>

      {/* AI Performance Alert */}
      <Card className="border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-yellow-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">AI Performance Prediction</h3>
              <p className="text-sm text-gray-700">
                <strong>Performance drop predicted:</strong> Green Energy Co. plant (PRJ-2403) showing 12% lower generation than expected. 
                Analysis indicates panel soiling. <strong>Recommended action:</strong> Schedule cleaning within next 7 days to restore optimal performance.
              </p>
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="default" className="bg-yellow-600 hover:bg-yellow-700" onClick={handleScheduleCleaning}>
                  Schedule Cleaning
                </Button>
                <Button size="sm" variant="outline" onClick={handleViewAnalysis}>
                  View Analysis
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat) => {
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

      {/* Generation Chart */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900">Today's Generation Profile</h3>
            <p className="text-sm text-gray-500">Real-time vs Expected</p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Sun className="w-4 h-4 text-yellow-600" />
            <span className="text-gray-600">Clear Sky • 28°C</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={generationData}>
            <defs>
              <linearGradient id="colorGeneration" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorExpected" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis label={{ value: 'MW', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Area 
              type="monotone" 
              dataKey="expected" 
              stroke="#3b82f6" 
              fillOpacity={1} 
              fill="url(#colorExpected)"
              name="Expected" 
            />
            <Area 
              type="monotone" 
              dataKey="generation" 
              stroke="#10b981" 
              fillOpacity={1} 
              fill="url(#colorGeneration)"
              name="Actual" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Plant List */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Plant Performance Overview</h3>
        <div className="space-y-4">
          {computedPlants.map((plant) => (
            <Card key={plant.id} className="p-4 border-l-4" style={{
              borderLeftColor: plant.health >= 90 ? '#10b981' : plant.health >= 80 ? '#3b82f6' : '#f59e0b'
            }}>
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-900">{plant.name}</h4>
                      <Badge variant="outline">{plant.id}</Badge>
                    </div>
                    <Badge className={
                      plant.status === 'Optimal' ? 'bg-green-100 text-green-700' :
                      plant.status === 'Good' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }>
                      {plant.status === 'Optimal' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                      {plant.status === 'Warning' && <AlertTriangle className="w-3 h-3 mr-1" />}
                      {plant.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Capacity</p>
                      <p className="font-semibold text-gray-900">{plant.capacity}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Current Gen</p>
                      <p className="font-semibold text-green-600">{plant.currentGen} KW</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Today's Total</p>
                      <p className="font-semibold text-gray-900">{plant.todayGen} kWh</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Health Score</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full">
                          <div 
                            className="h-full rounded-full"
                            style={{
                              width: `${plant.health}%`,
                              backgroundColor: plant.health >= 90 ? '#10b981' : plant.health >= 80 ? '#3b82f6' : '#f59e0b'
                            }}
                          ></div>
                        </div>
                        <span className="font-semibold text-gray-900">{plant.health}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-500">Alerts</p>
                      <div className="flex items-center gap-1">
                        {plant.alerts > 0 ? (
                          <Badge className="bg-red-100 text-red-700">
                            {plant.alerts} Active
                          </Badge>
                        ) : (
                          <Badge className="bg-green-100 text-green-700">
                            None
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleViewDetails(plant.id)}>View Details</Button>
                  <Button size="sm" variant="outline" onClick={() => handleLiveFeed(plant.id)}>Live Feed</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* Weather Impact */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Sun className="w-8 h-8 text-yellow-500" />
            <div>
              <p className="text-sm text-gray-500">Current Weather</p>
              <p className="font-semibold text-gray-900">Clear Sky</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Cloud className="w-8 h-8 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Cloud Cover</p>
              <p className="font-semibold text-gray-900">8%</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-sm text-gray-500">Irradiance</p>
              <p className="font-semibold text-gray-900">850 W/m²</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
