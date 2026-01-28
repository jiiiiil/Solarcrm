import { useState } from 'react';
import { useAppStore } from '@/app/store/AppStore';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Progress } from '@/app/components/ui/progress';
import { Wrench, Plus, User, Calendar, CheckCircle2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export function InstallationScreen() {
  const { installations, projects, addInstallation, updateInstallation } = useAppStore();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    projectId: '',
    technician: '',
    startDate: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addInstallation({
      ...formData,
      status: 'Scheduled',
      progress: 0,
      tasks: [
        { name: 'Site Preparation', completed: false },
        { name: 'Structure Installation', completed: false },
        { name: 'Panel Mounting', completed: false },
        { name: 'Wiring & Connections', completed: false },
        { name: 'Inverter Setup', completed: false },
        { name: 'Testing', completed: false },
      ],
    });
    toast.success('Installation scheduled');
    setShowForm(false);
    setFormData({ projectId: '', technician: '', startDate: '' });
  };

  const handleTaskToggle = (installationId: string, taskIndex: number) => {
    const installation = installations.find((i) => i.id === installationId);
    if (!installation) return;

    const updatedTasks = installation.tasks.map((task, idx) =>
      idx === taskIndex ? { ...task, completed: !task.completed } : task
    );
    const completedCount = updatedTasks.filter((t) => t.completed).length;
    const progress = Math.round((completedCount / updatedTasks.length) * 100);
    const status = progress === 100 ? 'Completed' : progress > 0 ? 'In Progress' : 'Scheduled';

    updateInstallation(installationId, { tasks: updatedTasks, progress, status: status as any });
    toast.success('Task updated');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Installation Management</h2>
          <p className="text-sm text-gray-500 mt-1">Track on-site installations</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Schedule Installation
        </Button>
      </div>

      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">AI Installation Insights</h3>
            <p className="text-sm text-gray-700">
              Technician A has 98% completion rate for rooftop installations. Recommended for complex projects.
            </p>
          </div>
        </div>
      </Card>

      {showForm && (
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Schedule New Installation</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Project</label>
              <select
                className="w-full mt-1 px-3 py-2 border rounded-lg"
                value={formData.projectId}
                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                required
              >
                <option value="">Select Project</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.id} - {p.customer}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Technician</label>
              <Input
                value={formData.technician}
                onChange={(e) => setFormData({ ...formData, technician: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Start Date</label>
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>
            <div className="flex gap-3">
              <Button type="submit">Schedule</Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="space-y-4">
        {installations.map((installation) => {
          const project = projects.find((p) => p.id === installation.projectId);
          return (
            <Card key={installation.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-gray-900">{installation.id}</span>
                    <Badge
                      className={
                        installation.status === 'Completed'
                          ? 'bg-green-100 text-green-700'
                          : installation.status === 'In Progress'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }
                    >
                      {installation.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{project?.customer}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {installation.technician}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {installation.startDate}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Progress</p>
                  <p className="text-2xl font-semibold text-blue-600">{installation.progress}%</p>
                </div>
              </div>

              <div className="mb-4">
                <Progress value={installation.progress} className="h-2" />
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-900">Installation Tasks</p>
                {installation.tasks.map((task, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleTaskToggle(installation.id, idx)}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          task.completed
                            ? 'bg-green-500 border-green-500'
                            : 'border-gray-300 hover:border-blue-500'
                        }`}
                      >
                        {task.completed && <CheckCircle2 className="w-4 h-4 text-white" />}
                      </button>
                      <span
                        className={`text-sm ${
                          task.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                        }`}
                      >
                        {task.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
        {installations.length === 0 && (
          <Card className="p-8 text-center">
            <Wrench className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">No installations scheduled</p>
          </Card>
        )}
      </div>
    </div>
  );
}
