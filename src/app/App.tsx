import { DashboardHome, SolarDashboard } from '@/app/components/SolarDashboard';
import { AppStoreProvider, useAppStore } from '@/app/store/AppStore';
import { Toaster } from '@/app/components/ui/sonner';

import { LeadsCRM } from '@/app/components/screens/LeadsCRM';
import { SurveyScreen } from '@/app/components/screens/SurveyScreen';
import { QuotationScreen } from '@/app/components/screens/QuotationScreen';
import { ProjectsScreen } from '@/app/components/screens/ProjectsScreen';
import { InventoryScreen } from '@/app/components/screens/InventoryScreen';
import { ProductionTracker } from '@/app/components/screens/ProductionTracker';
import { QualityControlScreen } from '@/app/components/screens/QualityControlScreen';
import { LogisticsScreen } from '@/app/components/screens/LogisticsScreen';
import { InstallationScreen } from '@/app/components/screens/InstallationScreen';
import { FinanceScreen } from '@/app/components/screens/FinanceScreen';
import { MonitoringScreen } from '@/app/components/screens/MonitoringScreen';
import { ServiceScreen } from '@/app/components/screens/ServiceScreen';
import { CommunityScreen } from '@/app/components/screens/CommunityScreen';
import { EmployeeScreen } from '@/app/components/screens/EmployeeScreen';
import { ComplianceScreen } from '@/app/components/screens/ComplianceScreen';
import { ReportsScreen } from '@/app/components/screens/ReportsScreen';
import { SettingsScreen } from '@/app/components/screens/SettingsScreen';

function ScreenController() {
  const { currentModule } = useAppStore();

  switch (currentModule) {
    case 'Leads & CRM':
      return <LeadsCRM />;
    case 'Survey & Design':
      return <SurveyScreen />;
    case 'Quotations':
      return <QuotationScreen />;
    case 'Projects':
      return <ProjectsScreen />;
    case 'Inventory':
      return <InventoryScreen />;
    case 'Production':
      return <ProductionTracker />;
    case 'Quality Control':
      return <QualityControlScreen />;
    case 'Logistics':
      return <LogisticsScreen />;
    case 'Installation':
      return <InstallationScreen />;
    case 'Finance':
      return <FinanceScreen />;
    case 'Monitoring':
      return <MonitoringScreen />;
    case 'Service & O&M':
      return <ServiceScreen />;
    case 'Community':
      return <CommunityScreen />;
    case 'Employees':
      return <EmployeeScreen />;
    case 'Compliance':
      return <ComplianceScreen />;
    case 'Reports':
      return <ReportsScreen />;
    case 'Settings':
      return <SettingsScreen />;
    case 'Dashboard':
    default:
      return <DashboardHome />;
  }
}

export default function App() {
  return (
    <AppStoreProvider>
      <SolarDashboard>
        <ScreenController />
      </SolarDashboard>
      <Toaster />
    </AppStoreProvider>
  );
}