
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, Loader2, ChevronRight, ChevronLeft, Edit3, Palette, Users, Building2, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function UpdateProject() {
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  // Mock data - replace with actual API data
  const [formData, setFormData] = useState({
    projectName: 'E-Commerce Website',
    serviceType: 'Web Development',
    businessDescription: 'A modern e-commerce platform for selling electronics and gadgets with advanced features like payment integration, inventory management, and customer reviews.',
    targetAudience: 'Tech enthusiasts, gadget lovers, and online shoppers aged 18-45 who prefer convenient online shopping experiences.',
    preferredColors: 'Blue, White, Gray',
    features: 'Payment Integration, User Authentication, Product Catalog, Shopping Cart, Order Management'
  });

  const steps = [
    { id: 1, title: 'Project Details', icon: Building2, description: 'Basic project information' },
    { id: 2, title: 'Business Info', icon: Users, description: 'Target audience & description' },
    { id: 3, title: 'Design Preferences', icon: Palette, description: 'Colors and styling' },
    { id: 4, title: 'Review & Update', icon: CheckCircle, description: 'Confirm your changes' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulate saving delay
    setTimeout(() => {
      setSaving(false);
      console.log('Project updated:', formData);
      navigate("/admin/project-list");
    }, 2000);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Building2 className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Project Details</h2>
              <p className="text-gray-600">Update your basic project information</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <Label htmlFor="projectName" className="text-sm font-semibold text-gray-700 mb-2 block">
                  Project Name *
                </Label>
                <Input
                  id="projectName"
                  value={formData.projectName}
                  onChange={(e) => handleInputChange('projectName', e.target.value)}
                  placeholder="Enter your project name"
                  className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <Label htmlFor="serviceType" className="text-sm font-semibold text-gray-700 mb-2 block">
                  Service Type
                </Label>
                <Input
                  id="serviceType"
                  value={formData.serviceType}
                  onChange={(e) => handleInputChange('serviceType', e.target.value)}
                  placeholder="e.g., Web Development, Mobile App, etc."
                  className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Users className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Business Information</h2>
              <p className="text-gray-600">Tell us about your business and target audience</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <Label htmlFor="businessDescription" className="text-sm font-semibold text-gray-700 mb-2 block">
                  Business Description
                </Label>
                <Textarea
                  id="businessDescription"
                  value={formData.businessDescription}
                  onChange={(e) => handleInputChange('businessDescription', e.target.value)}
                  placeholder="Describe your business, what you do, and your goals..."
                  className="h-32 border-gray-200 focus:border-green-500 focus:ring-green-500 resize-none"
                />
              </div>
              
              <div>
                <Label htmlFor="targetAudience" className="text-sm font-semibold text-gray-700 mb-2 block">
                  Target Audience
                </Label>
                <Textarea
                  id="targetAudience"
                  value={formData.targetAudience}
                  onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                  placeholder="Who are your ideal customers? Age, interests, demographics..."
                  className="h-24 border-gray-200 focus:border-green-500 focus:ring-green-500 resize-none"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Palette className="h-16 w-16 text-purple-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Design Preferences</h2>
              <p className="text-gray-600">Customize the look and feel of your project</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <Label htmlFor="preferredColors" className="text-sm font-semibold text-gray-700 mb-2 block">
                  Preferred Colors
                </Label>
                <Input
                  id="preferredColors"
                  value={formData.preferredColors}
                  onChange={(e) => handleInputChange('preferredColors', e.target.value)}
                  placeholder="e.g., Blue, White, Gray, Red"
                  className="h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
              
              <div>
                <Label htmlFor="features" className="text-sm font-semibold text-gray-700 mb-2 block">
                  Key Features
                </Label>
                <Textarea
                  id="features"
                  value={formData.features}
                  onChange={(e) => handleInputChange('features', e.target.value)}
                  placeholder="List the main features you want in your project..."
                  className="h-24 border-gray-200 focus:border-purple-500 focus:ring-purple-500 resize-none"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <CheckCircle className="h-16 w-16 text-emerald-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Review & Update</h2>
              <p className="text-gray-600">Please review your changes before updating</p>
            </div>
            
            <div className="space-y-4">
              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Project Details</h3>
                  <p className="text-sm text-gray-600 mb-1"><strong>Name:</strong> {formData.projectName}</p>
                  <p className="text-sm text-gray-600"><strong>Type:</strong> {formData.serviceType}</p>
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-l-green-500">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Business Information</h3>
                  <p className="text-sm text-gray-600 mb-2"><strong>Description:</strong> {formData.businessDescription.substring(0, 100)}...</p>
                  <p className="text-sm text-gray-600"><strong>Target Audience:</strong> {formData.targetAudience.substring(0, 80)}...</p>
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-l-purple-500">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Design Preferences</h3>
                  <p className="text-sm text-gray-600 mb-1"><strong>Colors:</strong> {formData.preferredColors}</p>
                  <p className="text-sm text-gray-600"><strong>Features:</strong> {formData.features}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6 font-poppins">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => navigate("/admin/project-list")}
              className="flex items-center space-x-2 hover:bg-blue-50 border-blue-200"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Projects</span>
            </Button>
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <Edit3 className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Update Project</h1>
                <p className="text-gray-600">Project ID: {projectId}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                      isActive 
                        ? 'border-blue-500 bg-blue-500 text-white shadow-lg' 
                        : isCompleted 
                        ? 'border-green-500 bg-green-500 text-white' 
                        : 'border-gray-300 bg-white text-gray-400'
                    }`}>
                      <StepIcon className="h-5 w-5" />
                    </div>
                    <div className="mt-2 text-center">
                      <p className={`text-sm font-medium ${isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'}`}>
                        {step.title}
                      </p>
                      <p className="text-xs text-gray-400">{step.description}</p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-4 transition-all duration-300 ${
                      currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg">
          <CardContent className="p-8">
            {renderStepContent()}
            
            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="flex items-center space-x-2"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </Button>
              
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="px-3 py-1">
                  Step {currentStep} of {steps.length}
                </Badge>
              </div>
              
              {currentStep < steps.length ? (
                <Button
                  onClick={handleNext}
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Update Project</span>
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default UpdateProject;
