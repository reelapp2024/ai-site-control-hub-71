import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Plus, X, ChevronDown, ChevronUp, CheckCircle, Clock, Code, Zap } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface Feature {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: string;
  dependencies: string[];
  selected: boolean;
}

interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  features: string[];
  icon: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
}

export const CreateProject = () => {
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [customFeatures, setCustomFeatures] = useState<string[]>([]);
  const [newCustomFeature, setNewCustomFeature] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [businessGoals, setBusinessGoals] = useState("");
  const [technicalRequirements, setTechnicalRequirements] = useState("");
  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState("");
  const [priority, setPriority] = useState("medium");
  const [activeStep, setActiveStep] = useState(1);
  const [totalSteps] = useState(6);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [projectType, setProjectType] = useState("web");
  const [platform, setPlatform] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState<Date>();
  const [stakeholders, setStakeholders] = useState<string[]>([]);
  const [newStakeholder, setNewStakeholder] = useState("");
  const [riskAssessment, setRiskAssessment] = useState("");
  const [successMetrics, setSuccessMetrics] = useState<string[]>([]);
  const [newSuccessMetric, setNewSuccessMetric] = useState("");
  const [projectScope, setProjectScope] = useState("");
  const [constraints, setConstraints] = useState("");
  const [assumptions, setAssumptions] = useState("");
  const [deliverables, setDeliverables] = useState<string[]>([]);
  const [newDeliverable, setNewDeliverable] = useState("");
  const [capacity, setCapacity] = useState(0);
  const [throughput, setThroughput] = useState(0);
  const [latency, setLatency] = useState(0);
  const [responseTime, setResponseTime] = useState(0);
  const [securityRequirements, setSecurityRequirements] = useState("");
  const [complianceRequirements, setComplianceRequirements] = useState("");
  const [scalabilityRequirements, setScalabilityRequirements] = useState("");
  const [integrationRequirements, setIntegrationRequirements] = useState("");
  const [usabilityRequirements, setUsabilityRequirements] = useState("");
  const [accessibilityRequirements, setAccessibilityRequirements] = useState("");
  const [maintenanceRequirements, setMaintenanceRequirements] = useState("");
  const [supportRequirements, setSupportRequirements] = useState("");

  const projectTemplates: ProjectTemplate[] = [
    {
      id: "ecommerce",
      name: "E-commerce Platform",
      description: "Complete online store with product catalog, shopping cart, payment processing, and order management",
      category: "Business",
      features: ["user-auth", "product-catalog", "shopping-cart", "payment-gateway", "order-management"],
      icon: "ShoppingCart",
      difficulty: "intermediate",
      estimatedTime: "8-12 weeks"
    },
    {
      id: "blog",
      name: "Blog Platform",
      description: "Content management system with posts, comments, and user management",
      category: "Content",
      features: ["user-auth", "cms", "comments", "search"],
      icon: "FileText",
      difficulty: "beginner",
      estimatedTime: "4-6 weeks"
    },
    {
      id: "dashboard",
      name: "Analytics Dashboard",
      description: "Data visualization platform with charts, reports, and real-time updates",
      category: "Analytics",
      features: ["data-viz", "real-time", "reports", "user-auth"],
      icon: "BarChart",
      difficulty: "intermediate",
      estimatedTime: "6-8 weeks"
    }
  ];

  const features: Feature[] = [
    {
      id: "user-auth",
      name: "User Authentication",
      category: "Security",
      description: "Complete user registration, login, password reset, and profile management system",
      icon: "User",
      difficulty: "medium",
      estimatedTime: "1-2 weeks",
      dependencies: [],
      selected: false
    },
    {
      id: "product-catalog",
      name: "Product Catalog",
      category: "E-commerce",
      description: "Product listing, categorization, search, and filtering functionality",
      icon: "Package",
      difficulty: "medium",
      estimatedTime: "2-3 weeks",
      dependencies: ["user-auth"],
      selected: false
    },
    {
      id: "shopping-cart",
      name: "Shopping Cart",
      category: "E-commerce",
      description: "Add to cart, cart management, and checkout process",
      icon: "ShoppingCart",
      difficulty: "medium",
      estimatedTime: "1-2 weeks",
      dependencies: ["product-catalog"],
      selected: false
    },
    {
      id: "payment-gateway",
      name: "Payment Processing",
      category: "E-commerce",
      description: "Integration with payment providers like Stripe, PayPal",
      icon: "CreditCard",
      difficulty: "hard",
      estimatedTime: "2-3 weeks",
      dependencies: ["shopping-cart"],
      selected: false
    },
    {
      id: "cms",
      name: "Content Management",
      category: "Content",
      description: "Create, edit, and manage content with rich text editor",
      icon: "Edit",
      difficulty: "medium",
      estimatedTime: "2-3 weeks",
      dependencies: ["user-auth"],
      selected: false
    },
    {
      id: "data-viz",
      name: "Data Visualization",
      category: "Analytics",
      description: "Charts, graphs, and interactive data visualization components",
      icon: "BarChart",
      difficulty: "hard",
      estimatedTime: "3-4 weeks",
      dependencies: [],
      selected: false
    }
  ];

  const handleNext = () => {
    if (activeStep < totalSteps) {
      setActiveStep(activeStep + 1);
    }
  };

  const handlePrevious = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleFeatureToggle = (featureId: string) => {
    setSelectedFeatures(prev => 
      prev.includes(featureId) 
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
    );
  };

  const handlePlatformToggle = (platformValue: string) => {
    setPlatform(prev => 
      prev.includes(platformValue) 
        ? prev.filter(p => p !== platformValue)
        : [...prev, platformValue]
    );
  };

  const addCustomFeature = () => {
    if (newCustomFeature.trim()) {
      setCustomFeatures(prev => [...prev, newCustomFeature.trim()]);
      setNewCustomFeature("");
    }
  };

  const removeCustomFeature = (index: number) => {
    setCustomFeatures(prev => prev.filter((_, i) => i !== index));
  };

  const addStakeholder = () => {
    if (newStakeholder.trim()) {
      setStakeholders(prev => [...prev, newStakeholder.trim()]);
      setNewStakeholder("");
    }
  };

  const removeStakeholder = (index: number) => {
    setStakeholders(prev => prev.filter((_, i) => i !== index));
  };

  const addSuccessMetric = () => {
    if (newSuccessMetric.trim()) {
      setSuccessMetrics(prev => [...prev, newSuccessMetric.trim()]);
      setNewSuccessMetric("");
    }
  };

  const removeSuccessMetric = (index: number) => {
    setSuccessMetrics(prev => prev.filter((_, i) => i !== index));
  };

  const addDeliverable = () => {
    if (newDeliverable.trim()) {
      setDeliverables(prev => [...prev, newDeliverable.trim()]);
      setNewDeliverable("");
    }
  };

  const removeDeliverable = (index: number) => {
    setDeliverables(prev => prev.filter((_, i) => i !== index));
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = projectTemplates.find(t => t.id === templateId);
    if (template) {
      setSelectedFeatures(template.features);
      if (template.name && !projectName) {
        setProjectName(template.name);
      }
      if (template.description && !projectDescription) {
        setProjectDescription(template.description);
      }
    }
  };

  const handleSubmit = () => {
    const projectData = {
      name: projectName,
      description: projectDescription,
      template: selectedTemplate,
      features: selectedFeatures,
      customFeatures,
      targetAudience,
      businessGoals,
      technicalRequirements,
      budget,
      timeline,
      priority,
      projectType,
      platform,
      dueDate,
      stakeholders,
      riskAssessment,
      successMetrics,
      projectScope,
      constraints,
      assumptions,
      deliverables,
      capacity,
      throughput,
      latency,
      responseTime,
      securityRequirements,
      complianceRequirements,
      scalabilityRequirements,
      integrationRequirements,
      usabilityRequirements,
      accessibilityRequirements,
      maintenanceRequirements,
      supportRequirements
    };

    console.log("Creating project:", projectData);
    
    toast({
      title: "Project Created Successfully!",
      description: `${projectName} has been created with ${selectedFeatures.length} features.`,
    });
  };

  const getStepTitle = (step: number) => {
    const titles = [
      "Project Basics",
      "Template Selection", 
      "Features & Functionality",
      "Requirements & Planning",
      "Advanced Configuration",
      "Review & Create"
    ];
    return titles[step - 1];
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="projectName">Project Name *</Label>
                <Input
                  id="projectName"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Enter project name"
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="projectType">Project Type</Label>
                <Select value={projectType} onValueChange={setProjectType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select project type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="web">Web Application</SelectItem>
                    <SelectItem value="mobile">Mobile App</SelectItem>
                    <SelectItem value="desktop">Desktop Application</SelectItem>
                    <SelectItem value="api">API/Backend Service</SelectItem>
                    <SelectItem value="fullstack">Full Stack</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectDescription">Project Description</Label>
              <Textarea
                id="projectDescription"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                placeholder="Describe your project goals and vision"
                rows={4}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label>Target Platforms</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {["Web", "iOS", "Android", "Desktop", "PWA", "Chrome Extension"].map((plat) => (
                  <div key={plat} className="flex items-center space-x-2">
                    <Checkbox
                      id={plat}
                      checked={platform.includes(plat)}
                      onCheckedChange={() => handlePlatformToggle(plat)}
                    />
                    <Label htmlFor={plat} className="text-sm font-normal cursor-pointer">
                      {plat}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="priority">Priority Level</Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">Budget Range</Label>
                <Input
                  id="budget"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="e.g., $10,000 - $50,000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeline">Timeline</Label>
                <Input
                  id="timeline"
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  placeholder="e.g., 3-6 months"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Due Date (Optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">Choose a Project Template</h3>
              <p className="text-sm text-muted-foreground">
                Select a template to get started quickly, or skip to build from scratch
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projectTemplates.map((template) => (
                <Card 
                  key={template.id}
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-md",
                    selectedTemplate === template.id && "ring-2 ring-primary"
                  )}
                  onClick={() => handleTemplateSelect(template.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Code className="h-4 w-4" />
                        {template.name}
                      </CardTitle>
                      <span className={cn(
                        "text-xs px-2 py-1 rounded-full",
                        template.difficulty === "beginner" && "bg-green-100 text-green-700",
                        template.difficulty === "intermediate" && "bg-yellow-100 text-yellow-700",
                        template.difficulty === "advanced" && "bg-red-100 text-red-700"
                      )}>
                        {template.difficulty}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {template.estimatedTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Zap className="h-3 w-3" />
                        {template.features.length} features
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Button
                variant="outline"
                onClick={() => setSelectedTemplate("")}
                className={cn(!selectedTemplate && "ring-2 ring-primary")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Start from Scratch
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">Select Features</h3>
              <p className="text-sm text-muted-foreground">
                Choose the features you want to include in your project
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((feature) => (
                <Card 
                  key={feature.id}
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-md",
                    selectedFeatures.includes(feature.id) && "ring-2 ring-primary"
                  )}
                  onClick={() => handleFeatureToggle(feature.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Checkbox
                          checked={selectedFeatures.includes(feature.id)}
                          disabled
                        />
                        {feature.name}
                      </CardTitle>
                      <span className={cn(
                        "text-xs px-2 py-1 rounded-full",
                        feature.difficulty === "easy" && "bg-green-100 text-green-700",
                        feature.difficulty === "medium" && "bg-yellow-100 text-yellow-700",
                        feature.difficulty === "hard" && "bg-red-100 text-red-700"
                      )}>
                        {feature.difficulty}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {feature.estimatedTime}
                      </span>
                      <span className="px-2 py-1 bg-muted rounded text-xs">
                        {feature.category}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Custom Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newCustomFeature}
                    onChange={(e) => setNewCustomFeature(e.target.value)}
                    placeholder="Add a custom feature"
                    onKeyPress={(e) => e.key === 'Enter' && addCustomFeature()}
                  />
                  <Button onClick={addCustomFeature} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                {customFeatures.length > 0 && (
                  <div className="space-y-2">
                    {customFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                        <span className="text-sm">{feature}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCustomFeature(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      default:
        return <div>Content for step {activeStep}</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 dark:from-gray-950 dark:via-purple-950 dark:to-gray-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-gray-800/20">
          <div className="p-6 md:p-8">
            {/* Header */}
            <div className="text-center space-y-2 mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-purple-900 dark:text-purple-100">
                Create New Project
              </h1>
              <p className="text-sm md:text-base text-purple-600 dark:text-purple-300">
                Set up your project with detailed requirements and configuration
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                  Step {activeStep} of {totalSteps}: {getStepTitle(activeStep)}
                </span>
                <span className="text-sm text-purple-600 dark:text-purple-400">
                  {Math.round((activeStep / totalSteps) * 100)}% Complete
                </span>
              </div>
              <div className="w-full bg-purple-100 dark:bg-purple-900 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(activeStep / totalSteps) * 100}%` }}
                />
              </div>
            </div>

            {/* Step Content */}
            <div className="mb-8">
              {renderStepContent()}
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={activeStep === 1}
                className="flex items-center gap-2"
              >
                <ChevronDown className="h-4 w-4 rotate-90" />
                Previous
              </Button>

              <div className="flex gap-2">
                {activeStep < totalSteps ? (
                  <Button
                    onClick={handleNext}
                    disabled={activeStep === 1 && !projectName.trim()}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
                  >
                    Next
                    <ChevronDown className="h-4 w-4 -rotate-90" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={!projectName.trim()}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Create Project
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
