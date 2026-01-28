import { ReactNode } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  MapPin, 
  FileText, 
  FolderKanban, 
  Package, 
  Factory, 
  ShieldCheck, 
  Truck, 
  Wrench, 
  Wallet, 
  Activity, 
  HeadphonesIcon, 
  UsersRound, 
  Briefcase, 
  Scale, 
  BarChart3, 
  Settings, 
  Search, 
  Bell, 
  Sparkles,
  ChevronRight,
  Sun,
  Zap,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  MapPinIcon
} from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import { useAppStore } from '@/app/store/AppStore';
import { toast } from 'sonner';

const navigationItems = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: Users, label: 'Leads & CRM', badge: '24' },
  { icon: MapPin, label: 'Survey & Design' },
  { icon: FileText, label: 'Quotations', badge: '8' },
  { icon: FolderKanban, label: 'Projects', badge: '12' },
  { icon: Package, label: 'Inventory' },
  { icon: Factory, label: 'Production' },
  { icon: ShieldCheck, label: 'Quality Control' },
  { icon: Truck, label: 'Logistics' },
  { icon: Wrench, label: 'Installation' },
  { icon: Wallet, label: 'Finance' },
  { icon: Activity, label: 'Monitoring' },
  { icon: HeadphonesIcon, label: 'Service & O&M', badge: '3' },
  { icon: UsersRound, label: 'Community' },
  { icon: Briefcase, label: 'Employees' },
  { icon: Scale, label: 'Compliance' },
  { icon: BarChart3, label: 'Reports' },
  { icon: Settings, label: 'Settings' },
];

const stats = [
  { 
    title: 'Active Projects', 
    value: '47', 
    change: '+12%', 
    trend: 'up', 
    icon: FolderKanban,
    color: 'text-blue-600'
  },
  { 
    title: 'Total Capacity', 
    value: '2.4 MW', 
    change: '+18%', 
    trend: 'up', 
    icon: Zap,
    color: 'text-yellow-600'
  },
  { 
    title: 'Revenue (Month)', 
    value: '₹1.2 CR', 
    change: '+24%', 
    trend: 'up', 
    icon: TrendingUp,
    color: 'text-green-600'
  },
  { 
    title: 'Production Today', 
    value: '340 KW', 
    change: '85%', 
    trend: 'normal', 
    icon: Factory,
    color: 'text-orange-600'
  },
];

const recentProjects = [
  { 
    id: 'PRJ-2401', 
    customer: 'Ramesh Industries', 
    capacity: '50 KW', 
    status: 'Installation', 
    progress: 75,
    location: 'Ahmedabad'
  },
  { 
    id: 'PRJ-2402', 
    customer: 'Sunshine Developers', 
    capacity: '100 KW', 
    status: 'Production', 
    progress: 45,
    location: 'Surat'
  },
  { 
    id: 'PRJ-2403', 
    customer: 'Green Energy Co.', 
    capacity: '75 KW', 
    status: 'Design', 
    progress: 30,
    location: 'Rajkot'
  },
  { 
    id: 'PRJ-2404', 
    customer: 'Metro Mall Pvt Ltd', 
    capacity: '200 KW', 
    status: 'Survey', 
    progress: 15,
    location: 'Vadodara'
  },
];

const alerts = [
  { 
    type: 'warning', 
    message: 'Raw material stock low - Cells (250 units remaining)',
    time: '10 min ago'
  },
  { 
    type: 'success', 
    message: 'Project PRJ-2398 commissioned successfully',
    time: '1 hour ago'
  },
  { 
    type: 'error', 
    message: 'Payment overdue for Project PRJ-2387',
    time: '2 hours ago'
  },
];

