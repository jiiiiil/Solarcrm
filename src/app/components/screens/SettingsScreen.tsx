import { useState } from 'react';
import { useAppStore } from '@/app/store/AppStore';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Settings, Save } from 'lucide-react';
import { toast } from 'sonner';

export function SettingsScreen() {
  const { settings, updateSettings } = useAppStore();
  const [formData, setFormData] = useState(settings);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    toast.success('Settings updated');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Settings</h2>
        <p className="text-sm text-gray-500 mt-1">Application configuration</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="p-6 space-y-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Company Information</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Company Name</label>
                <Input
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Currency</label>
                  <select
                    className="w-full mt-1 px-3 py-2 border rounded-lg"
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  >
                    <option>INR</option>
                    <option>USD</option>
                    <option>EUR</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Timezone</label>
                  <select
                    className="w-full mt-1 px-3 py-2 border rounded-lg"
                    value={formData.timezone}
                    onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                  >
                    <option>Asia/Kolkata</option>
                    <option>America/New_York</option>
                    <option>Europe/London</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold text-gray-900 mb-4">Pricing Configuration</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Default Margin (%)</label>
                <Input
                  type="number"
                  value={formData.defaultMargin}
                  onChange={(e) => setFormData({ ...formData, defaultMargin: parseFloat(e.target.value) })}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">GST Rate (%)</label>
                <Input
                  type="number"
                  value={formData.gstRate}
                  onChange={(e) => setFormData({ ...formData, gstRate: parseFloat(e.target.value) })}
                  required
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <Button type="submit" className="gap-2">
              <Save className="w-4 h-4" />
              Save Settings
            </Button>
          </div>
        </Card>
      </form>

      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Data Management</h3>
        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            Export All Data
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Import Data
          </Button>
          <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
            Clear All Data (Reset)
          </Button>
        </div>
      </Card>
    </div>
  );
}
