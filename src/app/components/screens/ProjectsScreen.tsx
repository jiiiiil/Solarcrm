import { useMemo, useState } from 'react';
import type { Project } from '@/app/store/AppStore';
import { useAppStore } from '@/app/store/AppStore';
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
import { toast } from 'sonner';

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
  const { projects, updateProject, setCurrentModule } = useAppStore();
  const [search, setSearch] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [activeDetailsTab, setActiveDetailsTab] = useState<'Details' | 'Documents' | 'Timeline' | 'Team'>('Details');
  const [docForm, setDocForm] = useState({ name: '', content: '' });
  const [timelineForm, setTimelineForm] = useState({ title: '', date: '', status: 'Planned' as 'Planned' | 'Done' | 'Blocked' });
  const [teamForm, setTeamForm] = useState({ name: '', role: '' });

  const filteredProjects = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter((p) =>
      [p.id, p.customer, p.location, p.status, p.projectManager].some((v) => v.toLowerCase().includes(q)),
    );
  }, [projects, search]);

  const selectedProject = useMemo(() => {
    if (!selectedProjectId) return null;
    return projects.find((p) => p.id === selectedProjectId) ?? null;
  }, [projects, selectedProjectId]);

  const openDetails = (projectId: string, tab: 'Details' | 'Documents' | 'Timeline' | 'Team' = 'Details') => {
    setSelectedProjectId(projectId);
    setActiveDetailsTab(tab);
  };

  const downloadTextFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const totals = useMemo(() => {
    const inSurvey = projects.filter((p) => p.status === 'Survey').length;
    const inProduction = projects.filter((p) => p.status === 'Production').length;
    const inInstallation = projects.filter((p) => p.status === 'Installation').length;
    const completed = projects.filter((p) => p.status === 'Completed').length;
    return { inSurvey, inProduction, inInstallation, completed, active: projects.length };
  }, [projects]);

  const statusOrder: Project['status'][] = ['Survey', 'Design', 'Production', 'Logistics', 'Installation', 'Commissioning', 'Completed'];

  const getNextStatus = (status: Project['status']): Project['status'] => {
    const idx = statusOrder.indexOf(status);
    return statusOrder[Math.min(statusOrder.length - 1, Math.max(0, idx + 1))];
  };

  const statusToModule = (status: Project['status']) => {
    switch (status) {
      case 'Survey':
      case 'Design':
        return 'Survey & Design' as const;
      case 'Production':
        return 'Production' as const;
      case 'Logistics':
        return 'Logistics' as const;
      case 'Installation':
        return 'Installation' as const;
      case 'Commissioning':
        return 'Monitoring' as const;
      case 'Completed':
        return 'Finance' as const;
      default:
        return 'Projects' as const;
    }
  };

  const buildStages = (project: Project) => {
    const idx = statusOrder.indexOf(project.status);
    const stageKeys = ['survey', 'design', 'quotation', 'production', 'logistics', 'installation', 'commissioning'] as const;
    const stageToStatusIndex: Record<(typeof stageKeys)[number], number> = {
      survey: 0,
      design: 1,
      quotation: 1,
      production: 2,
      logistics: 3,
      installation: 4,
      commissioning: 5,
    };

    const stages: Record<(typeof stageKeys)[number], 'completed' | 'in-progress' | 'pending'> = {
      survey: 'pending',
      design: 'pending',
      quotation: 'pending',
      production: 'pending',
      logistics: 'pending',
      installation: 'pending',
      commissioning: 'pending',
    };

    stageKeys.forEach((k) => {
      const sIdx = stageToStatusIndex[k];
      if (idx > sIdx) stages[k] = 'completed';
      if (idx === sIdx) stages[k] = 'in-progress';
      if (idx < sIdx) stages[k] = 'pending';
    });

    return stages;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Projects</h2>
          <p className="text-sm text-gray-500 mt-1">Manage all active projects</p>
        </div>
        <div className="flex gap-3">
          <Badge variant="outline">{totals.active} Active Projects</Badge>
          <Badge className="bg-green-100 text-green-700">{totals.completed} Completed</Badge>
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
          <Input placeholder="Search projects..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" />
          Filter
        </Button>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {filteredProjects.map((project: Project) => {
          const stages = buildStages(project);
          const alerts: string[] = project.status === 'Production' && project.progress < 40 ? ['Production delay risk'] : [];
          return (
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
            {alerts.length > 0 && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                <span className="text-sm text-yellow-800">{alerts[0]}</span>
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
                  const stageStatus = stages[stage.key as keyof typeof stages];
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
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  openDetails(project.id, 'Details');
                }}
              >
                View Details
              </Button>
              <Button size="sm" variant="outline" onClick={() => openDetails(project.id, 'Documents')}>
                Documents
              </Button>
              <Button size="sm" variant="outline" onClick={() => openDetails(project.id, 'Timeline')}>
                Timeline
              </Button>
              <Button size="sm" variant="outline" onClick={() => openDetails(project.id, 'Team')}>
                Team
              </Button>
              <Button
                size="sm"
                variant="default"
                className="ml-auto"
                disabled={project.status === 'Completed'}
                onClick={() => {
                  const next = getNextStatus(project.status);
                  const nextProgress = Math.min(100, Math.max(project.progress, statusOrder.indexOf(next) * 15 + 10));
                  updateProject(project.id, { status: next, progress: nextProgress });
                  toast.success(`Moved to ${next}`);
                  setCurrentModule(statusToModule(next));
                }}
              >
                Update Status
              </Button>
            </div>
          </Card>
          );
        })}
      </div>

      {selectedProject && (
        <Card className="p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-gray-900">{selectedProject.customer}</h3>
                <Badge variant="outline">{selectedProject.id}</Badge>
                <Badge variant="outline">{selectedProject.status}</Badge>
              </div>
              <p className="text-sm text-gray-600 mt-1">{selectedProject.location} • {selectedProject.capacity}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedProjectId(null)}>
                Close
              </Button>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button size="sm" variant={activeDetailsTab === 'Details' ? 'default' : 'outline'} onClick={() => setActiveDetailsTab('Details')}>
              Details
            </Button>
            <Button size="sm" variant={activeDetailsTab === 'Documents' ? 'default' : 'outline'} onClick={() => setActiveDetailsTab('Documents')}>
              Documents
            </Button>
            <Button size="sm" variant={activeDetailsTab === 'Timeline' ? 'default' : 'outline'} onClick={() => setActiveDetailsTab('Timeline')}>
              Timeline
            </Button>
            <Button size="sm" variant={activeDetailsTab === 'Team' ? 'default' : 'outline'} onClick={() => setActiveDetailsTab('Team')}>
              Team
            </Button>
          </div>

          {activeDetailsTab === 'Details' && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4">
                <p className="text-sm text-gray-500">Project Manager</p>
                <p className="text-sm font-medium text-gray-900 mt-1">{selectedProject.projectManager}</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-gray-500">Dates</p>
                <p className="text-sm font-medium text-gray-900 mt-1">{selectedProject.startDate} - {selectedProject.expectedCompletion}</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-gray-500">Project Value</p>
                <p className="text-sm font-medium text-gray-900 mt-1">₹{selectedProject.totalValue.toLocaleString()}</p>
              </Card>
            </div>
          )}

          {activeDetailsTab === 'Documents' && (
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-1">
                  <label className="text-sm font-medium text-gray-700">Document Name</label>
                  <Input value={docForm.name} onChange={(e) => setDocForm({ ...docForm, name: e.target.value })} />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Content (for demo)</label>
                  <Input value={docForm.content} onChange={(e) => setDocForm({ ...docForm, content: e.target.value })} />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => {
                    const name = docForm.name.trim();
                    if (!name) {
                      toast.error('Enter document name');
                      return;
                    }

                    const nextDoc = {
                      id: `DOC-${Date.now()}`,
                      name,
                      content: docForm.content || `Document: ${name}`,
                      uploadedAt: new Date().toLocaleString(),
                    };

                    const nextDocs = [...(selectedProject.documents ?? []), nextDoc];
                    updateProject(selectedProject.id, { documents: nextDocs });
                    setDocForm({ name: '', content: '' });
                    toast.success('Document added');
                  }}
                >
                  Add Document
                </Button>
                <Button size="sm" variant="outline" onClick={() => toast.success('Documents synced')}>
                  Sync
                </Button>
              </div>

              <div className="space-y-2">
                {(selectedProject.documents ?? []).map((d) => (
                  <div key={d.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{d.name}</p>
                      <p className="text-xs text-gray-500">Uploaded: {d.uploadedAt}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          toast.message(d.content ? d.content : 'No preview available');
                        }}
                      >
                        View
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {
                          downloadTextFile(d.name.endsWith('.txt') ? d.name : `${d.name}.txt`, d.content ?? d.name);
                          toast.success('Download started');
                        }}
                      >
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
                {(selectedProject.documents ?? []).length === 0 && (
                  <div className="p-6 text-center text-sm text-gray-500">No documents yet</div>
                )}
              </div>
            </div>
          )}

          {activeDetailsTab === 'Timeline' && (
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Title</label>
                  <Input value={timelineForm.title} onChange={(e) => setTimelineForm({ ...timelineForm, title: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Date</label>
                  <Input type="text" placeholder="e.g. 05 Feb 2026" value={timelineForm.date} onChange={(e) => setTimelineForm({ ...timelineForm, date: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <select
                    className="w-full mt-1 px-3 py-2 border rounded-lg"
                    value={timelineForm.status}
                    onChange={(e) => setTimelineForm({ ...timelineForm, status: e.target.value as any })}
                  >
                    <option value="Planned">Planned</option>
                    <option value="Done">Done</option>
                    <option value="Blocked">Blocked</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => {
                    const title = timelineForm.title.trim();
                    const date = timelineForm.date.trim();
                    if (!title || !date) {
                      toast.error('Enter title and date');
                      return;
                    }

                    const next = {
                      id: `TL-${Date.now()}`,
                      title,
                      date,
                      status: timelineForm.status,
                    };
                    const nextTimeline = [...(selectedProject.timeline ?? []), next];
                    updateProject(selectedProject.id, { timeline: nextTimeline });
                    setTimelineForm({ title: '', date: '', status: 'Planned' });
                    toast.success('Timeline event added');
                  }}
                >
                  Add Event
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    toast.success('Timeline refreshed');
                  }}
                >
                  Refresh
                </Button>
              </div>

              <div className="space-y-2">
                {(selectedProject.timeline ?? []).map((t) => (
                  <div key={t.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{t.title}</p>
                      <p className="text-xs text-gray-500">{t.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={
                          t.status === 'Done'
                            ? 'bg-green-100 text-green-700'
                            : t.status === 'Blocked'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-blue-100 text-blue-700'
                        }
                      >
                        {t.status}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const nextStatus = t.status === 'Planned' ? 'Done' : t.status === 'Done' ? 'Blocked' : 'Planned';
                          updateProject(selectedProject.id, {
                            timeline: (selectedProject.timeline ?? []).map((x) => (x.id === t.id ? { ...x, status: nextStatus } : x)),
                          });
                          toast.success('Timeline updated');
                        }}
                      >
                        Toggle
                      </Button>
                    </div>
                  </div>
                ))}
                {(selectedProject.timeline ?? []).length === 0 && (
                  <div className="p-6 text-center text-sm text-gray-500">No timeline events yet</div>
                )}
              </div>
            </div>
          )}

          {activeDetailsTab === 'Team' && (
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Name</label>
                  <Input value={teamForm.name} onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Role</label>
                  <Input value={teamForm.role} onChange={(e) => setTeamForm({ ...teamForm, role: e.target.value })} />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => {
                    const name = teamForm.name.trim();
                    const role = teamForm.role.trim();
                    if (!name || !role) {
                      toast.error('Enter name and role');
                      return;
                    }
                    const next = { id: `TM-${Date.now()}`, name, role };
                    updateProject(selectedProject.id, { team: [...(selectedProject.team ?? []), next] });
                    setTeamForm({ name: '', role: '' });
                    toast.success('Team member added');
                  }}
                >
                  Add Member
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    updateProject(selectedProject.id, {
                      team: [{ id: 'TM-1', name: selectedProject.projectManager, role: 'Project Manager' }],
                    });
                    toast.success('Team reset');
                  }}
                >
                  Reset
                </Button>
              </div>

              <div className="space-y-2">
                {(selectedProject.team ?? []).map((m) => (
                  <div key={m.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{m.name}</p>
                      <p className="text-xs text-gray-500">{m.role}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        updateProject(selectedProject.id, { team: (selectedProject.team ?? []).filter((x) => x.id !== m.id) });
                        toast.success('Removed');
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                {(selectedProject.team ?? []).length === 0 && (
                  <div className="p-6 text-center text-sm text-gray-500">No team members yet</div>
                )}
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-500">In Survey</p>
          <p className="text-2xl font-semibold text-gray-900">{totals.inSurvey}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">In Production</p>
          <p className="text-2xl font-semibold text-orange-600">{totals.inProduction}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">In Installation</p>
          <p className="text-2xl font-semibold text-blue-600">{totals.inInstallation}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Commissioned</p>
          <p className="text-2xl font-semibold text-green-600">{totals.completed}</p>
        </Card>
      </div>
    </div>
  );
}
