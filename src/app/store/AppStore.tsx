import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types
export type ModuleName =
  | 'Dashboard'
  | 'Leads & CRM'
  | 'Survey & Design'
  | 'Quotations'
  | 'Projects'
  | 'Inventory'
  | 'Production'
  | 'Quality Control'
  | 'Logistics'
  | 'Installation'
  | 'Finance'
  | 'Monitoring'
  | 'Service & O&M'
  | 'Community'
  | 'Employees'
  | 'Compliance'
  | 'Reports'
  | 'Settings';

export interface BaseEntity {
  id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer extends BaseEntity {
  name: string;
  mobile?: string;
  email?: string;
  location?: string;
}

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
  documents?: { id: string; name: string; content?: string; uploadedAt: string }[];
  timeline?: { id: string; title: string; date: string; status: 'Planned' | 'Done' | 'Blocked' }[];
  team?: { id: string; name: string; role: string }[];
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

export interface PurchaseOrder extends BaseEntity {
  itemId: string;
  itemName: string;
  quantity: number;
  unit: string;
  supplier: string;
  expectedDate: string;
  status: 'Open' | 'Ordered' | 'Received' | 'Cancelled';
}

export interface ProductionLineStage {
  id: number;
  name: string;
  batches: number;
  capacity: string;
  delay: number;
  machine: string;
  shift: 'Day' | 'Night';
  status: 'on-track' | 'delayed' | 'bottleneck' | 'completed';
  workers: number;
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
  documentName?: string;
  documentContent?: string;
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

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  method: string;
  status: 'Pending' | 'Completed' | 'Failed';
  createdAt: string;
  updatedAt: string;
}

export interface QualityRecord {
  id: string;
  productionOrderId?: string;
  projectId?: string;
  batchId?: string;
  status: 'Pass' | 'Fail' | 'Hold';
  remarks: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReportRecord {
  id: string;
  title: string;
  status: 'Generated' | 'Draft';
  createdAt: string;
  updatedAt: string;
}

export interface AppSettings {
  companyName: string;
  currency: string;
  timezone: string;
  defaultMargin: number;
  gstRate: number;
  monitoringLive?: boolean;
}

interface AppState {
  currentModule: ModuleName;
  customers: Customer[];
  leads: Lead[];
  surveys: Survey[];
  quotations: Quotation[];
  projects: Project[];
  inventory: InventoryItem[];
  purchaseOrders: PurchaseOrder[];
  productionOrders: ProductionOrder[];
  productionLineStages: ProductionLineStage[];
  qualityRecords: QualityRecord[];
  logistics: LogisticsOrder[];
  installations: Installation[];
  invoices: Invoice[];
  payments: Payment[];
  serviceTickets: ServiceTicket[];
  employees: Employee[];
  complianceRecords: ComplianceRecord[];
  communityPosts: CommunityPost[];
  reports: ReportRecord[];
  settings: AppSettings;
}

interface AppContextType extends AppState {
  setCurrentModule: (module: ModuleName) => void;
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;

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
  addPurchaseOrder: (po: Omit<PurchaseOrder, 'id' | 'createdAt' | 'updatedAt' | 'status'> & { status?: PurchaseOrder['status'] }) => void;
  receivePurchaseOrder: (id: string) => void;
  
