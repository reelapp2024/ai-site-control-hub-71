
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, Loader2, Calendar, User, Tag, Palette, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function UpdateProject() {
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  
  // Mock data for design purposes - you can replace with real API data
  const [formData, setFormData] = useState({
    projectName: 'E-Commerce Website',
    serviceType: 'Web Development',
    businessDescription: 'A modern e-commerce platform for selling electronics and gadgets with advanced features like payment integration, inventory management, and customer reviews.',
    targetAudience: 'Tech enthusiasts, gadget lovers, and online shoppers aged 18-45 who prefer convenient online shopping experiences.',
    preferredColors: 'Blue, White, Gray'
  });

  // Mock project status data
  const projectStatus = {
    status: 2,
    createdAt: '2024-01-15T10:30:00Z',
    lastUpdated: '2024-01-20T14:45:00Z',
    totalImages: 12
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulate saving delay
    setTimeout(() => {
      setSaving(false);
      // Here you'll add your API call
      console.log('Project data to save:', formData);
      // navigate("/admin/project-list");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6 font-poppins">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
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
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Update Project</h1>
                <p className="text-gray-600">Modify your project details</p>
              </div>
            </div>
          </div>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving Changes...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>

        {/* Project Status Card */}
        <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
            <CardTitle className="flex items-center space-x-2 text-blue-900">
              <Tag className="h-5 w-5" />
              <span>Project Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-green-100">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    {projectStatus.status === 2 ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  <Calendar className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Created</p>
                  <p className="font-medium text-gray-900">
                    {new Date(projectStatus.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-purple-100">
                  <User className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Last Updated</p>
                  <p className="font-medium text-gray-900">
                    {new Date(projectStatus.lastUpdated).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-orange-100">
                  <FileText className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Images</p>
                  <Badge className="bg-orange-100 text-orange-700">
                    {projectStatus.totalImages}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Project Details Form */}
        <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-lg">
            <CardTitle className="flex items-center space-x-2 text-indigo-900">
              <FileText className="h-5 w-5" />
              <span>Project Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <span>Project Name *</span>
                </label>
                <Input
                  value={formData.projectName}
                  onChange={(e) => handleInputChange('projectName', e.target.value)}
                  placeholder="Enter project name"
                  className="w-full h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-3">
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                  <Tag className="h-4 w-4 text-indigo-600" />
                  <span>Service Type</span>
                </label>
                <Input
                  value={formData.serviceType}
                  onChange={(e) => handleInputChange('serviceType', e.target.value)}
                  placeholder="Enter service type"
                  className="w-full h-12 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                <FileText className="h-4 w-4 text-purple-600" />
                <span>Business Description</span>
              </label>
              <Textarea
                value={formData.businessDescription}
                onChange={(e) => handleInputChange('businessDescription', e.target.value)}
                placeholder="Describe your business in detail..."
                className="w-full h-32 border-gray-200 focus:border-purple-500 focus:ring-purple-500 resize-none"
              />
            </div>

            <div className="space-y-3">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                <User className="h-4 w-4 text-green-600" />
                <span>Target Audience</span>
              </label>
              <Textarea
                value={formData.targetAudience}
                onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                placeholder="Describe your target audience..."
                className="w-full h-24 border-gray-200 focus:border-green-500 focus:ring-green-500 resize-none"
              />
            </div>

            <div className="space-y-3">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                <Palette className="h-4 w-4 text-pink-600" />
                <span>Preferred Colors</span>
              </label>
              <Input
                value={formData.preferredColors}
                onChange={(e) => handleInputChange('preferredColors', e.target.value)}
                placeholder="e.g., Blue, White, Gray"
                className="w-full h-12 border-gray-200 focus:border-pink-500 focus:ring-pink-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => navigate("/admin/project-list")}
                className="px-6 py-3 border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Update Project
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default UpdateProject;
