import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types
export interface Lead {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  source: string;
  location: string;
  capacity: string;
  status: 'New' | 'Contacted' | 'Survey Scheduled' | 'Qualified' | 'Lost';
  aiScore: number;
  electricityBill: string;
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
}

export interface Survey {
  id: string;
  leadId: string;
  projectId?: string;
  roofArea: string;
  shadowPercentage: number;
  direction: string;
  roofType: string;
  photos: string[];
  gpsLocation: string;
  status: 'Planned' | 'In Progress' | 'Completed';
  createdAt: string;
  updatedAt: string;
}

export interface Quotation {
  id: string;
  leadId: string;
  customer: string;
  capacity: string;
  perWattPrice: number;
  totalAmount: number;
  status: 'Draft' | 'Sent' | 'Approved' | 'Rejected';
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  quotationId: string;
  customer: string;
  capacity: string;
  location: string;
  status: 'Survey' | 'Design' | 'Production' | 'Logistics' | 'Installation' | 'Commissioning' | 'Completed';
  progress: number;
  startDate: string;
  expectedCompletion: string;
  projectManager: string;
  totalValue: number;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  unit: string;
  totalStock: number;
  reserved: number;
  available: number;
  minStock: number;
  status: 'good' | 'warning' | 'critical';
  createdAt: string;
  updatedAt: string;
}

export interface ProductionOrder {
  id: string;
  projectId: string;
  batchId: string;
  capacity: string;
  stage: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  progress: number;
  createdAt: string;
  updatedAt: string;
}

export interface LogisticsOrder {
  id: string;
  projectId: string;
  fromLocation: string;
  toLocation: string;
  transporter: string;
  vehicleNumber: string;
  dispatchDate: string;
  expectedDelivery: string;
  status: 'Planned' | 'Dispatched' | 'In Transit' | 'Delivered';
  createdAt: string;
  updatedAt: string;
}