export function SolarDashboard({ children }: { children: ReactNode }) {
  const { currentModule, setCurrentModule } = useAppStore();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
              <Sun className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-gray-900">Solar OS</h1>
              <p className="text-xs text-gray-500">Enterprise Platform</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => setCurrentModule(item.label as any)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                  currentModule === item.label
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <Badge variant="secondary" className="ml-auto bg-red-100 text-red-700 hover:bg-red-100">
                    {item.badge}
                  </Badge>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback className="bg-blue-600 text-white">AD</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">Super Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input 
                  placeholder="Search projects, customers, leads..." 
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" className="gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>AI Assistant</span>
              </Button>
              
              <button
                className="relative p-2 hover:bg-gray-100 rounded-lg"
                onClick={() => toast.message('No new notifications')}
              >
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

// Dashboard Home Component
export function DashboardHome() {
  const { setCurrentModule } = useAppStore();
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Dashboard Overview</h2>
          <p className="text-sm text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* AI Insight Panel */}
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">AI Insight</h3>
              <p className="text-sm text-gray-700">
                <strong>Production capacity alert:</strong> Current raw materials can produce <strong>460 KW</strong>. 
                Cells are limiting factor. Suggested action: Reorder 500 units to meet next week's demand.
              </p>
              <div className="flex gap-2 mt-3">
                <Button
                  size="sm"
                  variant="default"
                  className="bg-purple-600 hover:bg-purple-700"
                  onClick={() => setCurrentModule('Inventory')}
                >
                  Create Purchase Order
                </Button>
                <Button size="sm" variant="outline" onClick={() => setCurrentModule('Inventory')}>
                  View Details
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    {stat.trend === 'up' && <TrendingUp className="w-3 h-3 text-green-600" />}
                    <span className={`text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-gray-600'}`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Projects */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Active Projects</h3>
            <Button variant="ghost" size="sm" className="gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-4">
            {recentProjects.map((project) => (
              <div key={project.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 border border-gray-100">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-900">{project.customer}</span>
                    <Badge variant="outline" className="text-xs">{project.id}</Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      {project.capacity}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {project.location}
                    </span>
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-600 rounded-full transition-all"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500">{project.progress}%</span>
                    </div>
                  </div>
                </div>
                <Badge className={
                  project.status === 'Installation' ? 'bg-blue-100 text-blue-700' :
                  project.status === 'Production' ? 'bg-orange-100 text-orange-700' :
                  project.status === 'Design' ? 'bg-purple-100 text-purple-700' :
                  'bg-gray-100 text-gray-700'
                }>
                  {project.status}
                </Badge>
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" className="w-full mt-4">
            View All Notifications
          </Button>
        </Card>

        {/* Alerts & Notifications */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Recent Alerts</h3>
            <Bell className="w-4 h-4 text-gray-400" />
          </div>
          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <div key={index} className="flex gap-3 p-3 rounded-lg bg-gray-50">
                <div className="flex-shrink-0 mt-0.5">
                  {alert.type === 'warning' && (
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  )}
                  {alert.type === 'success' && (
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  )}
                  {alert.type === 'error' && (
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700">{alert.message}</p>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {alert.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" className="w-full mt-4">
            View All Notifications
          </Button>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" onClick={() => setCurrentModule('Leads & CRM')}>
            <Users className="w-5 h-5 text-blue-600" />
            <span className="text-sm">New Lead</span>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" onClick={() => setCurrentModule('Survey & Design')}>
            <MapPin className="w-5 h-5 text-green-600" />
            <span className="text-sm">Schedule Survey</span>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" onClick={() => setCurrentModule('Quotations')}>
            <FileText className="w-5 h-5 text-purple-600" />
            <span className="text-sm">Create Quote</span>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" onClick={() => setCurrentModule('Inventory')}>
            <Package className="w-5 h-5 text-orange-600" />
            <span className="text-sm">Check Inventory</span>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" onClick={() => setCurrentModule('Production')}>
            <Factory className="w-5 h-5 text-red-600" />
            <span className="text-sm">Production Line</span>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" onClick={() => setCurrentModule('Reports')}>
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            <span className="text-sm">View Reports</span>
          </Button>
        </div>
      </Card>
    </div>
  );
}