  addProductionOrder: (order: Omit<ProductionOrder, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProductionOrder: (id: string, updates: Partial<ProductionOrder>) => void;

  updateProductionLineStage: (id: number, updates: Partial<ProductionLineStage>) => void;
  reassignWorkers: (fromStageId: number, toStageId: number, count: number) => void;
  startProductionBatch: (projectId: string, capacity: string) => void;

  addQualityRecord: (record: Omit<QualityRecord, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateQualityRecord: (id: string, updates: Partial<QualityRecord>) => void;
  deleteQualityRecord: (id: string) => void;
  
  addLogistics: (logistics: Omit<LogisticsOrder, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateLogistics: (id: string, updates: Partial<LogisticsOrder>) => void;
  
  addInstallation: (installation: Omit<Installation, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateInstallation: (id: string, updates: Partial<Installation>) => void;
  
  addInvoice: (invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;

  addPayment: (payment: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>) => void;
  
  addServiceTicket: (ticket: Omit<ServiceTicket, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateServiceTicket: (id: string, updates: Partial<ServiceTicket>) => void;
  
  addEmployee: (employee: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  
  addCompliance: (record: Omit<ComplianceRecord, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCompliance: (id: string, updates: Partial<ComplianceRecord>) => void;
  
  addCommunityPost: (post: Omit<CommunityPost, 'id' | 'createdAt' | 'updatedAt'>) => void;
  
  addReport: (report: Omit<ReportRecord, 'id' | 'createdAt' | 'updatedAt'>) => void;

  updateSettings: (updates: Partial<AppSettings>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'solar_os_data';

const initialState: AppState = {
  currentModule: 'Dashboard',
  customers: [],
  leads: [
    {
      id: 'LD-001',
      name: 'Rajesh Kumar',
      mobile: '+91 98765 43210',
      email: 'rajesh@example.com',
      source: 'WhatsApp',
      location: 'Ahmedabad, Gujarat',
      capacity: '15 KW',
      status: 'New',
      aiScore: 92,
      electricityBill: '₹8,500/mo',
      assignedTo: 'Sales Rep 1',
      createdAt: '2 hours ago',
      updatedAt: '2 hours ago',
    },
    {
      id: 'LD-002',
      name: 'Priya Patel',
      mobile: '+91 98765 43211',
      email: 'priya@example.com',
      source: 'Instagram',
      location: 'Surat, Gujarat',
      capacity: '25 KW',
      status: 'Contacted',
      aiScore: 85,
      electricityBill: '₹12,000/mo',
      assignedTo: 'Sales Rep 2',
      createdAt: '5 hours ago',
      updatedAt: '5 hours ago',
    },
    {
      id: 'LD-003',
      name: 'Amit Shah',
      mobile: '+91 98765 43212',
      email: 'amit@example.com',
      source: 'Facebook',
      location: 'Rajkot, Gujarat',
      capacity: '10 KW',
      status: 'Survey Scheduled',
      aiScore: 78,
      electricityBill: '₹6,500/mo',
      assignedTo: 'Sales Rep 1',
      createdAt: '1 day ago',
      updatedAt: '1 day ago',
    },
    {
      id: 'LD-004',
      name: 'Neha Sharma',
      mobile: '+91 98765 43213',
      email: 'neha@example.com',
      source: 'Website',
      location: 'Vadodara, Gujarat',
      capacity: '20 KW',
      status: 'Qualified',
      aiScore: 95,
      electricityBill: '₹10,500/mo',
      assignedTo: 'Sales Rep 3',
      createdAt: '2 days ago',
      updatedAt: '2 days ago',
    },
  ],
  surveys: [
    {
      id: 'SUR-2401',
      leadId: 'LD-003',
      projectId: undefined,
      roofArea: '450',
      shadowPercentage: 15,
      direction: 'South',
      roofType: 'Flat',
      photos: [],
      gpsLocation: '23.0225° N, 72.5714° E',
      status: 'In Progress',
      createdAt: 'Today',
      updatedAt: 'Today',
    },
  ],
  quotations: [
    {
      id: 'QUO-2402',
      leadId: 'LD-004',
      customer: 'Neha Sharma',
      capacity: '20 KW',
      perWattPrice: 27.8,
      totalAmount: 556000,
      status: 'Sent',
      createdAt: '5 days ago',
      updatedAt: '5 days ago',
    },
    {
      id: 'QUO-2403',
      leadId: 'LD-003',
      customer: 'Amit Shah',
      capacity: '10 KW',
      perWattPrice: 29.0,
      totalAmount: 290000,
      status: 'Approved',
      createdAt: '3 days ago',
      updatedAt: '1 day ago',
    },
  ],
  projects: [
    {
      id: 'PRJ-2401',
      quotationId: 'QUO-2403',
      customer: 'Amit Shah',
      capacity: '10 KW',
      location: 'Rajkot, Gujarat',
      status: 'Production',
      progress: 45,
      startDate: '20 Jan 2026',
      expectedCompletion: '15 Feb 2026',
      projectManager: 'Auto Assigned',
      totalValue: 290000,
      documents: [],
      timeline: [
        { id: 'TL-1', title: 'Survey Completed', date: '21 Jan 2026', status: 'Done' },
        { id: 'TL-2', title: 'Design Approved', date: '23 Jan 2026', status: 'Done' },
        { id: 'TL-3', title: 'Production Start', date: '25 Jan 2026', status: 'Done' },
        { id: 'TL-4', title: 'QC & Dispatch', date: '05 Feb 2026', status: 'Planned' },
      ],
      team: [
        { id: 'TM-1', name: 'Auto Assigned', role: 'Project Manager' },
        { id: 'TM-2', name: 'Not Assigned', role: 'Site Engineer' },
      ],
      createdAt: '3 days ago',
      updatedAt: 'Today',
    },
  ],
  inventory: [
    { id: 'INV-001', name: 'Solar Cells', unit: 'Units', totalStock: 1200, reserved: 950, available: 250, minStock: 500, status: 'critical', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'INV-002', name: 'Tempered Glass', unit: 'Sheets', totalStock: 850, reserved: 400, available: 450, minStock: 300, status: 'good', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  ],
  purchaseOrders: [],
  productionOrders: [
    {
      id: 'BATCH-2401',
      projectId: 'PRJ-2401',
      batchId: 'BATCH-2401',
      capacity: '10 KW',
      stage: 'Stringing',
      status: 'In Progress',
      progress: 45,
      createdAt: 'Today',
      updatedAt: 'Today',
    },
  ],
  productionLineStages: [
    {
      id: 1,
      name: 'Glass Cleaning',
      batches: 8,
      capacity: '40 KW',
      delay: 0,
      machine: 'GC-01',
      shift: 'Day',
      status: 'on-track',
      workers: 2,
      updatedAt: new Date().toISOString(),
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
      workers: 3,
      updatedAt: new Date().toISOString(),
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
      workers: 2,
      updatedAt: new Date().toISOString(),
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
      workers: 4,
      updatedAt: new Date().toISOString(),
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
      workers: 3,
      updatedAt: new Date().toISOString(),
    },
  ],
  qualityRecords: [],
  logistics: [],
  installations: [],
  invoices: [
    {
      id: 'INV-2401',
      projectId: 'PRJ-2401',
      amount: 120000,
      status: 'Sent',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      paidAmount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  payments: [],
  serviceTickets: [
    {
      id: 'TKT-1248',
      projectId: 'PRJ-2401',
      customer: 'Amit Shah',
      issue: 'Low Generation Output',
      priority: 'Medium',
      status: 'Open',
      assignedTo: 'Not Assigned',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  employees: [],
  complianceRecords: [],
  communityPosts: [],
  reports: [],
  settings: {
    companyName: 'Solar OS',
    currency: 'INR',
    timezone: 'Asia/Kolkata',
    defaultMargin: 12,
    gstRate: 18,
    monitoringLive: true,
  },
};

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return initialState;

    try {
      const parsed = JSON.parse(saved) as Partial<AppState>;
      return {
        ...initialState,
        ...parsed,
        customers: parsed.customers ?? initialState.customers,
        leads: parsed.leads ?? initialState.leads,
        surveys: parsed.surveys ?? initialState.surveys,
        quotations: parsed.quotations ?? initialState.quotations,
        projects: parsed.projects ?? initialState.projects,
        inventory: parsed.inventory ?? initialState.inventory,
        purchaseOrders: parsed.purchaseOrders ?? initialState.purchaseOrders,
        productionOrders: parsed.productionOrders ?? initialState.productionOrders,
        productionLineStages: parsed.productionLineStages ?? initialState.productionLineStages,
        qualityRecords: parsed.qualityRecords ?? initialState.qualityRecords,
        logistics: parsed.logistics ?? initialState.logistics,
        installations: parsed.installations ?? initialState.installations,
        invoices: parsed.invoices ?? initialState.invoices,
        payments: parsed.payments ?? initialState.payments,
        serviceTickets: parsed.serviceTickets ?? initialState.serviceTickets,
        employees: parsed.employees ?? initialState.employees,
        complianceRecords: parsed.complianceRecords ?? initialState.complianceRecords,
        communityPosts: parsed.communityPosts ?? initialState.communityPosts,
        reports: parsed.reports ?? initialState.reports,
        settings: { ...initialState.settings, ...(parsed.settings ?? {}) },
      };
    } catch {
      return initialState;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const generateId = (prefix: string) => {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const updateProductionLineStage = (id: number, updates: Partial<ProductionLineStage>) => {
    setState((prev) => ({
      ...prev,
      productionLineStages: prev.productionLineStages.map((s) =>
        s.id === id ? { ...s, ...updates, updatedAt: new Date().toISOString() } : s,
      ),
    }));
  };

  const reassignWorkers = (fromStageId: number, toStageId: number, count: number) => {
    setState((prev) => {
      const from = prev.productionLineStages.find((s) => s.id === fromStageId);
      const to = prev.productionLineStages.find((s) => s.id === toStageId);
      if (!from || !to) return prev;

      const move = Math.max(0, Math.min(count, from.workers));
      return {
        ...prev,
        productionLineStages: prev.productionLineStages.map((s) => {
          if (s.id === fromStageId) return { ...s, workers: s.workers - move, updatedAt: new Date().toISOString() };
          if (s.id === toStageId) {
            const delay = Math.max(0, s.delay - move * 10);
            const status: ProductionLineStage['status'] = delay >= 30 ? 'bottleneck' : delay > 0 ? 'delayed' : 'on-track';
            return { ...s, workers: s.workers + move, delay, status, updatedAt: new Date().toISOString() };
          }
          return s;
        }),
      };
    });
  };

  const startProductionBatch = (projectId: string, capacity: string) => {
    const batchId = generateId('BATCH');
    setState((prev) => ({
      ...prev,
      productionOrders: [
        ...prev.productionOrders,
        {
          id: batchId,
          projectId,
          batchId,
          capacity,
          stage: 'Glass Cleaning',
          status: 'In Progress',
          progress: 5,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      productionLineStages: prev.productionLineStages.map((s) =>
        s.id === 1 ? { ...s, batches: s.batches + 1, updatedAt: new Date().toISOString() } : s,
      ),
    }));
  };

  const setCurrentModule = (module: ModuleName) => {
    setState((prev) => ({ ...prev, currentModule: module }));
  };

  const addCustomer = (customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCustomer: Customer = {
      ...customer,
      id: generateId('CUS'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setState((prev) => ({ ...prev, customers: [...prev.customers, newCustomer] }));
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setState((prev) => ({
      ...prev,
      customers: prev.customers.map((c) =>
        c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c,
      ),
    }));
  };

  const addLead = (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newLead: Lead = {
      ...lead,
      id: generateId('LD'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setState((prev) => ({ ...prev, leads: [...prev.leads, newLead] }));
  };

  const updateLead = (id: string, updates: Partial<Lead>) => {
    setState((prev) => ({
      ...prev,
      leads: prev.leads.map((l) =>
        l.id === id ? { ...l, ...updates, updatedAt: new Date().toISOString() } : l,
      ),
    }));
  };

  const deleteLead = (id: string) => {
    setState((prev) => ({ ...prev, leads: prev.leads.filter((l) => l.id !== id) }));
  };

  const addSurvey = (survey: Omit<Survey, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newSurvey: Survey = {
      ...survey,
      id: generateId('SUR'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setState((prev) => ({ ...prev, surveys: [...prev.surveys, newSurvey] }));
  };

  const updateSurvey = (id: string, updates: Partial<Survey>) => {
    setState((prev) => ({
      ...prev,
      surveys: prev.surveys.map((s) =>
        s.id === id ? { ...s, ...updates, updatedAt: new Date().toISOString() } : s,
      ),
    }));
  };

  const addQuotation = (quotation: Omit<Quotation, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newQuotation: Quotation = {
      ...quotation,
      id: generateId('QUO'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setState((prev) => ({ ...prev, quotations: [...prev.quotations, newQuotation] }));
  };

  const updateQuotation = (id: string, updates: Partial<Quotation>) => {
    setState((prev) => ({
      ...prev,
      quotations: prev.quotations.map((q) =>
        q.id === id ? { ...q, ...updates, updatedAt: new Date().toISOString() } : q,
      ),
    }));
  };

  const approveQuotation = (id: string) => {
    const quotation = state.quotations.find((q) => q.id === id);
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
    setState((prev) => ({ ...prev, projects: [...prev.projects, newProject] }));
  };

  const addProject = (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProject: Project = {
      ...project,
      id: generateId('PRJ'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setState((prev) => ({ ...prev, projects: [...prev.projects, newProject] }));
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setState((prev) => ({
      ...prev,
      projects: prev.projects.map((p) =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p,
      ),
    }));
  };

  const updateInventory = (id: string, updates: Partial<InventoryItem>) => {
    setState((prev) => ({
      ...prev,
      inventory: prev.inventory.map((i) =>
        i.id === id ? { ...i, ...updates, updatedAt: new Date().toISOString() } : i,
      ),
    }));
  };

  const addPurchaseOrder: AppContextType['addPurchaseOrder'] = (po) => {
    const newPo: PurchaseOrder = {
      ...po,
      id: generateId('PO'),
      status: po.status ?? 'Open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setState((prev) => ({ ...prev, purchaseOrders: [...prev.purchaseOrders, newPo] }));
  };

  const receivePurchaseOrder = (id: string) => {
    const po = state.purchaseOrders.find((p) => p.id === id);
    if (!po) return;

    setState((prev) => {
      const inv = prev.inventory.find((i) => i.id === po.itemId);
      const updatedInventory = inv
        ? prev.inventory.map((i) => {
            if (i.id !== po.itemId) return i;
            const totalStock = i.totalStock + po.quantity;
            const available = Math.max(0, totalStock - i.reserved);
            const status: InventoryItem['status'] =
              available < i.minStock ? (available < i.minStock * 0.5 ? 'critical' : 'warning') : 'good';
            return { ...i, totalStock, available, status, updatedAt: new Date().toISOString() };
          })
        : prev.inventory;

      return {
        ...prev,
        inventory: updatedInventory,
        purchaseOrders: prev.purchaseOrders.map((p) =>
          p.id === id ? { ...p, status: 'Received', updatedAt: new Date().toISOString() } : p,
        ),
      };
    });
  };

  const addProductionOrder = (order: Omit<ProductionOrder, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newOrder: ProductionOrder = {
      ...order,
      id: generateId('BATCH'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setState((prev) => ({ ...prev, productionOrders: [...prev.productionOrders, newOrder] }));
  };

  const updateProductionOrder = (id: string, updates: Partial<ProductionOrder>) => {
    setState((prev) => ({
      ...prev,
      productionOrders: prev.productionOrders.map((o) =>
        o.id === id ? { ...o, ...updates, updatedAt: new Date().toISOString() } : o,
      ),
    }));
  };

  const addQualityRecord = (record: Omit<QualityRecord, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newRecord: QualityRecord = {
      ...record,
      id: generateId('QC'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setState((prev) => ({ ...prev, qualityRecords: [...prev.qualityRecords, newRecord] }));
  };

  const updateQualityRecord = (id: string, updates: Partial<QualityRecord>) => {
    setState((prev) => ({
      ...prev,
      qualityRecords: prev.qualityRecords.map((r) =>
        r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r,
      ),
    }));
  };

  const deleteQualityRecord = (id: string) => {
    setState((prev) => ({ ...prev, qualityRecords: prev.qualityRecords.filter((r) => r.id !== id) }));
  };

  const addLogistics = (logistics: Omit<LogisticsOrder, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newLogistics: LogisticsOrder = {
      ...logistics,
      id: generateId('LOG'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setState((prev) => ({ ...prev, logistics: [...prev.logistics, newLogistics] }));
  };

  const updateLogistics = (id: string, updates: Partial<LogisticsOrder>) => {
    setState((prev) => ({
      ...prev,
      logistics: prev.logistics.map((l) =>
        l.id === id ? { ...l, ...updates, updatedAt: new Date().toISOString() } : l,
      ),
    }));
  };

  const addInstallation = (installation: Omit<Installation, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newInstallation: Installation = {
      ...installation,
      id: generateId('INST'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setState((prev) => ({ ...prev, installations: [...prev.installations, newInstallation] }));
  };

  const updateInstallation = (id: string, updates: Partial<Installation>) => {
    setState((prev) => ({
      ...prev,
      installations: prev.installations.map((i) =>
        i.id === id ? { ...i, ...updates, updatedAt: new Date().toISOString() } : i,
      ),
    }));
  };

  const addInvoice = (invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newInvoice: Invoice = {
      ...invoice,
      id: generateId('INV'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setState((prev) => ({ ...prev, invoices: [...prev.invoices, newInvoice] }));
  };

  const updateInvoice = (id: string, updates: Partial<Invoice>) => {
    setState((prev) => ({
      ...prev,
      invoices: prev.invoices.map((i) =>
        i.id === id ? { ...i, ...updates, updatedAt: new Date().toISOString() } : i,
      ),
    }));
  };

  const addPayment = (payment: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPayment: Payment = {
      ...payment,
      id: generateId('PAY'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setState((prev) => ({ ...prev, payments: [...prev.payments, newPayment] }));
  };

  const addServiceTicket = (ticket: Omit<ServiceTicket, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTicket: ServiceTicket = {
      ...ticket,
      id: generateId('TKT'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setState((prev) => ({ ...prev, serviceTickets: [...prev.serviceTickets, newTicket] }));
  };

  const updateServiceTicket = (id: string, updates: Partial<ServiceTicket>) => {
    setState((prev) => ({
      ...prev,
      serviceTickets: prev.serviceTickets.map((t) =>
        t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t,
      ),
    }));
  };

  const addEmployee = (employee: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newEmployee: Employee = {
      ...employee,
      id: generateId('EMP'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setState((prev) => ({ ...prev, employees: [...prev.employees, newEmployee] }));
  };

  const updateEmployee = (id: string, updates: Partial<Employee>) => {
    setState((prev) => ({
      ...prev,
      employees: prev.employees.map((e) =>
        e.id === id ? { ...e, ...updates, updatedAt: new Date().toISOString() } : e,
      ),
    }));
  };

  const deleteEmployee = (id: string) => {
    setState((prev) => ({ ...prev, employees: prev.employees.filter((e) => e.id !== id) }));
  };

  const addCompliance = (record: Omit<ComplianceRecord, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newRecord: ComplianceRecord = {
      ...record,
      id: generateId('COMP'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setState((prev) => ({ ...prev, complianceRecords: [...prev.complianceRecords, newRecord] }));
  };

  const updateCompliance = (id: string, updates: Partial<ComplianceRecord>) => {
    setState((prev) => ({
      ...prev,
      complianceRecords: prev.complianceRecords.map((c) =>
        c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c,
      ),
    }));
  };

  const addCommunityPost = (post: Omit<CommunityPost, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPost: CommunityPost = {
      ...post,
      id: generateId('POST'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setState((prev) => ({ ...prev, communityPosts: [...prev.communityPosts, newPost] }));
  };

  const addReport = (report: Omit<ReportRecord, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newReport: ReportRecord = {
      ...report,
      id: generateId('RPT'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setState((prev) => ({ ...prev, reports: [...prev.reports, newReport] }));
  };

  const updateSettings = (updates: Partial<AppSettings>) => {
    setState((prev) => ({ ...prev, settings: { ...prev.settings, ...updates } }));
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        setCurrentModule,
        addCustomer,
        updateCustomer,
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
        addPurchaseOrder,
        receivePurchaseOrder,
        addProductionOrder,
        updateProductionOrder,
        updateProductionLineStage,
        reassignWorkers,
        startProductionBatch,
        addQualityRecord,
        updateQualityRecord,
        deleteQualityRecord,
        addLogistics,
        updateLogistics,
        addInstallation,
        updateInstallation,
        addInvoice,
        updateInvoice,
        addPayment,
        addServiceTicket,
        updateServiceTicket,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        addCompliance,
        updateCompliance,
        addCommunityPost,
        addReport,
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