export interface Installation {
  id: string;
  projectId: string;
  technician: string;
  startDate: string;
  endDate?: string;
  status: 'Scheduled' | 'In Progress' | 'Completed';
  progress: number;
  tasks: { name: string; completed: boolean }[];
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: string;
  projectId: string;
  amount: number;
  status: 'Draft' | 'Sent' | 'Paid' | 'Partial' | 'Overdue';
  dueDate: string;
  paidAmount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceTicket {
  id: string;
  projectId: string;
  customer: string;
  issue: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
  updatedAt: string;
}

export interface ComplianceRecord {
  id: string;
  title: string;
  category: string;
  certificateNumber: string;
  issueDate: string;
  expiryDate: string;
  status: 'Valid' | 'Expiring Soon' | 'Expired';
  createdAt: string;
  updatedAt: string;
}

export interface CommunityPost {
  id: string;
  author: string;
  title: string;
  content: string;
  category: string;
  likes: number;
  comments: number;
  createdAt: string;
  updatedAt: string;
}

export interface AppSettings {
  companyName: string;
  currency: string;
  timezone: string;
  defaultMargin: number;
  gstRate: number;
}

interface AppState {
  leads: Lead[];
  surveys: Survey[];
  quotations: Quotation[];
  projects: Project[];
  inventory: InventoryItem[];
  productionOrders: ProductionOrder[];
  logistics: LogisticsOrder[];
  installations: Installation[];
  invoices: Invoice[];
  serviceTickets: ServiceTicket[];
  employees: Employee[];
  complianceRecords: ComplianceRecord[];
  communityPosts: CommunityPost[];
  settings: AppSettings;
}

interface AppContextType extends AppState {
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  
  addSurvey: (survey: Omit<Survey, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSurvey: (id: string, updates: Partial<Survey>) => void;
  
  addQuotation: (quotation: Omit<Quotation, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateQuotation: (id: string, updates: Partial<Quotation>) => void;
  approveQuotation: (id: string) => void;
  
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  
  updateInventory: (id: string, updates: Partial<InventoryItem>) => void;
  
  addProductionOrder: (order: Omit<ProductionOrder, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProductionOrder: (id: string, updates: Partial<ProductionOrder>) => void;
  
  addLogistics: (logistics: Omit<LogisticsOrder, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateLogistics: (id: string, updates: Partial<LogisticsOrder>) => void;
  
  addInstallation: (installation: Omit<Installation, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateInstallation: (id: string, updates: Partial<Installation>) => void;
  
  addInvoice: (invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
  
  addServiceTicket: (ticket: Omit<ServiceTicket, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateServiceTicket: (id: string, updates: Partial<ServiceTicket>) => void;
  
  addEmployee: (employee: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  
  addCompliance: (record: Omit<ComplianceRecord, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCompliance: (id: string, updates: Partial<ComplianceRecord>) => void;
  
  addCommunityPost: (post: Omit<CommunityPost, 'id' | 'createdAt' | 'updatedAt'>) => void;
  
  updateSettings: (updates: Partial<AppSettings>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'solar_os_data';

const initialState: AppState = {
  leads: [],
  surveys: [],
  quotations: [],
  projects: [],
  inventory: [
    { id: 'INV-001', name: 'Solar Cells', unit: 'Units', totalStock: 1200, reserved: 950, available: 250, minStock: 500, status: 'critical', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'INV-002', name: 'Tempered Glass', unit: 'Sheets', totalStock: 850, reserved: 400, available: 450, minStock: 300, status: 'good', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  ],
  productionOrders: [],
  logistics: [],
  installations: [],
  invoices: [],
  serviceTickets: [],
  employees: [],
  complianceRecords: [],
  communityPosts: [],
  settings: {
    companyName: 'Solar OS',
    currency: 'INR',
    timezone: 'Asia/Kolkata',
    defaultMargin: 12,
    gstRate: 18,
  },
};

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialState;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const generateId = (prefix: string) => {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const addLead = (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newLead: Lead = {
      ...lead,
      id: generateId('LD'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setState(prev => ({ ...prev, leads: [...prev.leads, newLead] }));
  };

  const updateLead = (id: string, updates: Partial<Lead>) => {
    setState(prev => ({
      ...prev,
      leads: prev.leads.map(l => l.id === id ? { ...l, ...updates, updatedAt: new Date().toISOString() } : l),
    }));
  };

  const deleteLead = (id: string) => {
    setState(prev => ({ ...prev, leads: prev.leads.filter(l => l.id !== id) }));
  };

  const addSurvey = (survey: Omit<Survey, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newSurvey: Survey = {
      ...survey,
      id: generateId('SUR'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setState(prev => ({ ...prev, surveys: [...prev.surveys, newSurvey] }));
  };

  const updateSurvey = (id: string, updates: Partial<Survey>) => {
    setState(prev => ({
      ...prev,
      surveys: prev.surveys.map(s => s.id === id ? { ...s, ...updates, updatedAt: new Date().toISOString() } : s),
    }));
  };

  const addQuotation = (quotation: Omit<Quotation, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newQuotation: Quotation = {
      ...quotation,
      id: generateId('QUO'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setState(prev => ({ ...prev, quotations: [...prev.quotations, newQuotation] }));
  };

  const updateQuotation = (id: string, updates: Partial<Quotation>) => {
    setState(prev => ({
      ...prev,
      quotations: prev.quotations.map(q => q.id === id ? { ...q, ...updates, updatedAt: new Date().toISOString() } : q),
    }));
  };

  const approveQuotation = (id: string) => {
    const quotation = state.quotations.find(q => q.id === id);
    if (!quotation) return;

    updateQuotation(id, { status: 'Approved' });

    const newProject: Project = {
      id: generateId('PRJ'),
      quotationId: id,
      customer: quotation.customer,
      capacity: quotation.capacity,
      location: 'TBD',
      status: 'Survey',
      progress: 0,
      startDate: new Date().toISOString(),
      expectedCompletion: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      projectManager: 'Auto Assigned',
      totalValue: quotation.totalAmount,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setState(prev => ({ ...prev, projects: [...prev.projects, newProject] }));
  };

  const addProject = (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProject: Project = {
      ...project,
      id: generateId('PRJ'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setState(prev => ({ ...prev, projects: [...prev.projects, newProject] }));
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setState(prev => ({
      ...prev,
      projects: prev.projects.map(p => p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p),
    }));
  };

  const updateInventory = (id: string, updates: Partial<InventoryItem>) => {
    setState(prev => ({
      ...prev,
      inventory: prev.inventory.map(i => i.id === id ? { ...i, ...updates, updatedAt: new Date().toISOString() } : i),
    }));
  };

  const addProductionOrder = (order: Omit<ProductionOrder, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newOrder: ProductionOrder = {
      ...order,
      id: generateId('BATCH'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setState(prev => ({ ...prev, productionOrders: [...prev.productionOrders, newOrder] }));
  };

  const updateProductionOrder = (id: string, updates: Partial<ProductionOrder>) => {
    setState(prev => ({
      ...prev,
      productionOrders: prev.productionOrders.map(o => o.id === id ? { ...o, ...updates, updatedAt: new Date().toISOString() } : o),
    }));
  };

  const addLogistics = (logistics: Omit<LogisticsOrder, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newLogistics: LogisticsOrder = {
      ...logistics,
      id: generateId('LOG'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setState(prev => ({ ...prev, logistics: [...prev.logistics, newLogistics] }));
  };

  const updateLogistics = (id: string, updates: Partial<LogisticsOrder>) => {
    setState(prev => ({
      ...prev,
      logistics: prev.logistics.map(l => l.id === id ? { ...l, ...updates, updatedAt: new Date().toISOString() } : l),
    }));
  };

  const addInstallation = (installation: Omit<Installation, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newInstallation: Installation = {
      ...installation,
      id: generateId('INST'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setState(prev => ({ ...prev, installations: [...prev.installations, newInstallation] }));
  };

  const updateInstallation = (id: string, updates: Partial<Installation>) => {
    setState(prev => ({
      ...prev,
      installations: prev.installations.map(i => i.id === id ? { ...i, ...updates, updatedAt: new Date().toISOString() } : i),
    }));
  };

  const addInvoice = (invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newInvoice: Invoice = {
      ...invoice,
      id: generateId('INV'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setState(prev => ({ ...prev, invoices: [...prev.invoices, newInvoice] }));
  };

  const updateInvoice = (id: string, updates: Partial<Invoice>) => {
    setState(prev => ({
      ...prev,
      invoices: prev.invoices.map(i => i.id === id ? { ...i, ...updates, updatedAt: new Date().toISOString() } : i),
    }));
  };

  const addServiceTicket = (ticket: Omit<ServiceTicket, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTicket: ServiceTicket = {
      ...ticket,
      id: generateId('TKT'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setState(prev => ({ ...prev, serviceTickets: [...prev.serviceTickets, newTicket] }));
  };

  const updateServiceTicket = (id: string, updates: Partial<ServiceTicket>) => {
    setState(prev => ({
      ...prev,
      serviceTickets: prev.serviceTickets.map(t => t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t),
    }));
  };

  const addEmployee = (employee: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newEmployee: Employee = {
      ...employee,
      id: generateId('EMP'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setState(prev => ({ ...prev, employees: [...prev.employees, newEmployee] }));
  };

  const updateEmployee = (id: string, updates: Partial<Employee>) => {
    setState(prev => ({
      ...prev,
      employees: prev.employees.map(e => e.id === id ? { ...e, ...updates, updatedAt: new Date().toISOString() } : e),
    }));
  };

  const deleteEmployee = (id: string) => {
    setState(prev => ({ ...prev, employees: prev.employees.filter(e => e.id !== id) }));
  };

  const addCompliance = (record: Omit<ComplianceRecord, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newRecord: ComplianceRecord = {
      ...record,
      id: generateId('COMP'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setState(prev => ({ ...prev, complianceRecords: [...prev.complianceRecords, newRecord] }));
  };

  const updateCompliance = (id: string, updates: Partial<ComplianceRecord>) => {
    setState(prev => ({
      ...prev,
      complianceRecords: prev.complianceRecords.map(c => c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c),
    }));
  };

  const addCommunityPost = (post: Omit<CommunityPost, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPost: CommunityPost = {
      ...post,
      id: generateId('POST'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setState(prev => ({ ...prev, communityPosts: [...prev.communityPosts, newPost] }));
  };

  const updateSettings = (updates: Partial<AppSettings>) => {
    setState(prev => ({ ...prev, settings: { ...prev.settings, ...updates } }));
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        addLead,
        updateLead,
        deleteLead,
        addSurvey,
        updateSurvey,
        addQuotation,
        updateQuotation,
        approveQuotation,
        addProject,
        updateProject,
        updateInventory,
        addProductionOrder,
        updateProductionOrder,
        addLogistics,
        updateLogistics,
        addInstallation,
        updateInstallation,
        addInvoice,
        updateInvoice,
        addServiceTicket,
        updateServiceTicket,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        addCompliance,
        updateCompliance,
        addCommunityPost,
        updateSettings,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppStore must be used within AppStoreProvider');
  return context;
}
