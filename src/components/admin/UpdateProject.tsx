
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { httpFile } from '../../config.js';

interface ProjectDetails {
  _id: string;
  projectName: string;
  serviceType: string;
  businessDescription: string;
  targetAudience: string;
  preferredColors: string;
  status: number;
  createdAt: string;
}

export function UpdateProject() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [formData, setFormData] = useState({
    projectName: '',
    serviceType: '',
    businessDescription: '',
    targetAudience: '',
    preferredColors: ''
  });

  // Fetch project details
  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("No authentication token found");
          navigate("/login");
          return;
        }

        const res = await httpFile.get(`getProject/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.status === 200 && res.data.data) {
          const projectData = res.data.data;
          setProject(projectData);
          setFormData({
            projectName: projectData.projectName || '',
            serviceType: projectData.serviceType || '',
            businessDescription: projectData.businessDescription || '',
            targetAudience: projectData.targetAudience || '',
            preferredColors: projectData.preferredColors || ''
          });
        } else {
          toast.error("Project not found");
          navigate("/admin/project-list");
        }
      } catch (err) {
        console.error("Error fetching project:", err);
        toast.error("Failed to load project details");
        navigate("/admin/project-list");
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchProjectDetails();
    }
  }, [projectId, navigate]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!formData.projectName.trim()) {
      toast.error("Project name is required");
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await httpFile.put(`updateProject/${projectId}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.status === 200) {
        toast.success("Project updated successfully!");
        navigate("/admin/project-list");
      } else {
        toast.error("Failed to update project");
      }
    } catch (err) {
      console.error("Error updating project:", err);
      toast.error("Failed to update project");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h2>
          <Button onClick={() => navigate("/admin/project-list")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-poppins">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => navigate("/admin/project-list")}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Projects</span>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Update Project</h1>
            <p className="text-gray-600">Modify your project details</p>
          </div>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      {/* Project Details Form */}
      <Card>
        <CardHeader>
          <CardTitle>Project Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Project Name *
              </label>
              <Input
                value={formData.projectName}
                onChange={(e) => handleInputChange('projectName', e.target.value)}
                placeholder="Enter project name"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Service Type
              </label>
              <Input
                value={formData.serviceType}
                onChange={(e) => handleInputChange('serviceType', e.target.value)}
                placeholder="Enter service type"
                className="w-full"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Business Description
            </label>
            <Textarea
              value={formData.businessDescription}
              onChange={(e) => handleInputChange('businessDescription', e.target.value)}
              placeholder="Describe your business..."
              className="w-full h-24"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Target Audience
            </label>
            <Textarea
              value={formData.targetAudience}
              onChange={(e) => handleInputChange('targetAudience', e.target.value)}
              placeholder="Describe your target audience..."
              className="w-full h-20"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Preferred Colors
            </label>
            <Input
              value={formData.preferredColors}
              onChange={(e) => handleInputChange('preferredColors', e.target.value)}
              placeholder="e.g., Blue, White, Gray"
              className="w-full"
            />
          </div>

          {/* Project Status Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Project Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Status: </span>
                <span className={`font-medium ${project.status === 2 ? 'text-green-600' : 'text-gray-600'}`}>
                  {project.status === 2 ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Created: </span>
                <span className="text-gray-900">
                  {new Date(project.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default UpdateProject;
