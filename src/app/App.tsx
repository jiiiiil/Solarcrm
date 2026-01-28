import { SolarDashboard } from '@/app/components/SolarDashboard';
import { AppStoreProvider } from '@/app/store/AppStore';
import { Toaster } from '@/app/components/ui/sonner';

export default function App() {
  return (
    <AppStoreProvider>
      <SolarDashboard />
      <Toaster />
    </AppStoreProvider>
  );
}