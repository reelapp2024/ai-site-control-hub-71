import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Plus, 
  Trash2, 
  Settings, 
  Globe, 
  Database,
  Mail,
  Shield,
  Palette,
  Code,
  Users,
  BarChart3,
  Search,
  Filter,
  Download,
  Upload,
  Eye,
  Edit,
  Copy,
  ExternalLink,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  Info
} from "lucide-react";

export function CreateProject() {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [template, setTemplate] = useState("");
  const [features, setFeatures] = useState<string[]>([]);
  const [isAdvanced, setIsAdvanced] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const handleFeatureToggle = (feature: string) => {
    setFeatures(prev => 
      prev.includes(feature) 
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCreateProject = () => {
    // Handle project creation logic here
    console.log("Creating project:", {
      projectName,
      description,
      category,
      template,
      features,
      isAdvanced
    });
  };

  const templates = [
    {
      id: "saas",
      name: "SaaS Landing Page",
      description: "Modern landing page for software products",
      features: ["Responsive Design", "Contact Forms", "Pricing Tables"],
      preview: "/api/placeholder/400/250"
    },
    {
      id: "ecommerce",
      name: "E-commerce Store",
      description: "Complete online store with shopping cart",
      features: ["Product Catalog", "Shopping Cart", "Payment Integration"],
      preview: "/api/placeholder/400/250"
    },
    {
      id: "portfolio",
      name: "Portfolio Website",
      description: "Showcase your work and skills",
      features: ["Gallery", "Blog", "Contact Form"],
      preview: "/api/placeholder/400/250"
    },
    {
      id: "blog",
      name: "Blog Platform",
      description: "Content management and blogging",
      features: ["CMS", "Comments", "SEO Optimization"],
      preview: "/api/placeholder/400/250"
    }
  ];

  const availableFeatures = [
    { id: "auth", name: "User Authentication", icon: Shield },
    { id: "database", name: "Database Integration", icon: Database },
    { id: "email", name: "Email Integration", icon: Mail },
    { id: "analytics", name: "Analytics Dashboard", icon: BarChart3 },
    { id: "api", name: "REST API", icon: Code },
    { id: "social", name: "Social Media Integration", icon: Users },
    { id: "seo", name: "SEO Optimization", icon: Search },
    { id: "responsive", name: "Mobile Responsive", icon: Globe }
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="projectName">Project Name *</Label>
              <Input
                id="projectName"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Enter your project name"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your project (optional)"
                className="mt-1"
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select project category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="ecommerce">E-commerce</SelectItem>
                  <SelectItem value="portfolio">Portfolio</SelectItem>
                  <SelectItem value="blog">Blog</SelectItem>
                  <SelectItem value="saas">SaaS</SelectItem>
                  <SelectItem value="nonprofit">Non-profit</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Choose a Template</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map((tmpl) => (
                  <Card 
                    key={tmpl.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      template === tmpl.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => setTemplate(tmpl.id)}
                  >
                    <CardContent className="p-4">
                      <div className="aspect-video bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                        <Globe className="h-8 w-8 text-gray-400" />
                      </div>
                      <h4 className="font-semibold mb-2">{tmpl.name}</h4>
                      <p className="text-sm text-gray-600 mb-3">{tmpl.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {tmpl.features.map((feature) => (
                          <Badge key={feature} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Select Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableFeatures.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div key={feature.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <Checkbox
                        id={feature.id}
                        checked={features.includes(feature.id)}
                        onCheckedChange={() => handleFeatureToggle(feature.id)}
                      />
                      <Icon className="h-5 w-5 text-gray-500" />
                      <Label htmlFor={feature.id} className="flex-1 cursor-pointer">
                        {feature.name}
                      </Label>
                    </div>
                  );
                })}
              </div>
            </div>

            <Separator />

            <div>
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="advanced"
                  checked={isAdvanced}
                  onCheckedChange={setIsAdvanced}
                />
                <Label htmlFor="advanced" className="cursor-pointer">
                  Enable Advanced Configuration
                </Label>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Access to custom code, API integrations, and advanced settings
              </p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Review Your Project</h3>
              <p className="text-gray-600">
                Please review your project configuration before creating
              </p>
            </div>

            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Project Name</Label>
                  <p className="font-medium">{projectName || "Untitled Project"}</p>
                </div>

                {description && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Description</Label>
                    <p className="text-sm">{description}</p>
                  </div>
                )}

                <div>
                  <Label className="text-sm font-medium text-gray-500">Category</Label>
                  <p className="font-medium capitalize">{category || "Not selected"}</p>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-500">Template</Label>
                  <p className="font-medium">
                    {templates.find(t => t.id === template)?.name || "No template selected"}
                  </p>
                </div>

                {features.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Selected Features</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {features.map((featureId) => {
                        const feature = availableFeatures.find(f => f.id === featureId);
                        return (
                          <Badge key={featureId} variant="secondary">
                            {feature?.name}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div>
                  <Label className="text-sm font-medium text-gray-500">Configuration</Label>
                  <p className="font-medium">
                    {isAdvanced ? "Advanced" : "Standard"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create New Project</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Set up your new AI-generated website project
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                  ${currentStep >= step 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                  }
                `}>
                  {step}
                </div>
                {step < 4 && (
                  <div className={`
                    w-20 h-1 mx-2
                    ${currentStep > step ? 'bg-blue-600' : 'bg-gray-200'}
                  `} />
                )}
              </div>
            ))}
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">
              {currentStep === 1 && "Basic Information"}
              {currentStep === 2 && "Choose Template"}
              {currentStep === 3 && "Select Features"}
              {currentStep === 4 && "Review & Create"}
            </h2>
            <p className="text-gray-600">
              {currentStep === 1 && "Enter basic details about your project"}
              {currentStep === 2 && "Select a template that matches your needs"}
              {currentStep === 3 && "Choose additional features for your project"}
              {currentStep === 4 && "Review your configuration and create the project"}
            </p>
          </div>

          {renderStepContent()}

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            
            {currentStep < 4 ? (
              <Button
                onClick={nextStep}
                disabled={currentStep === 1 && !projectName}
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleCreateProject}
                disabled={!projectName || !category}
                className="bg-green-600 hover:bg-green-700"
              >
                Create Project
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Upload className="h-8 w-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Import Project</h3>
            <p className="text-sm text-gray-600 mb-4">
              Import an existing project or template
            </p>
            <Button variant="outline" size="sm">
              Import
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Copy className="h-8 w-8 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Clone Project</h3>
            <p className="text-sm text-gray-600 mb-4">
              Create a copy of an existing project
            </p>
            <Button variant="outline" size="sm">
              Clone
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Star className="h-8 w-8 text-purple-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Use Template</h3>
            <p className="text-sm text-gray-600 mb-4">
              Start with a pre-built template
            </p>
            <Button variant="outline" size="sm">
              Browse
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
