import { useState } from 'react';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Slider } from '@/app/components/ui/slider';
import { 
  Camera, 
  MapPin, 
  Upload, 
  Sparkles,
  CheckCircle2,
  Circle,
  Compass,
  Home,
  Gauge
} from 'lucide-react';
import { Progress } from '@/app/components/ui/progress';

const surveySteps = [
  { id: 1, label: 'Site Photos', completed: true },
  { id: 2, label: 'Measurements', completed: true },
  { id: 3, label: 'Shadow Analysis', completed: false },
  { id: 4, label: 'Review', completed: false },
];

export function SurveyScreen() {
  const [roofArea, setRoofArea] = useState('450');
  const [shadowPercentage, setShadowPercentage] = useState([15]);
  const [direction, setDirection] = useState('South');

  const progress = (surveySteps.filter(s => s.completed).length / surveySteps.length) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Site Survey</h2>
          <p className="text-sm text-gray-500 mt-1">Project: PRJ-2405 | Ramesh Industries</p>
        </div>
        <Badge className="bg-blue-100 text-blue-700">Survey In Progress</Badge>
      </div>

      {/* Progress Bar */}
      <Card className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-gray-900">Survey Progress</span>
            <span className="text-gray-500">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between">
            {surveySteps.map((step) => (
              <div key={step.id} className="flex items-center gap-2">
                {step.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-300" />
                )}
                <span className={`text-sm ${step.completed ? 'text-gray-900' : 'text-gray-400'}`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* AI Suggestion */}
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">AI System Recommendation</h3>
              <p className="text-sm text-gray-700">
                Based on roof area (450 sq ft) and electricity consumption analysis: <strong>Suggested system size: 12.4 KW</strong>
                <br />
                Optimal panel configuration: 31 panels × 400W with South-facing orientation.
              </p>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Photo Upload Section */}
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Site Photos
          </h3>
          
          <div className="space-y-4">
            {/* Roof Photo */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-500 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Roof Photo</span>
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div className="bg-gray-100 rounded-lg h-32 flex items-center justify-center mb-2">
                <img 
                  src="https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop" 
                  alt="Roof" 
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <p className="text-xs text-gray-500">Uploaded 10:30 AM</p>
            </div>

            {/* Meter Photo */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-500 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Electricity Meter</span>
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div className="bg-gray-100 rounded-lg h-32 flex items-center justify-center mb-2">
                <img 
                  src="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&h=300&fit=crop" 
                  alt="Meter" 
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <p className="text-xs text-gray-500">Uploaded 10:32 AM</p>
            </div>

            {/* Shadow Photo */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-500 transition-colors cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Shadow Analysis Photo</span>
                <Circle className="w-5 h-5 text-gray-300" />
              </div>
              <div className="bg-gray-50 rounded-lg h-32 flex flex-col items-center justify-center gap-2">
                <Upload className="w-8 h-8 text-gray-400" />
                <p className="text-sm text-gray-500">Click to upload</p>
              </div>
            </div>
          </div>

          {/* GPS Location */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-center gap-3">
            <MapPin className="w-5 h-5 text-blue-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">GPS Location Captured</p>
              <p className="text-xs text-gray-600">23.0225° N, 72.5714° E</p>
            </div>
            <CheckCircle2 className="w-5 h-5 text-green-600" />
          </div>
        </Card>

        {/* Measurements Section */}
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Gauge className="w-5 h-5" />
            Site Measurements
          </h3>

          <div className="space-y-6">
            {/* Roof Area */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Roof Area (sq ft)
              </label>
              <Input 
                type="number" 
                value={roofArea}
                onChange={(e) => setRoofArea(e.target.value)}
                className="text-lg"
              />
            </div>

            {/* Shadow Percentage */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Shadow Percentage: <span className="text-blue-600">{shadowPercentage[0]}%</span>
              </label>
              <Slider 
                value={shadowPercentage}
                onValueChange={setShadowPercentage}
                max={100}
                step={1}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>No Shadow</span>
                <span>Full Shadow</span>
              </div>
            </div>

            {/* Panel Direction */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-3 block">
                Panel Direction/Orientation
              </label>
              <div className="grid grid-cols-2 gap-3">
                {['North', 'South', 'East', 'West'].map((dir) => (
                  <Button
                    key={dir}
                    variant={direction === dir ? 'default' : 'outline'}
                    onClick={() => setDirection(dir)}
                    className="h-12"
                  >
                    <Compass className="w-4 h-4 mr-2" />
                    {dir}
                  </Button>
                ))}
              </div>
            </div>

            {/* Roof Type */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-3 block">
                Roof Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                {['Flat', 'Sloped', 'Mixed', 'Ground'].map((type) => (
                  <Button
                    key={type}
                    variant="outline"
                    className="h-12"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    {type}
                  </Button>
                ))}
              </div>
            </div>

            {/* Calculated Output */}
            <Card className="p-4 bg-green-50 border-green-200">
              <h4 className="font-semibold text-gray-900 mb-2 text-sm">Estimated System Capacity</h4>
              <p className="text-2xl font-bold text-green-700">12.4 KW</p>
              <p className="text-xs text-gray-600 mt-1">
                Based on {roofArea} sq ft area with {shadowPercentage[0]}% shadow factor
              </p>
            </Card>
          </div>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button variant="outline">Save as Draft</Button>
        <div className="flex gap-3">
          <Button variant="outline">Previous Step</Button>
          <Button className="gap-2">
            Continue to Shadow Analysis
            <CheckCircle2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
